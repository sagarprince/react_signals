import clsx from 'clsx';
import styles from './FallbackError.module.scss';
import { Button } from '../Form';

export function FallbackError({ error, resetErrorBoundary }: any) {
  return (
    <div className={styles.wrap} role='alert'>
      <div className={styles.container}>
        <h1 className={styles.container__heading}>Something went wrong</h1>
        <pre
          className={clsx({
            [styles.container__text_base]: true,
            [styles.container__text_base__red]: true,
          })}
        >
          {error.message}
        </pre>
        <div className={styles.container__try_again}>
          <Button type='button' onClick={() => resetErrorBoundary()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FallbackRoutingError({ error, resetErrorBoundary }: any) {
  return <FallbackError error={error} resetErrorBoundary={resetErrorBoundary} />;
}
