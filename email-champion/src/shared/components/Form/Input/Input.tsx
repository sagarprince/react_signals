import { FC, ForwardedRef, forwardRef, InputHTMLAttributes, memo, useCallback, useState } from 'react';
import useForwardRef from '../../../hooks/useForwardedRef';
import clsx from 'clsx';
import styles from './Input.module.scss';
import { VALIDATION_ERRORS } from '../../../../constants';
import Animation from '../../Animation/Animation';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  type: string;
  required?: boolean;
  className?: string;
  hasTogglePassword?: boolean;
  hasError?: boolean | undefined;
  errorType?: any;
  errorMessage?: any;
  ref?: any;
}

enum InputTypes {
  PASSWORD = 'password',
  TEXT = 'text',
  NUMBER = 'number',
}

export const Input: FC<IInputProps> = memo(
  forwardRef(
    (
      { type, name, label, required, className, hasTogglePassword = false, hasError, errorType, errorMessage, ...rest }: IInputProps,
      ref: ForwardedRef<HTMLInputElement>
    ) => {
      const [inputType, setInputType] = useState(type);
      const inputRef = useForwardRef<HTMLInputElement>(ref);

      const handleTogglePassword = useCallback(() => {
        setInputType((prevType) => {
          return (prevType === InputTypes.PASSWORD && InputTypes.TEXT) || InputTypes.PASSWORD;
        });
      }, []);

      return (
        <div
          className={clsx({
            [styles.input_container]: true,
            [styles.input_container__invalid]: hasError,
          })}
        >
          {label && (
            <label htmlFor={name}>
              {label} {required && <span>*</span>}
            </label>
          )}
          <div className={styles.input_field}>
            <input id={name} name={name} type={inputType} aria-label={label} ref={inputRef} className={clsx([className])} aria-invalid={hasError} {...rest} />
            {hasTogglePassword && (
              <button type='button' className={styles.toggle_password_btn} onClick={handleTogglePassword}>
                <i
                  className={clsx({
                    ['fa']: true,
                    ['fa-eye']: inputType !== InputTypes.PASSWORD,
                    ['fa-eye-slash']: inputType === InputTypes.PASSWORD,
                  })}
                ></i>
              </button>
            )}
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
