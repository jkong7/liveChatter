import React from 'react'
import Sidebar from './Sidebar'
import OpenConversation from './OpenConversation'
import { useConversations } from '../contexts/ConversationsProvider'

export default function Dashboard({ id }) {
    const { selectedConversation } = useConversations()

  return (
    <div className="d-flex" style={{ height: '100vh '}}>
        <Sidebar id={id}/>
        {selectedConversation && <OpenConversation/>}
    </div>
  )
}

//Workflow: 57 min, sidebar done with modals and conversations
//and contacts and some pretty dense logic lmao

//Now: Be able to select a conversation and have it display
//on the right side of screen 

//So render OpenConversation component (right side of screen)