import { useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { VALIDATION_ERRORS, VALIDATION_RULES, ROUTES } from '../../../constants';
import { Contact } from '../../../models/Contact';
import { useContacts } from '../../../shared/hooks/useContacts';
import { useContact } from '../../../shared/hooks/useContact';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import { Button, Input, IRadioOption, Radio } from '../../../shared/components/Form';

import styles from './AddEditContactPage.module.scss';

interface IAddEditContactPageProps {
  mode: string;
}

export default function AddEditContactPage({ mode }: IAddEditContactPageProps) {
  useDocumentTitle(mode === 'ADD' ? 'Add Contact' : 'Edit Contact');
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    reset,
    setError: setValidationError,
    formState: { errors },
  } = useForm<Contact>();

  const formValues = getValues();

  const { userId, saveContact, error, isLoading } = useContacts();
  const { contact, error: hasContactError, isLoading: isContactLoading } = useContact(id as any);

  const onSubmit: SubmitHandler<Contact> = (payload: any) => {
    if (mode === 'ADD') {
      payload.userId = userId;
      payload.createdAt = new Date().getTime();
    }
    const contact = new Contact(payload, true);
    mode === 'ADD' && delete contact.id;
    console.log(contact);
    saveContact && saveContact(contact, mode);
  };

  const options: IRadioOption[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

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
    register('gender', {
      required: true,
    });
    register('address', {
      required: true,
    });
    register('city', {
      required: true,
    });
    register('phone', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.phone,
        message: VALIDATION_ERRORS.phone,
      },
    });
  }, [register]);

  useEffect(() => {
    if (error && error.message && error.message.indexOf('already') > -1) {
      setValidationError('email', {});
    }
  }, [error]);

  useEffect(() => {
    // Set Form with Contact in Edit Mode
    contact &&
      Object.entries(contact).forEach(([key, value]: any) => {
        setValue(key, value);
        trigger(key);
      });
  }, [contact, setValue]);

  const setInputValue = useCallback(
    (e: any) => {
      setValue(e.target.name, e.target.value);
      trigger(e.target.name);
    },
    [trigger]
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <section className={styles.card__header}>
          <h2>{mode === 'ADD' ? 'Add Contact' : 'Edit Contact'}</h2>
        </section>
        <section className={styles.card__content}>
          <form method='post' className={styles.card__form} onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <div className={styles.card__form__field_row}>
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
            <div className={styles.card__form__field_row}>
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
            <div className={styles.card__form__field_row}>
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
            <div className={styles.card__form__field_row}>
              <Radio
                label='Gender'
                name='gender'
                options={options}
                value={formValues.gender || ''}
                required
                hasError={errors?.gender ? true : false}
                errorType={errors?.gender?.type}
                errorMessage={errors?.gender?.message}
                onChange={setInputValue}
              />
            </div>
            <div className={styles.card__form__field_row}>
              <Input
                type='text'
                label='Address'
                hasError={errors?.address ? true : false}
                errorType={errors?.address?.type}
                errorMessage={errors?.address?.message}
                name='address'
                defaultValue={formValues.address}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.card__form__field_row}>
              <Input
                type='text'
                label='City'
                hasError={errors?.city ? true : false}
                errorType={errors?.city?.type}
                errorMessage={errors?.city?.message}
                name='city'
                defaultValue={formValues.city}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.card__form__field_row}>
              <Input
                type='number'
                label='Phone'
                hasError={errors?.phone ? true : false}
                errorType={errors?.phone?.type}
                errorMessage={errors?.phone?.message}
                name='phone'
                defaultValue={formValues.phone}
                onChange={setInputValue}
                required
                autoComplete='off'
              />
            </div>
            <div className={styles.card__form__action_row}>
              <Button type='submit' disabled={isLoading}>
                {(isLoading && 'Please wait...') || (mode === 'ADD' ? 'SAVE' : 'UPDATE')}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
