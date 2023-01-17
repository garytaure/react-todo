import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import { Navbar, Nav, Container, ToastContainer, Toast } from 'react-bootstrap';

export default function DefaultLayout() {
    const { user, token, setUser, setToken, notification } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />
    }

    const onLogout = ev => {
        ev.preventDefault()

        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    return (
        <div id="defaultLayout">
            <Navbar>
                <Container>
                    <Navbar.Brand href="#home">To Do</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {user && user.name } <Nav.Link onClick={onLogout} eventKey="logout">Logout</Nav.Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {notification &&
                <ToastContainer position="top-end">
                    <Toast>
                        <Toast.Header>
                            <strong className="me-auto">Alert</strong>
                        </Toast.Header>
                        <Toast.Body>{notification}</Toast.Body>
                    </Toast>
                </ToastContainer>
            }
            <div className="content">
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}