import { useState, useEffect, useCallback } from 'react';
import { ContactsService } from '../../services/ContactsService';

export function useContact(id: number): any {
  const [contact, setContact] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const controller = new AbortController();

  const fetchContact = useCallback(
    async (id: number) => {
      try {
        const response = await ContactsService.getContactById(id, controller.signal);
        console.log(response);
        setContact(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    id && fetchContact(id);

    return () => {
      id && controller.abort();
    };
  }, [id]);

  return {
    contact: contact,
    isLoading: isLoading,
    error: error,
  };
}
