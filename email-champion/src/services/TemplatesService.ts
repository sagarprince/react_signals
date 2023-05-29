import RestAPI from './RestApi';
import { Template } from '../models/Template';

export const TemplatesService = {
  async getTemplates() {
    try {
      const response = await RestAPI.get(`/api/templates`);
      return response.data && response.data.map((template: any) => new Template(template));
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },
};
