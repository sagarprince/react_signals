import RestAPI from './RestApi';
import { Contact } from '../models/Contact';

interface IContactsParams {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
  userId?: number;
  query?: any;
}

export const ContactsService = {
  async getContacts({ page, limit, sort, order, userId, query }: IContactsParams) {
    try {
      const params: any = {
        _page: page,
        _limit: limit,
        _sort: sort || '',
        _order: order || 'asc',
        q: query,
      };
      userId && (params.userId = userId);
      query && (params.q = query);

      const response = await RestAPI.get(`/api/contacts`, { params });

      const totalCount = response.headers['x-total-count'] || 0;

      return {
        totalCount: totalCount,
        contacts: response.data && response.data.map((contact: any) => new Contact(contact)),
      };
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async getContactById(id: number, signal: any) {
    try {
      const response = await RestAPI.get(`/api/contacts/${id}`, {
        signal: signal,
      });
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async saveContact(contact: Contact, mode: string = 'ADD') {
    try {
      const response = mode === 'ADD' ? await RestAPI.post(`/api/contacts`, { ...contact }) : await RestAPI.put(`/api/contacts/${contact.id}`, { ...contact });
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async deleteContact(id: number) {
    try {
      const response = await RestAPI.delete(`/api/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },
};
