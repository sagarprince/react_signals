import { useState, useEffect, useCallback } from 'react';
import { CampaignsService } from '../../services/CampaignsService';

export function useCampaign(id: number): any {
  const [campaign, setCampaign] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const controller = new AbortController();

  const fetchCampaign = useCallback(
    async (id: number) => {
      try {
        const response = await CampaignsService.getCampaignById(id, controller.signal);
        setCampaign(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    id && fetchCampaign(id);

    return () => {
      id && controller.abort();
    };
  }, [id]);

  return {
    campaign,
    isLoading,
    error,
  };
}
