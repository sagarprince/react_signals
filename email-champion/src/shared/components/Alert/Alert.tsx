import { ReactNode, useEffect, useState, memo } from 'react';
import clsx from 'clsx';
import styles from './Alert.module.scss';
import Animation from '../Animation/Animation';

export enum AlertVariants {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

interface IAlertProps {
  variant: AlertVariants;
  children?: ReactNode;
  show: boolean;
  dismissible?: boolean;
  onClose?: () => void;
}

interface IProps {
  children?: ReactNode;
}

export function Alert({ variant, children, show, dismissible = true, onClose }: IAlertProps) {
  return (
    <Animation>
      {show && (
        <div
          className={clsx({
            [styles.alert]: true,
            [styles[variant]]: true,
          })}
        >
          {dismissible && (
            <button
              onClick={() => {
                onClose && onClose();
              }}
            >
              &times;
            </button>
          )}
          {children}
        </div>
      )}
    </Animation>
  );
}

function AlertHeading({ children }: IProps) {
  return <>{children}</>;
}

Alert.Heading = AlertHeading;
