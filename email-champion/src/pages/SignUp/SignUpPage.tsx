import { useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useAuth from '../../shared/hooks/useAuth';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';
import { Link } from 'react-router-dom';

import styles from './SignUpPage.module.scss';

import { Input, Button } from '../../shared/components/Form';
import { Alert, AlertVariants } from '../../shared/components/Alert/Alert';

import { ROUTES, VALIDATION_RULES, VALIDATION_ERRORS } from '../../constants';

import { User } from '../../models/User';

interface ISignUpInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function SignUpPage() {
  useDocumentTitle('Sign Up');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError: setValidationError,
    formState: { errors },
  } = useForm<ISignUpInput>();

  const formValues = getValues();

  const { signUp, error, isLoading, setError } = useAuth();

  const onSubmit: SubmitHandler<ISignUpInput> = (payload: any) => {
    const user = new User(payload);
    delete user.id;
    signUp(user);
  };

  useEffect(() => {
    register('firstName', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.name,
        message: VALIDATION_ERRORS.firstName,
      },
    });
    register('lastName', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.name,
        message: VALIDATION_ERRORS.lastName,
      },
    });
    register('email', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.email,
        message: VALIDATION_ERRORS.email,
      },
    });
    register('password', {
      required: true,
      minLength: {
        value: 8,
        message: VALIDATION_ERRORS.passwordMinLength,
      },
      pattern: {
        value: VALIDATION_RULES.password,
        message: VALIDATION_ERRORS.passwordPattern,
      },
      validate: () => {
        trigger('confirmPassword');
        return undefined;
      },
    });
    register('confirmPassword', {
      required: true,
      validate: (val: string) => {
        const { password } = getValues();
        if (password !== val) {
          return VALIDATION_ERRORS.passwordNotMatch;
        }
      },
    });
  }, []);

  useEffect(() => {
    if (error && error.message && error.message.indexOf('already') > -1) {
      setValidationError('email', {});
    }
  }, [error]);

  const setInputValue = useCallback(
    (e: any) => {
      setValue(e.target.name, e.target.value);
      trigger(e.target.name);
    },
    [trigger]
  );

  return (
    <div className={styles.signup_page_container}>
      <div className={styles.signup_card}>
        <section className={styles.signup_card__header}>
          <img src='https://cdn-icons-png.flaticon.com/512/295/295128.png' alt='Email Champion' />
          <h2>Sign up to your account</h2>
        </section>
        <section className={styles.signup_card__content}>
          <Alert
            variant={AlertVariants.ERROR}
            show={error !== null}
            onClose={() => {
              setError(null);
            }}
          >
            {error?.message}
          </Alert>
          <form method='post' className={styles.signup_card__form} onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <div className={styles.signup_card__form__field_row}>
              <Input
                type='text'
                label='First Name'
                hasError={errors?.firstName ? true : false}
                errorType={errors?.firstName?.type}
                errorMessage={errors?.firstName?.message}
                name='firstName'
                defaultValue={formValues.firstName}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.signup_card__form__field_row}>
              <Input
                type='text'
                label='Last Name'
                hasError={errors?.lastName ? true : false}
                errorType={errors?.lastName?.type}
                errorMessage={errors?.lastName?.message}
                name='lastName'
                defaultValue={formValues.lastName}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.signup_card__form__field_row}>
              <Input
                type='email'
                label='Email'
                hasError={errors?.email ? true : false}
                errorType={errors?.email?.type}
                errorMessage={errors?.email?.message}
                name='email'
                defaultValue={formValues.email}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.signup_card__form__field_row}>
              <Input
                type='password'
                label='Password'
                hasTogglePassword={true}
                hasError={errors?.password ? true : false}
                errorType={errors?.password?.type}
                errorMessage={errors?.password?.message}
                name='password'
                defaultValue={formValues.password}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.signup_card__form__field_row}>
              <Input
                type='password'
                label='Confirm Password'
                hasTogglePassword={true}
                hasError={errors?.confirmPassword ? true : false}
                errorType={errors?.confirmPassword?.type}
                errorMessage={errors?.confirmPassword?.message}
                name='confirmPassword'
                defaultValue={formValues.confirmPassword}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.signup_card__form__action_row}>
              <Button type='submit' disabled={isLoading}>
                {(isLoading && 'Please wait...') || 'Sign Up'}
              </Button>
            </div>
          </form>
        </section>
        <section className={styles.signup_card__footer}>
          <p>
            Already a user? <Link to={ROUTES.LOGIN}>LOGIN</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
