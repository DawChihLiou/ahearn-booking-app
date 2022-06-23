import AppointmentContext from '../context/appointmentContextProvider'
import { useContext, useEffect } from 'react'
import { formatInTimeZone } from '../lib/helper'
import { parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { Row, Col, Button, Card, CardBody } from 'reactstrap'
import Form from '@rjsf/bootstrap-4';
import ICalendarLink from "react-icalendar-link";

Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

const Step4 = () => {
    const [appointment, setAppointment] = useContext(AppointmentContext);
    const router = useRouter()

    const book = ({ formData }) => {
        console.log(formData)
        setAppointment({ ...appointment, contact: formData })
    }

    useEffect(() => {
        if (!appointment.person) {
            router.push("/step1")
            return;
        }

        if (!appointment.time) {
            router.push("/step2")
            return;
        }

    }, [router, appointment.person, appointment.time])
    if (!appointment.time) {
        return <>Checking data...</>
    }
    const parsedTime = parseISO(appointment.time);
    const formData = { ...appointment?.contact }

    const today = new Date();
    let tzOffset = "+01:00"
    if (today.isDstObserved()) {
        //alert("Daylight saving time!");
        tzOffset = "+02:00"
    }

    const event = {
        title: "Ahearn Chiropractic - Erster Termin.",
        description: `Unsere Praxis liegt im Innenhof`,
        startTime: formatInTimeZone(parsedTime, `yyyy-MM-dd'T'HH:mm:ss'${tzOffset}'`, "UTC"),
        location: "Alexanderstr. 18, 40210 Duesseldorf",
    }

    

    return <>
        {JSON.stringify(appointment)}
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <h3>Fast geschafft!</h3>
                        <p>{appointment?.person?.vorname} wir haben deinen Termin für  {formatInTimeZone(parsedTime, "eeee 'den' dd.MM 'um' HH:mm", "UTC")} berücksichtigt.</p>
                        <ICalendarLink event={event} >
                            Add to Calendar
                        </ICalendarLink>
                    </CardBody>
                </Card>
            </Col>
            <Col>
                <Card>
                    <CardBody>
                        <h3>Noch kurz deine Kontaktdaten</h3>
                        <p>Nein keine Sorgen, wir sind nicht solche! Wir brauchen deine Kontaktdaten nur für den Fall, dass etwas schief läuft.</p>
                        <Form
                            showErrorList={false}
                            autoComplete={false}
                            customFormats={customFormats}
                            schema={schema}
                            uiSchema={uiSchema}
                            formData={formData}
                            noHtml5Validate={true}
                            onChange={() => { }}
                            onSubmit={book}
                            onError={() => { }} >
                            <br /><Button type="submit">Verbindlich Buchen</Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>
}

const schema = {
    type: "object",
    required: ["tel", "mail", "howToContact"],
    properties: {
        tel: {
            title: "Telefon",
            type: 'string',
            default: "+49",
            format: 'tel',
            description: `Versprochen, wir geben weder deine Nummer weiter, noch werden wir dich telefonisch nerven. 
            Wir brauchen deine Telefonnummer für den Fall, wenn etwas mit deinem Termin nicht stimmt.`
        },
        mail: {
            format: 'mail',
            type: "string",
            title: "E-Mail",
            description: `Wir werden dir noch eine bestätigungs E-Mail zu kommen lassen. Damit du uns auch  ja nicht vergisst ;-).`
        },
        howToContact: {
            title: "Kontakt Methode, wenn der Termin nicht stattfinden können sollte.",
            type: "string",
            description: "Wie dürfen wir dich über Terminänderungen Informieren, wenn etwas mit deinem Termin sein sollte?",
            default: "sms",
            enum: ["Telefonisch", "Per SMS", "E-Mail"]
        }
    }
}

const uiSchema = {
    tel: {
        "ui:options": {
            inputType: 'tel'
        }
    },
    mail: {
        "ui:options": {
            inputType: 'email'
        }
    }
}

const customFormats = {
    'tel': /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d+)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?)+)(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
    'mail': /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
};

export default Step4