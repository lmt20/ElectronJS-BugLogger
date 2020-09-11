import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const AddLogItem = (props) => {
    const [name, setName] = useState('')
    const [user, setUser] = useState('')
    const [priority, setPriority] = useState('')
    const addItem = (e) => {
        e.preventDefault();
        if (name === "" || user === "" || priority === "") {
            return props.addItem(false);
		}
        props.addItem(true, {name, user, priority});
        setName('');
        setUser('');
        setPriority('');
    }
    return (
        <Card className="mt-5 mb-3">
            <Card.Body>
                <Form onSubmit={addItem}>
                    <Row className="my-3">
                        <Col>
                            <Form.Control
                                placeholder="Log"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            ></Form.Control>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control
                                placeholder="User"
                                value={user}
                                onChange={e => setUser(e.target.value)}
                            ></Form.Control>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                placeholder="User"
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                            >
                                <option value="0">Set Priority</option>
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                            </Form.Control>
                        </Col>
                    </Row>
                    <Button className="mt-3" variant="secondary" block type="submit">Add Log</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default AddLogItem
