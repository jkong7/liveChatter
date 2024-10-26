import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useContacts } from './ContactsProvider'
import arrayEquality from '../utillity/arrayEquality'
import { useSocket } from './SocketProvider'

//BASICALLY SAME AS ContactsProvider 
//createConversation instead of createContact

const ConversationsContext = React.createContext() //1. Create context

//2. useContext (shorthand custom hook)
export function useConversations() {
  return useContext(ConversationsContext)
}

//3.Create custom provider contacts provider 
export function ConversationsProvider({ id, children }) {
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
    const { socket } = useSocket()

    const { contacts } = useContacts()
  //define contacts array state here with also createContacts
  //From here is then where can access createContacts in our modal create!!

  //Persist - so use local storage!
  const [conversations, setConversations] = useLocalStorage('conversations', [])

  //Spread and create new array entry with id and name
  function createConversation(selectedContacts) {
    //Adds a new conversation object, which has an array of the contacts
    //involved in this conversation and then array to hold messages for this
    //conversation (init empty)
    setConversations(prevConversations => {
      return [...prevConversations, { selectedContacts, messages: [] }]
    }
    )
  }

  //This will be called TO server and TO client, so needs to be flexible enough
  //for that 
  //Remember, conversations -> conversation object is just selectedContacts
  //array and messages array, FORMATTED gives us recipients field with the names
  //and selected bool, that auto generates on renders, here we just need to 
  //deal with selectedContacts and messages arrays 
  //WE ARE ONLY DEALING WITH OG CONVERATION WITH SELECTEDCONTACTS AND MESSAGES KEYS, 
  //NOT FORMATTED VERSION

  //Note: what defines a conversation IS its contacts array so thats why we do
  //array equality to determine to add to its messages array 
  /*
{
  selectedContacts: [id1, id2, id3, ...], 
  messages: [{ sender1ID, text1 }, { sender2ID, text2 }],                 
}
*/

  //Walked through the entire logic, crystal clear to me, mapping and spreading
  //and logic goat 
  //Make callback so that re renders don't change it, makes sure the 
  //useEffect for setting up socket handler doesn't keep getting made/destroyed
  const addMessageToConversation=useCallback(({ recipients, text, sender }) => {
    setConversations(prevConversations=>{
        let madeChange = false
        let newMessage = { sender, text }
        const newConversations = prevConversations.map(conversation=>{
            if (arrayEquality(conversation.selectedContacts, recipients)) {
                madeChange = true 
                return {
                    ...conversation, 
                    messages: [...conversation.messages, newMessage]
                }
            } else {
                return conversation 
            }
        })
        if (madeChange) {
            return newConversations 
        } else {
            return [
                ...prevConversations, 
                { selectedContacts: recipients, messages: [newMessage] }
            ]
        } 
    })
  }, [setConversations])

  //Step 3 of socket cycle: client receives broadcasting
  useEffect((()=> {
    if (socket==null) return 
    socket.on('receive-message', addMessageToConversation)
    
    return () => socket.off('receive-message')
  }), [socket, addMessageToConversation])

  //Simply call ^ with recipients, text and SENDER which is OUR OWN ID, 
  //so we need to pass OUR id to conversationsProvider from app
  function sendMessage(recipients, text) {
    //Step 1 of socket cycle: client sends message to server
    socket.emit("send-message", { recipients, text })

    addMessageToConversation({ recipients, text, sender: id})
  }


  //Right now, selectedContacts is an array of just Ids, we want the names too
  //Loop through conversations, then get the selectedContacts and map through
  //each (now we have id, variable is recipient), NOW, we find the contact in the contacts
  //array whose contact.id MATCHES the current id (recipient)
  //Then we can get that maching name through contact.name if we FOUND matching
  //otherwise default to the id
  //Convert each recipient (id) to an object with id AND name

  //formattedConversations has everything about the original
  //but instead of selectedContacts array of just ids, will be an 
  //array of objects with id AND name, note still has the messages array
  
  //Pretty confusing, lots of layers

  //Now each conversation will also have a selected boolean

  const formattedConversations = (conversations || []).map((conversation, index) => {
    const recipients = (conversation.selectedContacts || []).map(recipient => {
      const contact = contacts.find(contact => contact.id === recipient);
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });
  
    const messages = (conversation.messages || []).map(message => {
      const contact = contacts.find(contact => contact.id === message.sender);
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: { name, fromMe } };
    });
  
    const selected = index === selectedConversationIndex;
    return { ...conversation, recipients, messages, selected };
  });  

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

  
  //Provider needs to provide convserations (formatted) and 
  //createConversation function 

  //Give setState function to change selected index as well as 
  //current conversation that is selected
  const value = {
    conversations: formattedConversations, 
    createConversation,
    selectConversationIndex: setSelectedConversationIndex,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage, 
  }

  //Pass in conversations and createConversation to use in components
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

//4. Wrap provider 
