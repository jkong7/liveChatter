import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { v4 as uuidV4 } from 'uuid'

export default function Contacts() {
    const { contacts }  = useContacts()
  return (
    <ListGroup variant="flush">
        {contacts.map(contact => (
            <ListGroup.Item key={uuidV4()}> 
                {contact.name}
            </ListGroup.Item>
        ))}
    </ListGroup>
  )
}
//Rendering elements from array, you need a UNIQUE key for each item 