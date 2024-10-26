import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

//converations is {{id, name}, messages}
//We don't have an id, so just use order index

//action bootstrap gives it styling and clickable
//active: on off boolean, each conversation object has
//a selected boolean property now and that determines if its
//active. onClick will trigget setSelectedConversationIndex which 
//just changes selectedConversationIndex state to that index
//(and index is just array positioning here), by default it was 
//set to the first one (0)
export default function Conversations() {
    const { conversations, selectConversationIndex } = useConversations()
  return (
    <ListGroup variant="flush">
        {conversations.map((conversation, index) => (
            <ListGroup.Item 
                key={index}
                action
                onClick={() => selectConversationIndex(index)}
                active={conversation.selected}> 
                {conversation.recipients.map(r=>r.name).join(', ')}
            </ListGroup.Item>
        ))}
    </ListGroup>
  )
}

//Conversations: [conversation1, conversation2,...]

//Each conversation object: 

/*
{
  selectedContacts: [id1, id2, id3, ...], 
  messages: [{ sender1ID, text1 }, { sender2ID, text2 }],    
  recipients: [                         
    { id: 'contact-id-1', name: 'Contact Name 1' },
    { id: 'contact-id-2', name: 'Contact Name 2' }
  ],
  selected: true or false                
}
*/