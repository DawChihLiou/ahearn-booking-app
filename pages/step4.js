import AppointmentContext from "../context/appointmentContextProvider";
import { useContext, useEffect } from "react";
import { formatInTimeZone } from "../lib/helper";
import { parseISO, addHours } from "date-fns";
import { useRouter } from "next/router";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import Form from "@rjsf/bootstrap-4";
import ICalendarLink from "react-icalendar-link";
import axios from "axios";

Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

const schema = {
  type: "object",
  required: ["strasse", "hausnummer", "plz", "ort", "tel", "mail"],
  properties: {
    strasse: {
      type: "string",
      title: "Straße",
      minLength: 2,
    },
    hausnummer: {
      type: "string",
      title: "Hausnummer",
      minLength: 1,
    },
    plz: {
      type: "string",
      title: "PLZ",
      minLength: 4,
    },
    ort: {
      type: "string",
      title: "Ort",
      minLength: 2,
    },
    tel: {
      title: "Telefon",
      type: "string",
      default: "+49",
      format: "tel",
      description: `Versprochen, wir geben Deine Nummer nicht weiter. Wir werden Dich aber 24 Stunden vor Terminbeginn per SMS erinnern.`,
      minLength: 5,
    },
    mail: {
      format: "mail",
      type: "string",
      title: "E-Mail",
      description: `Wir werden Dir noch eine Bestätigungs-E-Mail zu kommen lassen. Damit Du an Deinen Termin denkst.`,
    },
    confirmAusfall: {
      title: `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden, 
            in Höhe von 40€ in Rechnung gestellt werden.`,
      type: "boolean",
    },
  },
};

const Step4 = () => {
  const [appointment, setAppointment] = useContext(AppointmentContext);
  const router = useRouter();

  const erwachsen = appointment?.person?.age >= 16;
  const jugendlich = appointment?.person?.age >= 12;
  const kind = appointment?.person?.age < 12 && appointment?.person?.age > 0;
  const baby = appointment?.person?.age <= 0;

  if (jugendlich && !erwachsen) {
    schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden, 
    in Höhe von 50€ in Rechnung gestellt werden.`;
  }

  if (kind) {
    schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden,
    in Höhe von 25€ in Rechnung gestellt werden.`;
  }

  if (baby) {
    schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden,
    in Höhe von 20€ in Rechnung gestellt werden.`;
  }

  useEffect(() => {
    if (!appointment?.person) {
      router.push("/step1");
    }
  }, []);

  useEffect(() => {
    if (jugendlich && !erwachsen) {
      schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden, 
      in Höhe von 50€ in Rechnung gestellt werden.`;
    }

    if (kind) {
      schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden,
      in Höhe von 25€ in Rechnung gestellt werden.`;
    }

    if (baby) {
      schema.properties.confirmAusfall.title = `Hiermit erkläre ich mich einverstanden, dass Termine die nicht fristgerecht mindestens 24 Stunden vor Terminbeginn abgesagt wurden,
      in Höhe von 20€ in Rechnung gestellt werden.`;
    }
  });

  const book = async ({ formData }) => {
    console.log(formData);
    setAppointment({ ...appointment, contact: formData });
    try {
      const { data } = await axios
        .post("/api/booking/entry", { ...appointment, contact: formData })
        .catch((error) => {
          throw new Error(`Fehler: ${error?.response?.data}`);
        });
      router.push("/step5");
    } catch (ex) {
      router.push("/step3");
    }
  };

  useEffect(() => {
    if (!appointment.person) {
      router.push("/step1");
      return;
    }

    if (!appointment.time) {
      router.push("/step2");
      return;
    }
  }, [router, appointment.person, appointment.time]);
  if (!appointment.time) {
    return <>Checking data...</>;
  }
  const parsedTime = parseISO(appointment.time);
  const formData = { ...appointment?.contact };

  const today = new Date();
  let tzOffset = "+01:00";
  if (today.isDstObserved()) {
    //alert("Daylight saving time!");
    tzOffset = "+02:00";
  }

  const endTime = addHours(parsedTime, 1);
  const event = {
    title: "Ahearn Chiropractic - Erster Termin.",
    description: `Unsere Praxis liegt im Innenhof`,
    startTime: formatInTimeZone(
      parsedTime,
      `yyyy-MM-dd'T'HH:mm:ss'${tzOffset}'`,
      "UTC"
    ),
    endTime: formatInTimeZone(
      endTime,
      `yyyy-MM-dd'T'HH:mm:ss'${tzOffset}'`,
      "UTC"
    ),
    location: "Alexanderstr. 18, 40210 Duesseldorf",
  };

  if (appointment.dest == "erkrath") {
    event.location = "Max-Planck-Straße 11, 40699 Erkrath";
  }

  return (
    <>
      <Row>
        <Col sm="6">
          <Card>
            <CardBody>
              <h3>Fast geschafft!</h3>
              <p>
                {appointment?.person?.vorname} wir haben Deinen Termin am
                <br />
                <strong style={{ color: "#ec6735" }}>
                  {formatInTimeZone(
                    parsedTime,
                    "eeee ', den' dd.MM.yyyy 'um' HH:mm 'Uhr'",
                    "UTC"
                  )}
                </strong>{" "}
                vorgemerkt.
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6">
          <Card>
            <CardBody>
              <h3>Noch kurz Deine Kontaktdaten</h3>

              <Form
                showErrorList={false}
                autoComplete={false}
                customFormats={customFormats}
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                noHtml5Validate={true}
                onChange={() => {}}
                onSubmit={book}
                transformErrors={transformErrors}
                onError={() => {}}
              >
                <br />
                <Button type="submit">Verbindlich Buchen</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

function transformErrors(errors) {
  //console.log(errors)
  return errors.map((error) => {
    if (error.name === "minLength") {
      error.message = `Bitte mindestens ${error.params.limit} Zeichen eingeben.`;
    }
    if (error.name === "required") {
      error.message = `Dieses Feld muss ausgefüllt werden.`;
    }
    if (error.name === "type") {
      error.message = `Dieser Wert ist nicht zulässig.`;
    }
    return error;
  });
}

const uiSchema = {
  tel: {
    "ui:options": {
      inputType: "tel",
    },
  },
  mail: {
    "ui:options": {
      inputType: "email",
    },
  },
};

const customFormats = {
  tel: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d+)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?)+)(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
  mail: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};

export default Step4;
