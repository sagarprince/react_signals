import { FC, ForwardedRef, forwardRef, InputHTMLAttributes, memo } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.scss';
import { VALIDATION_ERRORS } from '../../../../constants/validation.errors';
import Animation from '../../Animation/Animation';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  className?: string;
  hasError?: boolean | undefined;
  errorType?: any;
  errorMessage?: any;
}

export const Checkbox: FC<ICheckboxProps> = memo(
  forwardRef(({ name, label, required, className, hasError, errorType, errorMessage, ...rest }: ICheckboxProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div
        className={clsx({
          [styles.checkbox_container]: true,
          [styles.checkbox_container__invalid]: hasError,
        })}
      >
        <input
          ref={ref}
          id={name}
          name={name}
          type='checkbox'
          className={className}
          {...rest}
        />
        <label htmlFor={name}>
          {label}
        </label>
        <Animation>
          {hasError && (
            <p
              role='alert'
              className={clsx({
                [styles.validation_error]: true,
              })}
            >
              {errorType === 'required' ? VALIDATION_ERRORS.required : errorMessage}
            </p>
          )}
        </Animation>
      </div>
    );
  })
);
