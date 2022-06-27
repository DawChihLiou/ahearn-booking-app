import AppointmentContext from '../context/appointmentContextProvider'
import { useContext, useEffect } from 'react'

import { useRouter } from 'next/router'
import { Row, Col, Button, Card, CardBody } from 'reactstrap'
import Form from '@rjsf/bootstrap-4';


const Step2 = () => {
    const [appointment, setAppointment] = useContext(AppointmentContext);
    const router = useRouter()

    const confirm = ({ formData }) => {
        console.log(formData)
        setAppointment({ ...appointment, confirm: formData })
        router.push("/step3")
    }





    return <>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <h3>Das musst Du wissen!</h3>
                        <p>Bevor Du zu Deiner Terminauswahl kommst, musst Du folgendes Wissen:</p>

                        <p>
                            1. Wir sind eine Privatpraxis. Somit werden die Kosten von gesetzlichen Krankenkassen in der Regel nicht übernommen.
                            Private Krankenkassen übernehmen hingegen im Allgemeinen die Kosten der Behandlung, wenn der Heilpraktiker mit zu den 
                            Versicherungsleistungen gehört -
                            wir empfehlen dies im Vorfeld mit der Krankenkasse abzustimmen.

                        </p>
                        <p>
                            2. Die Gesamtkosten belaufen sich auf 144€ für die Erstaufnahme in unserer Praxis. 
                            Das beinhaltet eine Anamnese, eine Haltungsanalyse, auf Deine Haltung abgestimmte Übungen,
                            der MyoVision Scan, Deine erste Chiropraktische Behandlung und einen Zweitermin, bei dem Du alle Ergebnisse
                            mit Deinem Gesundheitsberater:in besprichst.<br/>
                            Jede weitere chiropraktische Behandlungen außerhalb von Behandlungspakete (diese sind deutlich günstiger) liegt bei 45€. <br/>
                            Eine Übersicht unserer aktuellen Behandlungspakete findest Du in 
                            {" "}<a href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf" target="_blank"  rel="noreferrer">unserer Preisliste.</a>
                        </p>
                        <p></p>
                        <Form
                            showErrorList={false}
                            autoComplete={false}
                            schema={schema}
                            noHtml5Validate={true}
                            onChange={() => { }}
                            onSubmit={confirm}
                            onError={() => { }} >
                            <br /><Button type="submit">Weiter</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>
}

const schema = {
    type: "object",
    required: ["acceptedAgreement"],
    properties: {
        acceptedAgreement: {
            title: "Ja, dies habe ich verstanden",
            type: 'boolean',
            description: ``
        }
    }
}



export default Step2