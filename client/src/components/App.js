import React from 'react'
import Login from "./Login";
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import { ContactsProvider } from '../contexts/ContactsProvider';
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';

function App() {
  const [id, setId] = useLocalStorage('id')

  //wrap dashboard component with contacts provider, now that entire
  //components tree has access to contacts and createContact
  //Also wrap conversations provider 
  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider id={id}>
        <ConversationsProvider id={id}>
          <Dashboard id={id}/>
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>

  )

  return (
     //Only two independent pages, login and dashboard, determined by if we have id
      id ? dashboard : <Login onIdsubmit={setId}/>
  );
}

export default App;
