import { useForm, SubmitHandler } from 'react-hook-form';
import useAuth from '../../shared/hooks/useAuth';
import useDocumentTitle from '../../shared/hooks/useDocumentTitle';

import { Link } from 'react-router-dom';

import styles from './LoginPage.module.scss';

import { Input, Button, Checkbox } from '../../shared/components/Form';
import { Alert, AlertVariants } from '../../shared/components/Alert/Alert';

import { ROUTES, VALIDATION_RULES, VALIDATION_ERRORS } from '../../constants';
import { useCallback, useEffect } from 'react';

interface ILoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  useDocumentTitle('Login');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ILoginInput>();

  const formValues = getValues();

  const { login, error, isLoading, setError } = useAuth();

  const onSubmit: SubmitHandler<ILoginInput> = (payload: any) => {
    login(payload);
  };

  useEffect(() => {
    register('email', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.email,
        message: VALIDATION_ERRORS.email,
      },
    });
    register('password', {
      required: true,
    });
  }, []);

  const setInputValue = useCallback(
    (e: any) => {
      setValue(e.target.name, e.target.value);
      trigger(e.target.name);
    },
    [trigger]
  );

  return (
    <div className={styles.login_page_container}>
      <div className={styles.login_card}>
        <section className={styles.login_card__header}>
          <img src='https://cdn-icons-png.flaticon.com/512/295/295128.png' alt='Email Champion' />
          <h2>Sign in to your account</h2>
        </section>
        <section className={styles.login_card__content}>
          <Alert
            variant={AlertVariants.ERROR}
            show={error !== null}
            onClose={() => {
              setError(null);
            }}
          >
            {error?.message}
          </Alert>
          <form method='post' className={styles.login_card__form} onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <div className={styles.login_card__form__field_row}>
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
            <div className={styles.login_card__form__field_row}>
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
            <div className={styles.login_card__form__field_row}>
              <Checkbox name='remember' label='Remember me' />
            </div>
            <div className={styles.login_card__form__action_row}>
              <Button type='submit' disabled={isLoading}>
                {(isLoading && 'Please wait...') || 'Sign In'}
              </Button>
            </div>
          </form>
        </section>
        <section className={styles.login_card__footer}>
          <p className='text-center text-gray-700'>
            Need an account? <Link to={ROUTES.SIGN_UP}>SIGN UP</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
