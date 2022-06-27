import '../styles/globals.css'
import Layout from '../components/layout/layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppointmentContext from '../context/appointmentContextProvider'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const state = (typeof window !== 'undefined') ? JSON.parse(window?.localStorage?.getItem('booking')) : {}
  const [appointment, _setAppointment] = useState(state)

  const setAppointment = (a) => {
    window.localStorage.setItem('booking', JSON.stringify(a))
    return _setAppointment(a)
  }

  try{
    console.log(window?.localStorage?.getItem('booking'))
  }catch(ex){}
  
  
  

  return (<AppointmentContext.Provider value={[appointment, setAppointment]}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </AppointmentContext.Provider>)

}

export default MyApp
