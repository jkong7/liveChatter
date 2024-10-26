import React, { useRef, } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'

export default function Login({ onIdsubmit }) {
    //Ref the form control text dom element 
    const idRef = useRef()

    function handleSubmit(e) {
        e.preventDefault()
        
        //setId to text's current value 
        onIdsubmit(idRef.current.value)
    }

    //uuid for create new id button 
    function createNewId() {
        onIdsubmit(uuidV4()) 
    }

  return (
    <Container className="align-items-center d-flex" style={{height: "100vh"}}>
        <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group className="mb-3">
                <Form.Label>Enter Your Id</Form.Label>
                <Form.Control type="text" ref={idRef} required></Form.Control>
            </Form.Group>
            <Button type="submit" className="me-2">Login</Button>
            <Button onClick={createNewId} variant="secondary">Create A New Id</Button>
        </Form>
    </Container>
  )
}
