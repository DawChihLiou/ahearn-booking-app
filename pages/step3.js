import { Card, CardBody, Row, Col, Button } from "reactstrap";
import addDays from "date-fns/addDays";
import { useState, useEffect, useContext } from "react";
import { isPast, isSameDay, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { format, utcToZonedTime } from "date-fns-tz";
import axios from "axios";
import AppointmentContext from "../context/appointmentContextProvider";
import { useRouter } from "next/router";
import { formatInTimeZone } from "../lib/helper";
import { BsCalendarPlus, BsCalendarMinus } from "react-icons/bs";

const Booking = (props) => {
  const [appointment] = useContext(AppointmentContext);
  const [startDate, setStartDate] = useState(
    getDateTowShow({ startDate: new Date() })
  );
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const nextWeek = () => {
    setLoading(true);
    const lastDateBefore = startDate[startDate.length - 1];
    const nextDate = addDays(lastDateBefore, 1);
    const nextDates = getDateTowShow({ startDate: nextDate });
    setStartDate(nextDates);
  };
  const lastWeek = () => {
    setLoading(true);
    const lastDateBefore = startDate[0];
    const nextDate = addDays(lastDateBefore, -7);
    const nextDates = getDateTowShow({ startDate: nextDate });
    setStartDate(nextDates);
  };
  useEffect(() => {
    if (!appointment.person) router.push("/step1");
  }, []);

  useEffect(() => {
    setLoading(true);
    const promises = startDate.map((d) =>
      axios.get(
        `/api/booking/${format(d, "yyyy-MM-dd")}?dest=${appointment.dest}`
      )
    );
    Promise.all(promises).then((results) => {
      setLoading(false);
      setSlots(results.map((d) => d.data[0]));
    });
  }, [startDate, appointment.dest]);

  if (loading) {
    return <>Loading</>;
  }

  return (
    <>
      <Row>
        <Col>
          <h1>
            Ok {appointment?.person?.vorname}, wann dürfen wir Dich bei uns
            begrüßen?
          </h1>
        </Col>
      </Row>

      <Row>
        <Col>
          {!isPast(addDays(startDate[0], -1)) && (
            <Button color="primary" onClick={lastWeek}>
              <BsCalendarMinus /> Zurück
            </Button>
          )}
          <Button color="primary" onClick={nextWeek}>
            <BsCalendarPlus /> Vor
          </Button>
        </Col>
      </Row>

      <Row>
        <ShowDates dates={startDate} allSlots={slots} />
      </Row>
    </>
  );
};

export default Booking;

const ListFreeSlots = ({ slots, type = 20 }) => {
  const freeSlotsForNew = [];

  const [appointment, setAppointment] = useContext(AppointmentContext);
  const router = useRouter();

  const chooseAppointment = ({ employee_id, time }) => {
    setAppointment({ ...appointment, employee_id, time });
    router.push("/step4");
  };

  for (const i = 0; i < slots.length; i++) {
    // Finde frei GBs

    let gbs = slots[i].employee_settings.filter(
      (e) => e.eType === type && !e.blocked && !e.closed && !e.stats
    );
    let ids = gbs.map((g) => g.employee_id);
    if (ids.length > 0 && slots[i + 1]) {
      // Prüfung auf 30min
      gbs = slots[i + 1].employee_settings.filter(
        (e) =>
          e.eType === type &&
          !e.blocked &&
          !e.closed &&
          !e.stats &&
          ids.includes(e.employee_id)
      );
      ids = gbs.map((g) => g.employee_id);

      // Prüfung auf 45min
      if (ids.length > 0 && slots[i + 2]) {
        console.log(i + 2);
        // Prüfung auf 45min
        gbs = slots[i + 2].employee_settings.filter(
          (e) =>
            e.eType === type &&
            !e.blocked &&
            !e.closed &&
            !e.stats &&
            ids.includes(e.employee_id)
        );
        ids = gbs.map((g) => g.employee_id);

        if (ids.length > 0) {
          //console.log(slots[i], slots[i + 1], slots[i + 2])
          const parsedTime = parseISO(slots[i].time);
          const formattedTime = formatInTimeZone(parsedTime, "HH:mm", "UTC");
          freeSlotsForNew.push(
            <Button
              onClick={() =>
                chooseAppointment({ time: slots[i].time, employee_id: ids[0] })
              }
            >
              {formattedTime}
            </Button>
          );
        }
      }
    }
  }
  if (freeSlotsForNew.length === 0) {
    return (
      <>
        <br />
        Keine Slots mehr
      </>
    );
  }
  return (
    <>
      <div>{freeSlotsForNew}</div>
    </>
  );
};

const ShowDates = ({ dates, allSlots }) => {
  const [appointment, setAppointment] = useContext(AppointmentContext);
  console.log("Type", appointment.eType);
  const cols = dates.map((d) => {
    const slots = allSlots.find((s) => {
      if (!s.times) return false;
      if (s.times.length === 0) return false;
      if (!s.times[0]?.time) return false;
      return isSameDay(new Date(s.times[0]?.time), d);
    });
    return (
      <div key={d.getTime()} style={{ width: `${100 / dates.length}%` }}>
        <strong>{format(d, "eee dd.MM", { locale: de })}</strong>
        {slots?.times && (
          <ListFreeSlots slots={slots.times} type={appointment.eType} />
        )}
        {!slots?.times && <>Keine Daten erhalten</>}
      </div>
    );
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "30px",
      }}
    >
      {cols}
    </div>
  );
};

const getDateTowShow = ({ startDate, killDays = [0] }) => {
  while (killDays.includes(startDate.getDay())) {
    startDate = addDays(startDate, 1);
  }
  const dates = [];
  do {
    if (isSameDay(startDate, new Date())) {
      /**
       * Wegen SSR kann es hier zu Problemen kommen
       */
      dates.push(startDate);
      startDate = addDays(startDate, 1);
      continue;
    }
    if (!isPast(startDate, new Date())) {
      dates.push(startDate);
    }

    startDate = addDays(startDate, 1);
  } while (!killDays.includes(startDate.getDay()));

  return dates;
};
