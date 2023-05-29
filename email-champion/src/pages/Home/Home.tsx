import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../shared/components/Header/Header';
import Breadcrumb from '../../shared/components/Breadcrumb/Breadcrumb';

import useAuth from '../../shared/hooks/useAuth';

import styles from './Home.module.scss';

import * as ROUTES from '../../constants/routes';

export default function Home() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className={styles.admin_wrap}>
      <Header name={user?.firstName || ''} navigateTo={ROUTES.HOME} onLogout={logout} />
      <main className={styles.admin_wrap__content}>
        {location.pathname !== '/' && (
          <div className={styles.admin_wrap__breadcrumb}>
            <Breadcrumb />
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
