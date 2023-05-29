import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import { useContacts, useContactsDispatch } from '../../shared/hooks/useContacts';
import { SET_CURRENT_PAGE, SET_QUERY } from '../../shared/contexts/ContactsContext';

import styles from './ContactsPage.module.scss';

import { ROUTES } from '../../constants';

import { DataTable, TableColumn } from '../../shared/components/DataTable/DataTable';
import Pagination from '../../shared/components/Pagination/Pagination';
import { Button, Input } from '../../shared/components/Form';

export default function ContactsPage() {
  useDocumentTitle('Contacts');
  const { contacts, totalCount, currentPage, isLoading, query, error, deleteContact = () => {} } = useContacts();
  const dispatch = useContactsDispatch();
  const navigate = useNavigate();

  const onEdit = useCallback((contact: any) => {
    navigate(ROUTES.EDIT_CONTACT.replace(':id', contact.id));
  }, []);

  const onDelete = useCallback((contact: any) => {
    if (confirm('Do you want to delete this contact?')) {
      deleteContact(contact.id);
    }
  }, [contacts, currentPage]);

  const columns: TableColumn[] = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Gender', key: 'gender' },
    { label: 'Created At', key: 'createdAt' },
    {
      label: 'Actions',
      key: 'actions',
      component: (data) => {
        return <ContactActions onEdit={() => onEdit(data)} onDelete={() => onDelete(data)} />;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__heading}>
          <h1>Contacts</h1>
          <h3>List of all the contacts which can be used to send campagains to. You can add, edit or delete contact.</h3>
        </div>
        <div className={styles.header__actions}>
          <Button type='button' onClick={() => navigate(ROUTES.ADD_CONTACT)}>
            Add Contact
          </Button>
        </div>
      </div>
      <div className={styles.wrap}>
        <SearchContactsInput
          value={query}
          setValue={(value: any) => {
            dispatch({ type: SET_QUERY, query: value });
          }}
        />
        <div className={styles.contacts_table}>
          <DataTable columns={columns} rows={contacts} noResultsMessage='No Contacts Found...' isLoading={isLoading} />

          <div className={styles.contacts_pagination}>
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={(page) => {
                dispatch({ type: SET_CURRENT_PAGE, currentPage: page });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactActions({ onEdit, onDelete }: any) {
  return (
    <div className={styles.contact_actions}>
      <button type='button' onClick={onEdit} title='Edit Contact'>
        <i className='fa fa-edit' aria-hidden='true'></i>
      </button>
      <button type='button' onClick={onDelete} title='Delete Contact'>
        <i className='fa fa-trash' aria-hidden='true'></i>
      </button>
    </div>
  );
}

function SearchContactsInput({ value, setValue }: any) {
  const inputRef = useRef();

  const handleChange = () => {
    const input: any = inputRef && inputRef.current;
    setValue(input.value || '');
  };

  return (
    <div className={styles.search_contacts_input}>
      <Input ref={inputRef} type='text' name='search' placeholder='Search...' value={value} onChange={handleChange} autoComplete='off' />
    </div>
  );
}
