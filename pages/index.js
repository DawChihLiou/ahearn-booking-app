import { Card, CardBody, Row, Col } from 'reactstrap'
import Link from 'next/link'
import { BsFillPersonCheckFill, BsFillPersonPlusFill } from 'react-icons/bs'
import { BiInfoCircle } from 'react-icons/bi'
export default function Home() {
  return (
    <>
      <Row>
        <Col sm={{ offset: 1, size: 11 }}>
          <h1>Guten Tag!

          </h1>
          <h4>Schön, dass Du Interesse an einem Termin bei uns hast!</h4>
          <br /><br />
        </Col>
      </Row>
      <Row>
        <Col
          sm={{ size: 6 }}
          md={{ size: 4, offset: 1 }}
        >
          <Link href="/step1">
            <Card className="hover">
              <CardBody>
                <center><BsFillPersonPlusFill style={{ fontSize: "3em", marginBottom: ".5em" }} /></center>
                <h3>New Patient</h3>
                <p>Ich bin ein neuer Patient</p>
              </CardBody>
            </Card>
          </Link>
        </Col>
        <Col
          sm={{ size: 6 }}
          md={{ size: 4, offset: 1 }}
        >
          <Link href="https://www.ahearn-chiropractic.de/user/login">
            <Card className="hover">
              <CardBody>
                <center><BsFillPersonCheckFill style={{ fontSize: "3em", marginBottom: ".5em" }} /></center>
                <h3>Praxismitglied</h3>
                <p>Ich bin bereits Patient bei <span style={{ color: "orange" }}>Ahearn Chiropractic</span></p>
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col sm={{ offset: 1, size: 9 }}>
          <Card>
            <CardBody>
              <Row>
                <Col sm="2" style={{ textAlign: "center" }}>
                  <BiInfoCircle style={{ fontSize: "4em" }} />
                </Col>
                <Col sm="10">
                  Wusstest Du, dass regelmäßige chiropraktische Behandlungen dazu beitragen können, nicht nur Deine Schmerzen zu minimieren, sondern auch Deine Lebensenergie drastisch zu steigern?
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
