import React, { useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import Conversations from './Conversations'
import Contacts from './Contacts'
import NewContactModal from './NewContactModal'
import NewConversationsModal from './NewConversationsModal'
//Creating left sidebar, needs user unique id to display 
//their info 

const CONVERSATIONS_KEY = "conversations"
const CONTACTS_KEY = "contacts"

export default function Sidebar({ id }) {
    const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
    const conversationsOpen = activeKey === CONVERSATIONS_KEY
    const [modalOpen, setModalOpen] = useState(false)

    function closeModal() {
        setModalOpen(false)
    }


  return (
    <div style={{ width: '250px', height: '100vh', borderRight: '1px solid #dee2e6'}} className="d-flex flex-column">
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
            <Nav variant="tabs" className="justify-content-center">
                <Nav.Item>
                    <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content className="border-right overflow-auto flex-grow-1">
                <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                    <Conversations/>
                </Tab.Pane>
                <Tab.Pane eventKey={CONTACTS_KEY}>
                    <Contacts/>
                </Tab.Pane>
            </Tab.Content>
            <div className="p-2 border-top border-right small">
                Your ID: <span className="text-muted">{id}</span>
            </div>
            <Button onClick={()=>setModalOpen(true)} className="rounded-0">
                New {conversationsOpen ? 'Conversations' : 'Contact'}
            </Button>
        </Tab.Container>

        <Modal show={modalOpen} onHide={closeModal}>
            {conversationsOpen ? 
            <NewConversationsModal closeModal={closeModal}/> :
            <NewContactModal closeModal={closeModal}/>
        }
        </Modal>
    </div>
  )
}

//activeKey in container determines which tab.pane is visible
//by matching activeKey with eventKey. Nav.link also changes 
//eventKey with setActiveKey which has eventKey auto passed in
//to change state 