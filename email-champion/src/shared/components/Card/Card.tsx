import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';

interface ICardProps {
  children?: ReactNode;
  className?: any;
}

export function Card({ children, className }: ICardProps) {
  return (
    <div
      className={clsx({
        [styles.card]: true,
        [className]: typeof className !== 'undefined',
      })}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: ICardProps) {
  return <>{children}</>;
}

export function CardFooter({ children }: ICardProps) {
  return <>{children}</>;
}

Card.Header = CardHeader;
Card.Footer = CardFooter;
