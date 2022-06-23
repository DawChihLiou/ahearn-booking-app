import Header from './header'
import Footer from './footer'
import { Container } from 'reactstrap'

const Layout = ({ children }) => {
    const style = {}

    return (
        <>
            <Header />
            <Container>
                <main>{children}</main>
            </Container>

            <Footer />
        </>
    )
}

export default Layout