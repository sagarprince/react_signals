import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import styles from './NotFound.module.scss';

export default function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <p
          className={clsx({
            [styles.container__text_base]: true,
            [styles.container__text_base__red]: true,
          })}
        >
          404
        </p>
        <h1 className={styles.container__heading}>Page not found</h1>
        <p
          className={clsx({
            [styles.container__text_base]: true,
            [styles.container__text_base__sub_text]: true,
          })}
        >
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className={styles.container__back_home}>
          <Link to='/'>
            <i className='fa fa-arrow-left'></i> Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
