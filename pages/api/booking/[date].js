// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
export default async function handler(req, res) {


  const { date } = req.query
  const url = `https://ahearn-system.de/api/dmz/onlineBooking/queryDate/${date}/20`
  
  const {data} = await axios.get(url)
  res.status(200).json([data])
}
