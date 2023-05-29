import React, { FC, ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';
import Animation from '../../Animation/Animation';
import { VALIDATION_ERRORS } from '../../../../constants';

export interface IRadioOption {
  value: string;
  label: string;
}

export interface IRadioProps {
  name: string;
  label?: string;
  options: IRadioOption[];
  value: any;
  required?: boolean;
  className?: any;
  hasError?: boolean | undefined;
  errorType?: any;
  errorMessage?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Radio: FC<IRadioProps> = memo(
  forwardRef(
    ({ name, label, options, value, required, hasError, errorType, errorMessage, className, onChange }: IRadioProps, ref: ForwardedRef<HTMLInputElement>) => {
      return (
        <div
          className={clsx({
            [styles.radio_container]: true,
            [styles.radio_container__invalid]: hasError,
          })}
        >
          {label && (
            <label htmlFor={name}>
              {label} {required && <span>*</span>}
            </label>
          )}
          <div
            className={clsx({
              [styles.radio_group]: true,
              [className]: typeof className !== 'undefined',
            })}
          >
            {options.map((option) => (
              <label key={option.value}>
                <input type='radio' name={name} value={option.value} checked={value == option.value} ref={ref} onChange={onChange} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
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
