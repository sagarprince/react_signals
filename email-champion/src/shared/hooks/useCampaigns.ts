import { useContext } from 'react';
import { CampaignsContextType, CampaignsContext, CampaignsDispatchContext } from '../contexts/CampaignsContext';

export function useCampaigns(): CampaignsContextType {
  return useContext(CampaignsContext);
}

export function useCampaignsDispatch(): any {
  return useContext(CampaignsDispatchContext);
}
