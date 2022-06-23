
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
                                <Link href="/content/tutorial">
                                    <a>Anleitung</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/content/imprint">
                                    <a>Impressum</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/content/privacy">
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


