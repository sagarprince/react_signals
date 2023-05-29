import { createContext, ReactNode, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';
import useDebounce from '../hooks/useDebounce';
import { ROUTES } from '../../constants';
import { Campaign } from '../../models/Campaign';
import { CampaignsService } from '../../services/CampaignsService';

export const SET_CAMPAIGNS = 'SET_CAMPAIGNS';
export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';
export const SET_TOTAL_COUNT = 'SET_TOTAL_COUNT';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_QUERY = 'SET_QUERY';
export const SET_CURRENT_PAGE_QUERY = 'SET_CURRENT_PAGE_QUERY';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

export interface CampaignsContextType {
  campaigns: Campaign[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  query: any;
  error: any;
  userId?: number;
  saveCampaign?: (contact: Campaign, mode?: string) => void;
  deleteCampaign?: (id: number) => void;
}

export const CampaignsContext = createContext<CampaignsContextType>({} as CampaignsContextType);

export const CampaignsDispatchContext = createContext<any>(null);

const campaignsReducer = (state: CampaignsContextType, action: any) => {
  switch (action.type) {
    case SET_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.campaigns,
        totalCount: action.totalCount,
        isLoading: false,
      };
    case UPDATE_CAMPAIGN:
      return {
        ...state,
        campaigns: [...state.campaigns].map((c) => {
          if (action.campaign.id === c.id) {
            return {
              ...c,
              ...action.campaign,
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

const initialState: CampaignsContextType = {
  campaigns: [],
  isLoading: true,
  totalCount: 0,
  currentPage: 1,
  query: '',
  error: null,
};

export function CampaignsProvider({ children }: { children: ReactNode }): any {
  const [state, dispatch] = useReducer(campaignsReducer, initialState);

  const { user } = useAuth();

  const query = useDebounce(state.query);

  const navigate = useNavigate();

  const { refreshDashboardInfo } = useApp();

  useEffect(() => {
    getCampaigns();
  }, [state.currentPage]);

  useEffect(() => {
    state.query && dispatch({ type: SET_CURRENT_PAGE, page: 1 });
    getCampaigns();
  }, [query]);

  async function getCampaigns() {
    dispatch({ type: SET_LOADING, isLoading: true });
    try {
      const response = await CampaignsService.getCampaigns({
        page: state.currentPage,
        query: state.query,
        limit: 10,
        sort: 'id',
        order: 'desc',
        userId: user && user.id,
      });
      dispatch({ type: SET_CAMPAIGNS, campaigns: response.campaigns, totalCount: response.totalCount });
    } catch (error) {
      dispatch({ type: SET_ERROR, error: error });
    } finally {
      dispatch({ type: SET_LOADING, isLoading: false });
    }
  }

  async function saveCampaign(campaign: Campaign, mode: string = 'ADD') {
    dispatch({ type: SET_LOADING, isLoading: true });

    try {
      const response = await CampaignsService.saveCampaign(campaign, mode);
      if (mode === 'ADD') {
        if (state.currentPage > 1) {
          dispatch({ type: SET_CURRENT_PAGE_QUERY, page: 1, query: '' });
        } else {
          await getCampaigns();
        }
        navigate(ROUTES.CAMPAIGNS);
      } else {
        dispatch({ type: UPDATE_CAMPAIGN, campaign: new Campaign(response) });
      }
      refreshDashboardInfo();
    } catch (error) {
      dispatch({ type: SET_ERROR, error: error });
    }
  }

  async function deleteCampaign(id: number) {
    dispatch({ type: SET_LOADING, isLoading: true });
    try {
      await CampaignsService.deleteCampaign(id);
      if (state.campaigns && state.campaigns.length === 1) {
        dispatch({ type: SET_CURRENT_PAGE_QUERY, page: 1, query: '' });
      } else {
        await getCampaigns();
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
      saveCampaign,
      deleteCampaign,
    };
  }, [state, user, saveCampaign, deleteCampaign]);

  return (
    <CampaignsContext.Provider value={value}>
      <CampaignsDispatchContext.Provider value={dispatch}>{children}</CampaignsDispatchContext.Provider>
    </CampaignsContext.Provider>
  );
}
