import {
    Button, Collapse,
    Nav, Navbar, NavbarToggler, NavItem, NavbarText, NavLink,
    Offcanvas, OffcanvasHeader, OffcanvasBody
} from 'reactstrap'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'



export default function Header(props) {

    const [isOpen, toggle] = useState(false);
   

    return <div>
        <Navbar
            color="light"
            expand="md"
            light
            container={"sm"}
        >
            <>
                <Link href="/">
                    <>
                        <Image src="/logo.webp" alt="Beta Dach Logo" width={104} height={179} />
                    </>
                </Link>
                <div style={{color: "#ec6735", display: "inline-block", margin: "0px 0px 0px 10px" }}>
                   Ahearn Chiropractic
                </div>
            </>

           

             <><NavbarToggler onClick={() => toggle(!isOpen)} />
                <Collapse navbar isOpen={isOpen}>
                    <Nav
                        navbar
                        className={["me-auto"].join(" ")}
                    >
                        <NavItem>
                            <NavLink tag={Link} className="nav-link" href="/">
                                <a className="nav-link" onClick={() => { toggle(false) }}>Start</a>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} href="https://ahearn-chiropractic.de">
                                <a className="nav-link" onClick={() => { toggle(false) }}>Website</a>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} href="http://shop.ahearn-chiropractic.de">
                                <a className="nav-link" onClick={() => { toggle(false) }}>Shop</a>
                            </NavLink>
                        </NavItem>

                    </Nav>
                    <NavbarText>
                        Und wann können wir Dir helfen?
                    </NavbarText>

                </Collapse>
            </>
        </Navbar>
        
    </div>
}