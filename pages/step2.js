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
                        <h3>Das musst du wissen!</h3>
                        <p>Bevor du zu deiner Terminauswahl kommst, musst du folgendes Wissen:</p>

                        <p>
                            1. Wir sind eine Privatpraxis. Somit werden die Kosten von gesetzlichen Krankenkassen in der Regel nicht übernommen.
                            Private Krankenkassen übernehmen hingegen im allgemeinen die Kosten der Behandlung, wir empfehlen aber dies im Vorfeld mit der Krankenkasse abzustimmen.

                        </p>
                        <p>
                            2. Die kosten belaufen sich auf 144€ für Ihre erste Untersuchung. Einzelne chiropraktische Behandlungen außerhalb von Behandlungspaketen liegen bei je 45€. <br/>
                            Eine Übersicht unserer aktuellen Behandlungspaketen finden sie in 
                            {" "}<a href="https://www.ahearn-chiropractic.de/sites/default/files/Preisliste_ab_05_2022_210x297mm_Update_P1.pdf" target="_blank">unserer Preisliste.</a>
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
    required: ["privatPraxis", "kosten"],
    properties: {
        privatPraxis: {
            title: "Ja ich bin mir bewußt, dass ich die Kosten für die Behandlung höchst wahrscheinlich selber tragen muss. (Private Krankenkassen zahlen in der Regel die Behandlung)",
            type: 'boolean',
            description: ``
        },
        kosten: {
            type: "boolean",
            title: "Mir ist bewußt, dass die Kosten für die erste Behandlung sich auf 144€ belaufen. (Analyse, Wirbelsäulen Scan, Körpervermessung und Chiropraktische Behandlung)",
            description: ``
        }
    }
}



export default Step2