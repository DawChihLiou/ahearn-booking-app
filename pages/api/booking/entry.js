import knex from "knex";
import uuid from "node-uuid";
import shortid from "shortid";
import moment from "moment/moment";
import closedDaysCalculation from "/lib/closed";
import { MongoClient } from "mongodb";

import Server from "socket.io";
import redisAdapter from "socket.io-redis";

import AWS from "aws-sdk";
import { Email, Item, Span, A, Image, renderEmail } from "react-html-email";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  const { body } = req;
  console.log(body);

  const {
    employee_id,
    time,
    person: { gender, vorname, nachname, dob, age },
    contact: { tel, mail, strasse, hausnummer, plz, ort },
    eType,
  } = body;
  console.log(eType);

  const dates = [moment(time).utc().format("YYYY-MM-DD HH:mm")];
  dates.push(moment(time).add(15, "minutes").utc().format("YYYY-MM-DD HH:mm"));
  dates.push(moment(time).add(30, "minutes").utc().format("YYYY-MM-DD HH:mm"));

  const datesBefore = [
    moment(time).subtract(15, "minutes").utc().format("YYYY-MM-DD HH:mm"),
    moment(time).subtract(30, "minutes").utc().format("YYYY-MM-DD HH:mm"),
    moment(time).subtract(45, "minutes").utc().format("YYYY-MM-DD HH:mm"),
  ];

  console.log(dates, datesBefore);

  // if (!res.socket.server.io) {
  const io = new Server(res.socket.server);

  io.use((socket, next) => {
    next(new Error("Connection to this server are not allowed"));
  });

  res.socket.server.io = io;
  if (process.env.REDIS_URL) {
    io.adapter(redisAdapter(process.env.REDIS_URL));
  }
  //}

  const db = knex(process.env.DATABASE_URL);
  console.log(process.env.MONGO_URL);
  const mongo = new MongoClient({ url: process.env.MONGO_URL });
  const connection = await mongo.connect(process.env.MONGO_URL);

  const closedEntries = await connection.collection("closed").find().toArray();

  const insertPatient = {
    modified: moment(new Date()).utc().format("YYYY-MM-DD HH:mm:ss"),
    created: moment(new Date()).utc().format("YYYY-MM-DD HH:mm:ss"),
    id: uuid.v4(),
    shortid: shortid.generate(),
    first_name: vorname,
    last_name: nachname,
    mail,
    password: uuid.v4(),
    gender,
    app_created: 1,
    dob: moment(dob).utc().format("YYYY-MM-DD"),
  };

  const employee = await db("employees").where("id", employee_id).first();

  if (!employee) {
    console.log("No Employee found");
    res.status(400).send("Keinen Mitarbeiter gefunden");
    return;
  }

  const slots = await db("treatments")
    .whereIn("treatment_status", ["Ok", "Geblockt"])
    .andWhere("employee_id", employee.id)
    .andWhere("time", moment(time).utc().format("YYYY-MM-DD HH:mm"));

  let availableSlots = Array.apply(null, { length: employee.cols_online }).map(
    Number.call,
    Number
  );
  slots.forEach((t) => {
    console.log(t);
    availableSlots = availableSlots.filter((s) => s != t.slot);
  });

  if (availableSlots.length <= 0) {
    console.log("Not enough slots");
    res.status(400).send("Not enough slots");
    return;
  }

  const closed = [
    closedDaysCalculation.isClosed(closedEntries, moment(time), employee),
    closedDaysCalculation.isClosed(
      closedEntries,
      moment(time).add(15, "minutes").utc(),
      employee
    ),
    closedDaysCalculation.isClosed(
      closedEntries,
      moment(time).add(30, "minutes").utc(),
      employee
    ),
  ];

  if (closed.findIndex((c) => c !== false) > 1) {
    console.log(
      "Hier gibt es eine überschneidung mit einem geschlossenen Zeitpunkt"
    );
    res
      .status(400)
      .send(
        "Hier gibt es eine überschneidung mit einem geschlossenen Zeitpunkt"
      );
    return;
  }

  const alreadyExists = await db("treatments")
    .count("id as CNT")
    .whereIn("treatment_status", ["Ok", "Geblockt"])
    .andWhere("employee_id", employee_id)
    .andWhere("slot", availableSlots[0])
    .whereIn("time", dates)
    .first();

  const alreadyExistsPast15 = await db("treatments")
    .count("id as CNT")
    .whereIn("treatment_status", ["Ok", "Geblockt"])
    .andWhere("employee_id", employee_id)
    .andWhere("slot", availableSlots[0])
    .andWhere("duration", ">", 15)
    .whereIn("time", [datesBefore[0]])
    .first();

  const alreadyExistsPast30 = await db("treatments")
    .count("id as CNT")
    .whereIn("treatment_status", ["Ok", "Geblockt"])
    .andWhere("employee_id", employee_id)
    .andWhere("slot", availableSlots[0])
    .andWhere("duration", ">", 30)
    .whereIn("time", [datesBefore[1]])
    .first();

  const alreadyExistsPast45 = await db("treatments")
    .count("id as CNT")
    .whereIn("treatment_status", ["Ok", "Geblockt"])
    .andWhere("employee_id", employee_id)
    .andWhere("slot", availableSlots[0])
    .andWhere("duration", ">", 45) // 45+ min treatment
    .whereIn("time", [datesBefore[2]])
    .first();

  if (
    alreadyExists.CNT > 0 ||
    alreadyExistsPast15.CNT > 0 ||
    alreadyExistsPast30.CNT > 0 ||
    alreadyExistsPast45.CNT > 0
  ) {
    console.log("Dieser Termin wurde in diesem Augenblick bereits vergeben.");
    res
      .status(400)
      .send("Dieser Termin wurde in diesem Augenblick bereits vergeben.");
    return;
  }

  if (moment(time).diff(moment()) - 3600 * 1000 < 0) {
    console.log("Es lassen sich keine Termine in der Vergangenheit buchen");
    res
      .status(400)
      .send("Es lassen sich keine Termine in der Vergangenheit buchen");
    return;
  }

  await db("patients").insert(insertPatient);
  const patient = await db("patients").where("id", insertPatient.id).first();

  const erwachsen = age >= 16;
  const jugendlich = age >= 12;
  const kind = age < 12 && age > 0;
  const baby = age <= 0;

  let treatment_type = "New";
  let duration = 45;
  if (eType === 30) {
    treatment_type = "New T2";
    duration = 40;
  } else {
    if (jugendlich && !erwachsen) {
      treatment_type = "New-Kind";
      duration = 30;
    } else if (kind) {
      treatment_type = "New-Kind";
      duration = 30;
    } else if (baby) {
      treatment_type = "New-Baby";
      duration = 15;
    }
  }

  const insertTreatment = {
    modified: moment(new Date()).utc().format("YYYY-MM-DD HH:mm:ss"),
    created: moment(new Date()).utc().format("YYYY-MM-DD HH:mm:ss"),
    id: uuid.v4(),
    user_id: patient.id,
    employee_id: employee_id,
    patient_id: patient.id,
    treatment_type: treatment_type,
    treatment_status: "Geblockt",
    time: moment(time).utc().format("YYYY-MM-DD HH:mm"),
    slot: availableSlots[0],
    duration: duration,
    is_created_by_patient: 1,
    ha: 1,
    comment: "#app",
  };

  await db("treatments").insert(insertTreatment);

  await connection.collection("patients_data").insertOne({
    patient_id: patient.id,
    phones: [
      {
        category: "",
        number: tel,
        sms: true,
      },
    ],
    addresses: [
      {
        street: strasse,
        plz: plz,
        city: ort,
        number: hausnummer,
        country: "DE",
        category: "Festnetz",
        co: "",
      },
    ],
  });

  const treatment = await db("treatments")
    .where("id", insertTreatment.id)
    .first();

  // console.log(treatment, employee_id, time, gender, vorname, nachname, tel, mail)

  console.log(treatment);
  io.sockets.emit("addTreatment", { treatment: treatment, patient: patient });

  const emailHTML = renderEmail(
    <Email title={"Deine Terminbuchung bei Ahearn Chiropractic"}>
      <Item align="left">&nbsp;</Item>
      <Item align="center">
        <Image
          src="https://booking.ahearn-chiropractic.de/logo.webp"
          width="104"
          height="179"
          alt="Logo"
        />
        <br />
      </Item>
      {eType != 30 && (
        <>
          <Item align="left">&nbsp;</Item>
          <Item align="left">
            <Span fontWeight={"bold"} fontSize={20} color="#ec6735">
              Hallo {patient.first_name},
            </Span>
            <br />
            <br />
            <Span fontSize="14">
              Dein Termin findet am{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                {moment(time).utc().format("DD.MM.YYYY")}
              </Span>{" "}
              um{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                {moment(time).utc().format("HH:mm")} Uhr
                <br />
              </Span>
              bei uns in der Praxis auf der <br />
              <Span fontWeight={"bold"} color="#ec6735">
                Alexanderstr. 18 in 40210 Düsseldorf
              </Span>{" "}
              statt.
              <br />
              <br />
              Solltest Du den Fragebogen nicht ausgedruckt mitbringen können,
              dann sei bitte 15 Minuten vor Deinem Termin bei uns in der Praxis.
              <br />
              <br />
              Bitte denke, wenn vorhanden an Deine MRTs, Röntgenbilder,
              Vorbefunde und Diagnosen.
              <br />
              <br />
              Wir bitten dich, folgendes Video vor Deinem gebuchten Termin zur
              Information anzusehen:
              <br /> https://youtu.be/but0YUKMAuY
              <A href="https://youtu.be/but0YUKMAuY">
                <Image
                  src="https://booking.ahearn-chiropractic.de/youtube-video.png"
                  width="450"
                  alt="Logo"
                />
              </A>
              <br />
              <br />
              Bitte beachte, dass Dein Erst-Termin mit 80,-€ in Rechnung
              gestellt wird, sollte dieser nicht fristgerecht mindestens 24
              Stunden vor Terminbeginn abgesagt worden sein.
              <br />
              <br />
              Viele Grüße, Dein{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                ahearn-chiropractic
              </Span>{" "}
              Team.
            </Span>
          </Item>
          <Item align="left" fontSize="14">
            <br />
            <br />
            <A href="https://ahearn-chiropractic.de/wp-content/uploads/2024/07/AUC-Datenschutz-u-Patienten_Fragebogen_P2.pdf">
              Fragebogen herunterladen
            </A>
          </Item>
        </>
      )}

      {eType === 30 && (
        <>
          <Item align="left">&nbsp;</Item>
          <Item align="left">
            <Span fontWeight={"bold"} fontSize={20} color="#ec6735">
              Hallo {patient.first_name},
            </Span>
            <br />
            <br />
            <Span fontSize="14">
              Dein Termin findet am{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                {moment(time).utc().format("DD.MM.YYYY")}
              </Span>{" "}
              um{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                {moment(time).utc().format("HH:mm")} Uhr
                <br />
              </Span>
              bei uns in der Praxis auf der <br />
              <Span fontWeight={"bold"} color="#ec6735">
                Max-Planck-Str. 11, 40699 Erkrath
              </Span>{" "}
              statt.
              <br />
              <br />
              Bitte denke, wenn vorhanden an Deine MRTs, Röntgenbilder,
              Vorbefunde und Diagnosen.
              <br />
              <br />
              Wir bitten dich, folgendes Video vor Deinem gebuchten Termin zur
              Information anzusehen: https://youtu.be/but0YUKMAuY
              <a href="https://youtu.be/but0YUKMAuY">
                <Image
                  src="https://booking.ahearn-chiropractic.de/youtube-video.png"
                  width="450"
                  alt="Logo"
                />
              </a>
              <br />
              <br />
              Bitte beachte, dass Dein Erst-Termin mit 80,-€ in Rechnung
              gestellt wird, sollte dieser nicht fristgerecht mindestens 24
              Stunden vor Terminbeginn abgesagt worden sein.
              <br />
              <br />
              Viele Grüße, Dein{" "}
              <Span fontWeight={"bold"} color="#ec6735">
                ahearn-chiropractic
              </Span>{" "}
              Team.
            </Span>
          </Item>
        </>
      )}
    </Email>
  );

  var params = {
    Destination: {
      /* required */ CcAddresses: ["terminbestaetigung@ahearn-chiropractic.de"],
      ToAddresses: [mail],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: emailHTML,
        },
        Text:
          eType != 30
            ? {
                Charset: "UTF-8",
                Data: `Hallo ${patient.first_name}, 
                    dein Termin findet am ${moment(time)
                      .utc()
                      .format("DD.MM.YYYY")} um ${moment(time)
                  .utc()
                  .format("HH:mm")} Uhr
                    bei uns in der Praxis auf der Alexanderstr. 18 in 40210 Düsseldorf statt.
                    Solltest du den Fragebogen nicht ausgedruckt mitbringen können, dann sei bitte 15 Minuten vor den Termin in der Praxis.

                    Gerne möchten wir Dir zur Information folgendes Video vor Deinem gebuchten Termin anzusehen:
                    https://youtu.be/but0YUKMAuY

                    Bitte beachte, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden, 
                    in Höhe von 80€ in Rechnung gestellt werden.

                    Viele Grüße, Dein Ahearn Chiropractic Team.
                    `,
              }
            : {
                Data: `Hallo ${patient.first_name}, 
                    wir freuen uns, Dich bald in unserer Praxis begrüßen zu dürfen. 
                    Dein Termin findet am ${moment(time)
                      .utc()
                      .format("DD.MM.YYYY")} um ${moment(time)
                  .utc()
                  .format("HH:mm")} Uhr
                    bei uns in den Räumen der Praxis T2 (Cathrin Junker - Phyisiotherapie) auf der Max-Planck-Str. 11 in 40699 Erkrath statt.


                    Gerne möchten wir Dir zur Information folgendes Video vor Deinem gebuchten Termin anzusehen:
                    https://youtu.be/but0YUKMAuY

                    Bitte beachte, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden, 
                    in Höhe von 80€ in Rechnung gestellt werden.


                    Viele Grüße, Dein Ahearn Chiropractic Team.
                    `,
              },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Deine Terminbuchung bei Ahearn Chiropractic für den ${moment(
          time
        )
          .utc()
          .format("DD.MM.YYYY")} um ${moment(time).utc().format("HH:mm")} Uhr`,
      },
    },
    Source: "info@ahearn-chiropractic.de" /* required */,
    ReplyToAddresses: [
      "info@ahearn-chiropractic.de",
      /* more items */
    ],
  };
  const sesConfig = {
    apiVersion: "2010-12-01",
    region: "eu-west-1",
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  };
  const ses = new AWS.SES(sesConfig);

  ses.sendEmail(params).promise();

  res.status(200).json({ msg: "treatment booking was successful" });
  return;
}
