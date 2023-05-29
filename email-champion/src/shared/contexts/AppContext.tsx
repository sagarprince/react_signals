import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Template } from '../../models/Template';
import { AppService } from '../../services/AppService';
import { TemplatesService } from '../../services/TemplatesService';

export interface DashboardInfo {
  contacts?: number;
  campaigns?: number;
  templates?: number;
  isLoading?: boolean;
  error?: any;
}

export interface AppContextType {
  dashboardInfo: DashboardInfo;
  templates: Template[];
  refreshDashboardInfo: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }): any {
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    loadDashboardInfo();
    loadTemplates();
  }, []);

  async function loadDashboardInfo() {
    setDashboardInfo({
      ...dashboardInfo,
      error: null,
      isLoading: true,
    });
    try {
      const response = await AppService.getDashboardInfo();
      setDashboardInfo({
        ...dashboardInfo,
        ...response,
        isLoading: false,
      });
    } catch (error) {
      setDashboardInfo({
        ...dashboardInfo,
        error: error,
        isLoading: false,
      });
    }
  }

  async function loadTemplates() {
    try {
      const templates = await TemplatesService.getTemplates();
      console.log(templates);
      setTemplates(templates);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshDashboardInfo = async () => {
    await loadDashboardInfo();
  };

  const memoedValue = useMemo(
    () => ({
      dashboardInfo,
      templates,
      refreshDashboardInfo,
    }),
    [dashboardInfo, refreshDashboardInfo]
  );

  return <AppContext.Provider value={memoedValue as unknown as AppContextType}>{children}</AppContext.Provider>;
}
