import { useContext } from 'react';
import { ContactsContext, ContactsContextType, ContactsDispatchContext } from '../contexts/ContactsContext';

export function useContacts(): ContactsContextType {
  return useContext(ContactsContext);
}

export function useContactsDispatch(): any {
  return useContext(ContactsDispatchContext);
}