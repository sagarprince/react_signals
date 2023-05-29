import RestAPI from './RestApi';
import { Campaign } from '../models/Campaign';

interface ICampaignsParams {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
  userId?: number;
  query?: any;
}

export const CampaignsService = {
  async getCampaigns({ page, limit, sort, order, userId, query }: ICampaignsParams) {
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

      const response = await RestAPI.get(`/api/campaigns`, { params });

      const totalCount = response.headers['x-total-count'] || 0;

      return {
        totalCount: totalCount,
        campaigns: response.data && response.data.map((campaign: any) => new Campaign(campaign)),
      };
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async getCampaignById(id: number, signal: any) {
    try {
      const response = await RestAPI.get(`/api/campaigns/${id}`, {
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

  async saveCampaign(campaign: Campaign, mode: string = 'ADD') {
    try {
      const response =
        mode === 'ADD' ? await RestAPI.post(`/api/campaigns`, { ...campaign }) : await RestAPI.put(`/api/campaigns/${campaign.id}`, { ...campaign });
      return response.data;
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async deleteCampaign(id: number) {
    try {
      const response = await RestAPI.delete(`/api/campaigns/${id}`);
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
