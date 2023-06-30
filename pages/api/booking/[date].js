// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import https from "https";
export default async function handler(req, res) {
  let { date, dest } = req.query;
  let employee_type = 20;
  let minute_interval = 15;
  if (!dest) {
    dest = "dus";
  }

  switch (dest) {
    case "erkrath":
      employee_type = 30;
      minute_interval = 20;
      break;
  }

  const base_url = (process.env.NODE_ENV === "development") ? "https://localhost:3000" : "https://ahearn-system.de"

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  console.log(employee_type);
  const url = `${base_url}/api/dmz/onlineBooking/queryDate/${date}/${employee_type}?minute_interval=${minute_interval}`;
  console.log(url);
  const { data } = await axios.get(url, { httpsAgent: agent });
  res.status(200).json([data]);
}
