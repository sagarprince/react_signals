import RestAPI from './RestApi';

export const AppService = {
  async getTodos() {
    try {
      const response = await RestAPI.get('todos');
      return response.data && response.data.todos || [];
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },
};
