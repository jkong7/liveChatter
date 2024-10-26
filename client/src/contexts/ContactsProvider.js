import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ContactsContext = React.createContext() //1. Create context

//2. useContext (shorthand custom hook)
export function useContacts() {
  return useContext(ContactsContext)
}

//3.Create custom provider contacts provider 
export function ContactsProvider({ children }) {

  //define contacts array state here with also createContacts
  //From here is then where can access createContacts in our modal create!!

  //Persist - so use local storage!
  const [contacts, setContacts] = useLocalStorage('contacts', [])

  //Spread and create new array entry with id and name
  function createContact(id, name) {
    setContacts(prevContacts => {
      return [...prevContacts, { id, name }]
    }
    )
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}

//4. Wrap provider 
