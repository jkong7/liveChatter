import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';

export default function OpenConversation() {
    const [text, setText] = useState('')

    //lastMessage bool true only for last message so setRef
    //is applied to that element only, useCallback parameter node
    //now refers to that last message

    //useCallback memoizes function, ensures setRef remains same function
    //instance across renders, which is efficient
    //setRef ONLY called when change to the node parameter (DOM element), 
    //here this happens when new last element appears in dom 

    //Every time we re render component, function gets re rendered, which might
    //cause unwanted useEffect side effects, use callback DOESNT re create it
    //just wrap function you want to memoize in a useCallback, dependency array 
    //will be ONLY time function changed 
    //function same across re renders unless dependency array 
    //Empty dep array means function created ONCE when the component 
    //first renders and will retain SAME reference regardless of re renders

    //setRef triggered for last message when re render, setRef then 
    //receives the div DOM node as the node parameter 
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    //We want to sendMessage using selectedConversation which can give us 
    //all ids of the recipients of said conversation 
    //Pass recipients ids array AND text to sendMessage
    //text just state of input text, make sure to clear after handleSubmit

    const { sendMessage, selectedConversation } = useConversations()

    function handleSubmit(e) {
        e.preventDefault(); 

        sendMessage(selectedConversation.recipients.map(r=> r.id), 
                    text)
        setText('')
    }

  return (
    //Uses conditional fromMe logic for styles and positioning the text messages 
    <div className="d-flex flex-column flex-grow-1">
    <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
        {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length-1 ===index
            return (
            <div
            ref={lastMessage ? setRef : null}
            key={index}
            className={`my-1 d-flex flex-column ${
                message.senderName.fromMe ? 'align-self-end' : 'align-self-start'
            }`}
            style={{ maxWidth: '75%' }}
            >

                <div
                    className={`rounded px-3 py-2 mb-1 ${
                    message.senderName.fromMe ? 'bg-primary text-white' : 'border'
                    }`}
                >
                    {message.text}
                </div>

                <div
                    className={`text-muted small ${message.senderName.fromMe ? 'text-right' : ''}`}
                    style={{ textAlign: message.senderName.fromMe ? 'right' : 'left' }}
                >
                    {message.senderName.fromMe ? 'You' : message.senderName.name}
                </div>

            </div>
        )})}
        </div>
    </div>

      {/*Send message bubble*/}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
            <InputGroup>
                <Form.Control 
                as="textarea" 
                required 
                value={text}
                onChange={e => setText(e.target.value)}
                style={ {height: '75px', resize: 'none'} }/>
                <Button type="submit">Send</Button>
            </InputGroup>
        </Form.Group>
      </Form>

    </div>
  )
}


//Entire right hand of the screen
//Good checkpoint, one hour/one hour fourty of vid

//Top div with flex-grow-1 takes up all the available space
//element takes up all avaiable space within container, effectively 
//pushing any remaining elements below it to the bottom, with flex-column,
//causes other elements (here the message form) to stay at the bottom

//Regular flex: takes available hor space, pushing elements to right


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