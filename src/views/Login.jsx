import axiosClient from "../axios-client.js";
import { createRef } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({ data }) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        <form onSubmit={onSubmit}>
          {message &&
            <Alert variant="danger">
              {message}
            </Alert>
          }
          <Form.Group className="mb-3">
            <Form.Control ref={emailRef} type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control ref={passwordRef} type="password" placeholder="Password" />
          </Form.Group>
          <Button type="submit" className="btn btn-block">Login</Button>
        </form>
      </Card.Body>
    </Card>
  )
}