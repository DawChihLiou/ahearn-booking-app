import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import Link from 'next/link'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { ImPencil2 } from 'react-icons/im'
import Form from '@rjsf/bootstrap-4';
import { useContext } from "react";
import AppointmentContext from '../context/appointmentContextProvider'
import { useRouter } from 'next/router'

export default function Step1(props) {

    const [appointment, setAppointment] = useContext(AppointmentContext);
    const router = useRouter()

    let dest = router.query.dest || "dus"

    const updateConfig = async ({ formData }) => {
        let eType = 20
        switch (dest) {
            case 'erkrath':
                eType = 30
                break

        }
        setAppointment({ ...appointment, person: formData, dest, eType })
        console.log(formData)
        router.push("/step2")
    }

    const formData = { ...appointment?.person }


    const log = (type) => {
        console.log(type)
    }

    return (
        <>
            <Row>
                <Col sm={{ size: 5, order: 1 }} xs={{ order: 2 }} >
                    <center><RiKakaoTalkFill style={{ fontSize: "5em", marginBottom: "20px" }} /></center>
                    <h3>Guten Tag!</h3>

                    <p>Schön, dass Du Interesse an einem Termin bei uns hast!<br />
                        Würdest Du uns Deinen Vor- und Nachnamen verraten?</p>


                    {dest === "dus" && <>
                        <p>Wusstest Du schon, dass sich unsere Praxis zentral im Herzen Düsseldorfs befindet und nur etwa 2 Minuten fußläufig von der Kö entfernt ist?</p>

                        <p><strong>Parken?</strong> Klar! Bei uns kannst Du kostenlos auf einem unserer 12 Parkplätze Dein Auto während der Behandlungszeit abstellen.</p>
                    </>}

                    {dest === "erkrath" && <>
                        <p> Unser Chiropraktisches Angebot in Erkrath zielt insbesondere auf Leistungssportler / Sportler ab.</p>
                    </>}

                </Col>
                <Col sm={{ size: 7, order: 2 }} xs={{ order: 1 }} style={{ borderLeft: "1px solid black" }} >

                    <center><ImPencil2 style={{ fontSize: "5em", marginBottom: "20px" }} /></center>
                    <h3>Wie dürfen wir Dich ansprechen?</h3>

                    <Form
                        showErrorList={false}
                        autoComplete={false}
                        schema={schema}
                        formData={formData}
                        noHtml5Validate={true}
                        onChange={log("changed")}
                        onSubmit={updateConfig}
                        onError={log("errors")} >
                        <br /><Button type="submit">So dürft Ihr mich nennen!</Button>
                    </Form>

                </Col>
            </Row>

        </>
    )
}


const schema = {
    type: "object",
    required: ["vorname", "gender", "nachname"],
    properties: {
        gender: {

            title: "Anrede",
            type: 'string',
            default: "Frau",
            enum: ["Frau", "Herr", "Diverse"]
        },
        vorname: {
            autofocus: true,
            type: "string",
            title: "Vorname",

        },
        nachname: {
            type: "string",
            title: "Nachname"
        },
        dob: {
            type: "string",
            title: "Geburtsdatum",
            format: "date"

        }
    }
}