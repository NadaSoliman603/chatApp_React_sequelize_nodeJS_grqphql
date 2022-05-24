
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from './../../context/auth';


function Header({ history }) {
    const dispatch = useAuthDispatch()

    const logout = () => {
      dispatch({ type: 'LOGOUT' })
      window.location.href ="./login"
    }
    return (
        <Navbar bg="light" expand="lg">
            {/* <Container> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/login">
                            <Button style={{ textDecoration: 'none', fontWeight: 700 }} variant="link">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button style={{ textDecoration: 'none', fontWeight: 700 }} variant="link">Register</Button>
                        </Link>

                        <Button style={{ textDecoration: 'none', fontWeight: 700 }} variant="link" onClick={logout}>
                            Logout
                        </Button>

                    </Nav>
                </Navbar.Collapse>
            {/* </Container> */}
        </Navbar>
    );
}

export default Header;