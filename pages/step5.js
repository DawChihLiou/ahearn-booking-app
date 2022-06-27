import AppointmentContext from '../context/appointmentContextProvider'
import { useContext, useEffect } from 'react'
import { formatInTimeZone } from '../lib/helper'
import { parseISO, addHours } from 'date-fns'
import { useRouter } from 'next/router'
import { Row, Col, Button, Card, CardBody } from 'reactstrap'
import { ButtonGroup } from 'react-bootstrap'
import Link from 'next/link'
import { BsCalendarDay } from 'react-icons/bs'
import { FiDownload } from 'react-icons/fi'
import ICalendarLink from "react-icalendar-link";

Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

const Step5 = ({ }) => {

    const [appointment, setAppointment] = useContext(AppointmentContext);
    const router = useRouter()


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

    let tzOffset = "+01:00"
    const today = new Date();

    if (today.isDstObserved()) {
        //alert("Daylight saving time!");
        tzOffset = "+02:00"
    }

    const endTime = addHours(parsedTime, 1)

    const event = {
        title: "Ahearn Chiropractic - Erster Termin.",
        description: `Unsere Praxis liegt im Innenhof`,
        startTime: formatInTimeZone(parsedTime, `yyyy-MM-dd'T'HH:mm:ss'${tzOffset}'`, "UTC"),
        endTime: formatInTimeZone(endTime, `yyyy-MM-dd'T'HH:mm:ss'${tzOffset}'`, "UTC"),
        location: "Alexanderstr. 18, 40210 Duesseldorf",
    }


    return <>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <h3>Vielen Dank für Deine Buchung!</h3>
                        <h5 style={{ color: '#ec6735' }}><strong>{appointment?.person?.vorname}</strong>,
                            wir freuen uns Dich schon bald in unserer Praxis begrüßen zu dürfen!</h5>

                        <p style={{ marginTop: '30px' }}>
                            <h6>Wichtig! <br />Bitte Fragebogen herunterladen und ausgefüllt mitbringen!</h6>
                            Für Deinen ersten Besuch bei uns benötigen wir den von Dir ausgefüllten Fragebogen.<br />
                            Wenn Du keinen Drucker hast, um den Fragebogen vorab auszufüllen, komme bitte
                            <span style={{ color: '#ec6735', fontWeight: 'bold' }}> 15 Minuten vor {" "}Deinem Termin</span> zu uns in die Praxis.
                            Hier kannst Du Deinen Fragebogen in Ruhe ausfüllen.

                        </p>

                        <p style={{ marginTop: "30px" }}>
                            <ButtonGroup>
                                <ICalendarLink event={event} >
                                    <Button color="primary" style={{ marginRight: "20px" }}><BsCalendarDay /> Termin im Kalender eintragen</Button>
                                </ICalendarLink>

                                <Button color="primary" href="https://www.ahearn-chiropractic.de/sites/default/files/fragebogen.pdf"><FiDownload /> Download Fragebogen</Button>
                            </ButtonGroup>
                        </p>

                    </CardBody>
                </Card>
            </Col>
        </Row>
    </>
}





export default Step5