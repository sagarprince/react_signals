import { useContext } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

export default function useApp(): AppContextType {
  return useContext(AppContext);
}
