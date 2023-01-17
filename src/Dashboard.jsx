import { createRef, useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "./context/ContextProvider.jsx";
import { Card, Form, Button } from "react-bootstrap";

export default function Dashboard() {
  const taskNameRef = createRef()
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const { setNotification } = useStateContext()

  useEffect(() => {
    getTasks();
  }, [])

  const onDeleteClick = task => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }
    axiosClient.delete(`/tasks/${task.id}`)
      .then(() => {
        setNotification('Task was successfully deleted')
        getTasks()
      })
  }

  const getTasks = () => {
    setLoading(true)
    axiosClient.get('/tasks')
      .then(({ data }) => {
        setLoading(false)
        setTasks(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      name: taskNameRef.current.value
    }
    axiosClient.post('/tasks', payload)
      .then(({ data }) => {
        taskNameRef.current.value = '';
        getTasks();
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
        <Card.Title>To Do Tasks</Card.Title>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th width="100" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              <tr>
                <td colSpan="2" className="text-center">
                  Loading...
                </td>
              </tr>
            }
            {!loading &&
              tasks.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>
                    <Button className="btn-danger btn btn-sm w-100" onClick={ev => onDeleteClick(t)}>Delete</Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">
                <form onSubmit={onSubmit}>
                  {message &&
                    <Alert variant="danger">
                      {message}
                    </Alert>
                  }
                  <Form.Group className="mb-0">
                    <Form.Control ref={taskNameRef} type="test" placeholder="Ad new task" />
                  </Form.Group>
                </form>
              </td>
            </tr>
          </tfoot>
        </table>
      </Card.Body>
    </Card>
  )
}