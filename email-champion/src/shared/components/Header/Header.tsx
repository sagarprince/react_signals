import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

interface IHeaderProps {
  name: string;
  navigateTo: string;
  onLogout: () => void;
}

export default function Header({ name, navigateTo, onLogout }: IHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <Link to={navigateTo}>
            <img src='https://cdn-icons-png.flaticon.com/512/1604/1604538.png' alt='Email Champion' />
            <span>Email Champion</span>
          </Link>
        </div>
        <div className={styles.header__user}>
          <div className={styles.header__user__greeting}>Hello {name}</div>
          <button type='button' className={styles.header__user__logout_btn} title='Logout' onClick={onLogout}>
            <img src='https://cdn-icons-png.flaticon.com/512/1629/1629082.png' />
          </button>
        </div>
      </div>
    </header>
  );
}
