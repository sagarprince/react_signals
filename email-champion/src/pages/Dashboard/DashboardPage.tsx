import { Link } from 'react-router-dom';
import { withErrorBoundary } from 'react-error-boundary';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import useApp from '../../shared/hooks/useApp';

import { Card } from '../../shared/components/Card/Card';
import { FallbackError } from '../../shared/components/FallbackError/FallbackError';

import * as ROUTES from '../../constants/routes';

import styles from './DashboardPage.module.scss';
import { useEffect } from 'react';

export default withErrorBoundary(
  function DashboardPage() {
    useDocumentTitle('Dashboard');
    const { dashboardInfo } = useApp();

    useEffect(() => {
      // throw new Error('I crashed!');
    }, []);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.statistics_cards}>
          <Card className={styles.statistics_card}>
            <div className={styles.statistics_card__body}>
              <div className={styles.statistics_card__icon}>
                <img src='https://cdn-icons-png.flaticon.com/512/1251/1251166.png' />
              </div>
              <div className={styles.statistics_card__content}>
                <Card.Header>
                  <header>Contacts</header>
                </Card.Header>
                <div className={styles.statistics_card__count}>{dashboardInfo?.contacts || 0}</div>
              </div>
            </div>
            <div className={styles.statistics_card__footer}>
              <Card.Footer>
                <Link to={ROUTES.CONTACTS}>
                  View <i className='fa fa-arrow-right'></i>
                </Link>
              </Card.Footer>
            </div>
          </Card>

          <Card className={styles.statistics_card}>
            <div className={styles.statistics_card__body}>
              <div className={styles.statistics_card__icon}>
                <img src='https://cdn-icons-png.flaticon.com/512/2222/2222469.png' />
              </div>
              <div className={styles.statistics_card__content}>
                <Card.Header>
                  <header>Campaigns</header>
                </Card.Header>
                <div className={styles.statistics_card__count}>{dashboardInfo?.campaigns || 0}</div>
              </div>
            </div>
            <div className={styles.statistics_card__footer}>
              <Card.Footer>
                <Link to={ROUTES.CAMPAIGNS}>
                  View <i className='fa fa-arrow-right'></i>
                </Link>
              </Card.Footer>
            </div>
          </Card>

          <Card className={styles.statistics_card}>
            <div className={styles.statistics_card__body}>
              <div className={styles.statistics_card__icon}>
                <img src='https://cdn-icons-png.flaticon.com/512/2279/2279212.png' />
              </div>
              <div className={styles.statistics_card__content}>
                <Card.Header>
                  <header>Templates</header>
                </Card.Header>
                <div className={styles.statistics_card__count}>{dashboardInfo?.templates || 0}</div>
              </div>
            </div>
            <div className={styles.statistics_card__footer}>
              <Card.Footer>
                <Link to={ROUTES.TEMPLATES}>
                  View <i className='fa fa-arrow-right'></i>
                </Link>
              </Card.Footer>
            </div>
          </Card>
        </div>
      </div>
    );
  },
  {
    FallbackComponent: FallbackError,
    onError(error, info) {
      console.log(error, info);
    },
  }
);
