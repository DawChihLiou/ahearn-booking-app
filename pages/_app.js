import '../styles/globals.css'
import Layout from '../components/layout/layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppointmentContext from '../context/appointmentContextProvider'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [person, setPerson] = useState({});
  const [appointment, setAppointment] = useState({})
  return (<AppointmentContext.Provider value={[appointment, setAppointment]}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </AppointmentContext.Provider>)

}

export default MyApp
