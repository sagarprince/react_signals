import { FC, ForwardedRef, forwardRef, InputHTMLAttributes, memo, useCallback, useState } from 'react';
import clsx from 'clsx';
import styles from './Select.module.scss';
import Animation from '../../Animation/Animation';
import { VALIDATION_ERRORS } from '../../../../constants';

interface ISelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValues?: Array<any> | string | number;
  required?: boolean;
  className?: string;
  hasError?: boolean | undefined;
  errorType?: any;
  errorMessage?: any;
  multiple?: boolean;
  onChange?: (value: any) => void;
}

export const Select: FC<ISelectProps> = memo(
  forwardRef(
    (
      { label, name, options, defaultValues, required, hasError, errorType, errorMessage, className, onChange, ...rest }: ISelectProps,
      ref: ForwardedRef<HTMLSelectElement>
    ) => {
      return (
        <div
          className={clsx({
            [styles.select_container]: true,
            [styles.select_container__invalid]: hasError,
          })}
        >
          {label && (
            <label htmlFor={name}>
              {label} {required && <span>*</span>}
            </label>
          )}
          <select ref={ref} name={name} value={defaultValues} onChange={onChange} {...rest}>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
    }
  )
);
