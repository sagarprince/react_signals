import RestAPI from './RestApi';

export const AppService = {
  async getDashboardInfo() {
    try {
      const response = await RestAPI.get('/api/dashboard');
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
