import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
// import { useContacts } from '../../shared/hooks/useContacts';

import styles from './EmailTemplatesPage.module.scss';

export default function EmailTemplatesPage() {
  useDocumentTitle('Templates');
  // const state = useContacts();
  // console.log(state);

  return <h1 className={`${styles.heading} ${styles.green}`}>Templates Page</h1>;
}
