import { Link, useLocation, useMatch } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

function Breadcrumb() {
  const location = useLocation();
  const currentMatch = useMatch('/:url/*'); // Match all paths

  const paths = location.pathname.split('/').filter((path) => path !== ''); // Get individual path segments

  const pathName = (currentMatch && currentMatch.pathname) || '';
  const pathParts = pathName.match(/\/([^\/\d]+)\/?\d*$/) || [];
  const matchPath = (pathParts.length > 1 && pathParts[1]) || '';

  const items = [
    { label: 'Dashboard', link: '/' },
    ...paths
      .filter((path: any) => {
        return isNaN(path);
      })
      .map((path, index) => {
        const pathUrl = `/${paths.slice(0, index + 1).join('/')}`;
        const url = matchPath.indexOf(path) === -1 ? pathUrl : '';
        const label = path
          .replace(/[-_]\w/g, (match: string) => {
            return ' ' + match[1].toUpperCase();
          })
          .replace(/^\w/g, (match) => match.toUpperCase());
        return { label, link: url };
      }),
  ];

  return (
    <nav aria-label='breadcrumb' className={styles.breadcrumb_nav}>
      <ul className={styles.breadcrumb}>
        {items.map((item, index) => (
          <li
            className={`${index === items.length - 1 ? styles.active : ''}`}
            aria-current={index === items.length - 1 ? 'page' : undefined}
            key={index}
          >
            {item.link ? <Link to={item.link}>{item.label}</Link> : item.label}
            {index !== items.length - 1 && <i className='fa fa-angle-right' aria-hidden='true'></i>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Breadcrumb;
