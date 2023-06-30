import AppointmentContext from "../context/appointmentContextProvider";
import { useContext, useEffect } from "react";

import { useRouter } from "next/router";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import Form from "@rjsf/bootstrap-4";

const Step2 = () => {
  const [appointment, setAppointment] = useContext(AppointmentContext);
  const router = useRouter();

  useEffect(() => {
    if (!appointment?.person) {
      router.push("/step1");
    }
  }, []);

  const erwachsen = appointment?.person?.age >= 16;
  const jugendlich = appointment?.person?.age >= 12;
  const kind = appointment?.person?.age < 12 && appointment?.person?.age > 0;
  const baby = appointment?.person?.age <= 0;

  const confirm = ({ formData }) => {
    console.log(formData);
    setAppointment({ ...appointment, confirm: formData });
    router.push("/step3");
  };

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h3>Das solltest Du wissen!</h3>
              <p>
                Bevor Du zu Deiner Terminauswahl kommst, solltest Du folgendes
                wissen:
              </p>
              {appointment.dest == "dus" && (
                <>
                  {erwachsen && <ErwachsenerText />}
                  {jugendlich && !erwachsen && <JugendlicherText />}
                  {kind && <KindText />}
                  {baby && <BabyText />}
                </>
              )}

              {appointment.dest == "erkrath" && (
                <>
                  <p>
                    1. Wir sind eine Privatpraxis. Somit werden die Kosten von
                    den gesetzlichen Krankenkassen in der Regel nicht
                    übernommen. Private Krankenkassen übernehmen hingegen in der
                    Regel die Kosten der Behandlung im Rahmen des vertraglich
                    vereinbarten Versicherungsschutzes für
                    Heilpraktiker-Leistungen.
                  </p>
                  <p>
                    2. Die Gesamtkosten belaufen sich auf 100,-€ für die
                    Erstaufnahme in unserer Praxis. Das beinhaltet eine Aufnahme
                    in unsere Praxis und eine erste Behandlung.
                    <br />
                    Jede weitere chiropraktische Behandlung einzeln beträgt
                    78,-€. <br />
                    Das Behandlungspaket mit 12 Behandlungen kostet 840€ (70€ je
                    Behandlung). <br />
                  </p>
                </>
              )}
              <p></p>
              <Form
                showErrorList={false}
                autoComplete={false}
                schema={schema}
                noHtml5Validate={true}
                onChange={() => {}}
                onSubmit={confirm}
                onError={() => {}}
              >
                <br />
                <Button type="submit">Weiter</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ErwachsenerText = () => {
  return (
    <>
      <p>Du buchst einen Termin für einen Erwachsenen.</p>
      <p>
        1. Wir sind eine Privatpraxis. Somit werden die Kosten von den
        gesetzlichen Krankenkassen im Allgemeinen nicht übernommen. Private
        Krankenkassen übernehmen hingegen die Kosten der Behandlung im Rahmen
        des vertraglich vereinbarten Versicherungsschutzes für
        Heilpraktiker-Leistungen.
      </p>
      <p>
        2. Die Gesamtkosten für die Erstaufnahme eines Erwachsenen in unserer
        Praxis betragen 144,-€. Diese setzen sich wie folgt zusammen:
        <br />
        <br />• Erstanalyse inkl. separatem Auswertungsgespräch: 99, – €
        <br />• Chiropraktische Einzelbehandlung: 45, – €
        <br />
        <br />
        Jede weitere chiropraktische Behandlung beträgt ebenfalls 45, – €.
        <br />
        Wir bieten auch günstigere Behandlungspakete an.
        <br />
        <br />
        <strong>Bist du Schüler, Student oder Azubi?</strong>
        <br />
        (Bitte Nachweis hierüber mit zur ersten Behandlung mitbringen.)?
        <br />
        Dann kostet eine chiropraktische Behandlung{" "}
        <strong style={{ color: "#ec6735" }}>35,-€</strong>
        <br />
        <br />
        Wir bieten auch ein günstigeres Behandlungspaket an.
        <br />
        Eine Übersicht unserer aktuellen Behandlungspakete findest Du in{" "}
        <a
          href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf"
          target="_blank"
          rel="noreferrer"
        >
          unserer Preisliste.
        </a>
      </p>
    </>
  );
};

const JugendlicherText = () => {
  return (
    <>
      <p>Du buchst einen Termin für einen Jungendlichen.</p>
      <p>
        1. Wir sind eine Privatpraxis. Somit werden die Kosten von den
        gesetzlichen Krankenkassen im Allgemeinen nicht übernommen. Private
        Krankenkassen übernehmen hingegen die Kosten der Behandlung im Rahmen
        des vertraglich vereinbarten Versicherungsschutzes für
        Heilpraktiker-Leistungen.
      </p>
      <p>
        2. Die Gesamtkosten für die Erstaufnahme eines Teenagers im{" "}
        <strong style={{ color: "#ec6735" }}>Alter von 12-16 Jahren</strong> in
        unserer Praxis betragen:
        <br />
        <br />• Erstanalyse inkl. separatem Auswertungsgespräch: 75, – €
        <br />• Chiropraktische Einzelbehandlung: 30, – €
        <br />
        <br />
        Jede weitere chiropraktische Behandlung beträgt ebenfalls 30, – €.
        <br />
        Wir bieten auch ein günstigeres Behandlungspaket an.
        <br />
        Eine Übersicht unserer aktuellen Behandlungspakete findest Du in{" "}
        <a
          href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf"
          target="_blank"
          rel="noreferrer"
        >
          unserer Preisliste.
        </a>
      </p>
    </>
  );
};

const KindText = () => {
  return (
    <>
      <p>Du buchst einen Termin für ein Kind.</p>
      <p>
        1. Wir sind eine Privatpraxis. Somit werden die Kosten von den
        gesetzlichen Krankenkassen im Allgemeinen nicht übernommen. Private
        Krankenkassen übernehmen hingegen die Kosten der Behandlung im Rahmen
        des vertraglich vereinbarten Versicherungsschutzes für
        Heilpraktiker-Leistungen.
      </p>
      <p>
        2. Die Gesamtkosten für die Erstaufnahme eines Kindes im{" "}
        <strong style={{ color: "#ec6735" }}>
          Alter von <strong>1-11</strong>
          Jahren{" "}
        </strong>
        in unserer Praxis betragen:
        <br />
        <br />• Erstgespräch mit Anamnese:{" "}
        <strong style={{ color: "#ec6735" }}>0, – €</strong>
        <br />• Chiropraktische Einzelbehandlung: 25, – €
        <br />
        <br />
        Jede weitere chiropraktische Behandlung beträgt ebenfalls 25, – €.
        <br />
        Wir bieten auch ein günstigeres Behandlungspaket an.
        <br />
        Eine Übersicht unserer aktuellen Behandlungspakete findest Du in{" "}
        <a
          href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf"
          target="_blank"
          rel="noreferrer"
        >
          unserer Preisliste.
        </a>
      </p>
    </>
  );
};

const BabyText = () => {
  return (
    <>
      <p>Du buchst einen Termin für ein Baby.</p>
      <p>
        1. Wir sind eine Privatpraxis. Somit werden die Kosten von den
        gesetzlichen Krankenkassen im Allgemeinen nicht übernommen. Private
        Krankenkassen übernehmen hingegen die Kosten der Behandlung im Rahmen
        des vertraglich vereinbarten Versicherungsschutzes für
        Heilpraktiker-Leistungen.
      </p>
      <p>
        2. Die Gesamtkosten für die Erstaufnahme eines Babys{" "}
        <strong style={{ color: "#ec6735" }}>bis zum 1. Lebensjahr</strong> in
        unserer Praxis betragen:
        <br />
        <br />• Erstgespräch mit Anamnese:
        <strong style={{ color: "#ec6735" }}>0, – €</strong>
        <br />• Chiropraktische Einzelbehandlung: 20, – €
        <br />
        <br />
        Jede weitere chiropraktische Behandlung beträgt ebenfalls 20, – €.
        <br />
        Wir bieten auch ein günstigeres Behandlungspaket an.
        <br />
        Eine Übersicht unserer aktuellen Behandlungspakete findest Du in{" "}
        <a
          href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf"
          target="_blank"
          rel="noreferrer"
        >
          unserer Preisliste.
        </a>
      </p>
    </>
  );
};

const schema = {
  type: "object",
  required: ["acceptedAgreement"],
  properties: {
    acceptedAgreement: {
      title: "Ja, dies habe ich verstanden",
      type: "boolean",
      description: ``,
    },
  },
};

export default Step2;
