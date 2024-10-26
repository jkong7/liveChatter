import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

//For this form for conversations, instead of adding id and name, 
//loop through contacts and have them as checkboxes
export default function NewConversationsModal({ closeModal }) {
    const [selectedContactIds, setSelectedContactIds] = useState([])
    const { contacts } = useContacts()
    const { createConversation } = useConversations()

    //Based on checked conversations, create conversations on form submit
    //again we'll use context for createConversation to avoid prop drilling, 
    //closeModal again (passed prop) after submit button too
    function handleSubmit(e) {
        e.preventDefault(e)
        
        createConversation(selectedContactIds)
        closeModal()
    }

    //value of checkbox (checked or not) is just boolean of if the array
    //of selected contacts has it, on CHANGE, we either just add the contact
    //to array using state or remove it 
    function handleCheckboxChange(contactId) {
        setSelectedContactIds(prev => {
            if (prev.includes(contactId)) {
                return prev.filter(prevId => {
                    return contactId !== prevId
                })
            } else {
                return [...prev, contactId]
            }
        })
    }
    //selectedIds is an array of ids, nothing else 

  return (
    <>
    <Modal.Header closeButton>Create Conversation</Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmit}>
            {contacts.map(contact => (
                <Form.Group controlId={contact.id} key={contact.id}>
                    <Form.Check
                    type="checkbox" 
                    value={selectedContactIds.includes(contact.id)}
                    label={contact.name}
                    onChange={() => handleCheckboxChange(contact.id)}
                    />
                </Form.Group>
            ))}
            <Button type="submit">Create</Button>
        </Form>
    </Modal.Body>
</>
  )
}
