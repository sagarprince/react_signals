import { createContext, ReactNode, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import useDebounce from '../hooks/useDebounce';
import { ROUTES } from '../../constants';
import { Contact } from '../../models/Contact';
import { ContactsService } from '../../services/ContactsService';

export const SET_CONTACTS = 'SET_CONTACTS';
export const SET_ALL_CONTACTS = 'SET_ALL_CONTACTS';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const SET_TOTAL_COUNT = 'SET_TOTAL_COUNT';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_QUERY = 'SET_QUERY';
export const SET_CURRENT_PAGE_QUERY = 'SET_CURRENT_PAGE_QUERY';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

export interface ContactsContextType {
  contacts: Contact[];
  allContacts: Contact[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  query: any;
  error: any;
  userId?: number;
  saveContact?: (contact: Contact, mode?: string) => void;
  deleteContact?: (id: number) => void;
}

export const ContactsContext = createContext<ContactsContextType>({} as ContactsContextType);

export const ContactsDispatchContext = createContext<any>(null);

const contactsReducer = (state: ContactsContextType, action: any) => {
  switch (action.type) {
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.contacts,
        totalCount: action.totalCount,
        isLoading: false,
      };
    case SET_ALL_CONTACTS:
      return {
        ...state,
        allContacts: action.allContacts,
      };
    case UPDATE_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts].map((c) => {
          if (action.contact.id === c.id) {
            return {
              ...c,
              ...action.contact,
            };
          }
          return c;
        }),
        isLoading: false,
      };
    case SET_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.totalCount,
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage,
      };
    case SET_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case SET_ERROR:
      return {
        ...state,
        contacts: [],
        totalPages: 0,
        error: action.error,
        isLoading: false,
      };
    case SET_CURRENT_PAGE_QUERY:
      return {
        ...state,
        currentPage: action.currentPage,
        query: action.query,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: ContactsContextType = {
  contacts: [],
  allContacts: [],
  isLoading: true,
  totalCount: 0,
  currentPage: 1,
  query: '',
  error: null,
};

export function ContactsProvider({ children }: { children: ReactNode }): any {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  const { user } = useAuth();

  const query = useDebounce(state.query);

  const navigate = useNavigate();

  const { refreshDashboardInfo } = useApp();

  useEffect(() => {
    getAllContacts();
  }, []);

  useEffect(() => {
    getContacts();
  }, [state.currentPage]);

  useEffect(() => {
    state.query && dispatch({ type: SET_CURRENT_PAGE, page: 1 });
    getContacts();
  }, [query]);

  async function getContacts() {
    dispatch({ type: SET_LOADING, isLoading: true });
    try {
      const response = await ContactsService.getContacts({
        page: state.currentPage,
        query: state.query,
        limit: 10,
        sort: 'id',
        order: 'desc',
        userId: user && user.id,
      });
      dispatch({ type: SET_CONTACTS, contacts: response.contacts, totalCount: response.totalCount });
    } catch (error) {
      dispatch({ type: SET_ERROR, error: error });
    } finally {
      dispatch({ type: SET_LOADING, isLoading: false });
    }
  }

  async function getAllContacts() {
    try {
      const response = await ContactsService.getContacts({
        page: state.currentPage,
        query: state.query,
        limit: -1,
        sort: 'id',
        order: 'desc',
        userId: user && user.id,
      });
      dispatch({ type: SET_ALL_CONTACTS, allContacts: response.contacts });
    } catch (error) {
    } finally {
    }
  }

  async function saveContact(contact: Contact, mode: string = 'ADD') {
    dispatch({ type: SET_LOADING, isLoading: true });

    try {
      const response = await ContactsService.saveContact(contact, mode);
      if (mode === 'ADD') {
        if (state.currentPage > 1) {
          dispatch({ type: SET_CURRENT_PAGE_QUERY, page: 1, query: '' });
        } else {
          await getContacts();
        }
        navigate(ROUTES.CONTACTS);
      } else {
        dispatch({ type: UPDATE_CONTACT, contact: new Contact(response) });
      }
      refreshDashboardInfo();
    } catch (error) {
      dispatch({ type: SET_ERROR, error: error });
    }
  }

  async function deleteContact(id: number) {
    dispatch({ type: SET_LOADING, isLoading: true });
    try {
      await ContactsService.deleteContact(id);
      if (state.contacts && state.contacts.length === 1) {
        dispatch({ type: SET_CURRENT_PAGE_QUERY, page: 1, query: '' });
      } else {
        await getContacts();
      }
      refreshDashboardInfo();
    } catch (error) {
      dispatch({ type: SET_ERROR, error: error });
    }
  }

  const value = useMemo(() => {
    return {
      ...state,
      userId: user.id,
      saveContact,
      deleteContact,
    };
  }, [state, user, saveContact, deleteContact]);

  return (
    <ContactsContext.Provider value={value}>
      <ContactsDispatchContext.Provider value={dispatch}>{children}</ContactsDispatchContext.Provider>
    </ContactsContext.Provider>
  );
}
