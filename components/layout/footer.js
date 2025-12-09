
import { Row, Container, Col } from 'reactstrap'
import Link from 'next/link'

export default function Footer() {

    return <footer >
        <div className="footer-area footer-only">
            <Container>
                <Row >
                    
                    <Col xs="12" sm={{ size: 4,  }} lg={{ size: 3, }}>

                        <h4 >Quick Links</h4>
                        <ul>
                            <li>
                                <Link href="/">
                                    <a>Home</a>
                                </Link>
                            </li>

                            <li>
                                <Link href="https://www.ahearn-chiropractic.de/impressum-0">
                                    <a>Impressum</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://www.ahearn-chiropractic.de/datenschutz">
                                    <a>Datenschutz</a>
                                </Link>
                            </li>
                        </ul>

                    </Col>
                </Row>
            </Container>
        </div>
        <div >
            <Container>
                <Row>
                    <p className="col-lg-12 footer-text text-center">
                        Copyright © {new Date().getFullYear()} All rights reserved
                    </p>
                </Row>
            </Container>
        </div>
    </footer >
}


