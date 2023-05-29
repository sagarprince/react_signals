import { forwardRef, ButtonHTMLAttributes, ReactNode, memo } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type: 'submit' | 'button';
  className?: string;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, IButtonProps>(({ type, children, className, ...rest }, ref) => (
    <button ref={ref} type={type} className={clsx([className, styles.btn])} {...rest}>
      {children}
    </button>
  ))
);
