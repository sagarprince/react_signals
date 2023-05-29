import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler, useFormContext, FormProvider, FieldErrors, FieldValues } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { VALIDATION_ERRORS, VALIDATION_RULES, ROUTES, MONTHS } from '../../../constants';
import { Campaign } from '../../../models/Campaign';
import { useCampaigns } from '../../../shared/hooks/useCampaigns';
import { useCampaign } from '../../../shared/hooks/useCampaign';
import { useContacts } from '../../../shared/hooks/useContacts';
import useApp from '../../../shared/hooks/useApp';
import useDocumentTitle from '../../../shared/hooks/useDocumentTitle';
import { Button, Input, Select, IRadioOption, Radio } from '../../../shared/components/Form';

import { TemplateField } from '../../../models/Template';

import styles from './AddEditCampaignPage.module.scss';

interface IAddEditCampaignPageProps {
  mode: string;
}

export default function AddEditCampaignPage({ mode }: IAddEditCampaignPageProps) {
  useDocumentTitle(mode === 'ADD' ? 'Add Campaign' : 'Edit Campaign');
  const { id } = useParams();

  const form = useForm<Campaign>();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError: setValidationError,
    formState: { errors },
  } = form;

  const formValues = getValues();

  const { userId, saveCampaign, error, isLoading } = useCampaigns();
  const { campaign, error: hasCampaignError, isLoading: isCampaignLoading } = useCampaign(id as any);

  const { allContacts } = useContacts();
  const { templates } = useApp();

  const [contactsOptions, setContactsOptions] = useState<any>([]);
  const [templatesOptions, setTemplatesOptions] = useState<any>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  const [selectedTemplateId, setSelectedTemplateId] = useState<any>(-1);
  const [selectedTemplateFields, setSelectedTemplateFields] = useState<TemplateField[]>([]);

  useEffect(() => {
    setContactsOptions(
      allContacts.map((contact) => {
        return {
          value: contact.id as any,
          label: `${contact.firstName} ${contact.lastName}`,
        };
      })
    );
  }, [allContacts]);

  useEffect(() => {
    setTemplatesOptions(
      templates.map((template) => {
        return {
          value: template.id,
          label: template.name,
        };
      })
    );
  }, [templates]);

  useEffect(() => {
    register('name', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.name,
        message: VALIDATION_ERRORS.campaignName,
      },
    });
    register('subject', {
      required: true,
      pattern: {
        value: VALIDATION_RULES.name,
        message: VALIDATION_ERRORS.subjectName,
      },
    });
    register('templateId', {
      required: true,
    });
    register('contacts', {
      required: true,
    });
  }, [register]);

  useEffect(() => {
    // Set Form with Campaign in Edit Mode
    if (campaign) {
      if (campaign.template) {
        setSelectedTemplate(campaign.templateId);
      }
      Object.entries(campaign).forEach(([key, value]: any) => {
        setValue(key, value);
        trigger(key);
      });
    }
  }, [campaign, setValue]);

  useEffect(() => {
    selectedTemplate && setSelectedTemplateFields(templates.find((template) => template.id == selectedTemplate)?.fields || []);
  }, [selectedTemplate]);

  const setInputValue = useCallback(
    (e: any) => {
      let value = e.target.value;
      if (e.target.name === 'contacts') {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) {
            selectedValues.push(options[i].value);
          }
        }
        value = [...selectedValues];
      } else if (e.target.name === 'templateId') {
        setSelectedTemplate(value);
        setSelectedTemplateId(value);
      }
      setValue(e.target.name, value);
      trigger(e.target.name);
    },
    [trigger]
  );

  const onSubmit: SubmitHandler<Campaign> = useCallback(
    (payload: any) => {
      if (mode === 'ADD') {
        payload.userId = userId;
      }
      const campaign = new Campaign(payload);
      mode === 'ADD' && delete campaign.id;
      console.log(campaign);
      saveCampaign && saveCampaign(campaign, mode);
    },
    [mode, userId, saveCampaign]
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <section className={styles.card__header}>
          <h2>{mode === 'ADD' ? 'Add Campaign' : 'Edit Campaign'}</h2>
        </section>
        <section className={styles.card__content}>
          <FormProvider {...form}>
            <form method='post' className={styles.card__form} onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
              <div className={styles.card__form__field_row}>
                <Input
                  type='text'
                  label='Campaign Name'
                  hasError={errors?.name ? true : false}
                  errorType={errors?.name?.type}
                  errorMessage={errors?.name?.message}
                  name='name'
                  defaultValue={formValues.name}
                  onChange={setInputValue}
                  required
                  autoComplete='off'
                />
              </div>
              <div className={styles.card__form__field_row}>
                <Input
                  type='text'
                  label='Subject'
                  hasError={errors?.subject ? true : false}
                  errorType={errors?.subject?.type}
                  errorMessage={errors?.subject?.message}
                  name='subject'
                  defaultValue={formValues.subject}
                  onChange={setInputValue}
                  required
                  autoComplete='off'
                />
              </div>
              <div className={styles.card__form__field_row}>
                <Radio
                  label='Select Template'
                  name='templateId'
                  options={templatesOptions}
                  value={formValues.templateId}
                  required
                  hasError={errors?.templateId ? true : false}
                  errorType={errors?.templateId?.type}
                  errorMessage={errors?.templateId?.message}
                  className={styles.card__form__field_row__templates}
                  onChange={setInputValue}
                />
              </div>
              <TemplateFieldsForm fields={selectedTemplateFields} selectedTemplateId={selectedTemplateId} setInputValue={setInputValue} />
              <div className={styles.card__form__field_row}>
                <Select
                  label='Select Contacts'
                  options={contactsOptions}
                  hasError={errors?.contacts ? true : false}
                  errorType={errors?.contacts?.type}
                  errorMessage={errors?.contacts?.message}
                  name='contacts'
                  defaultValues={formValues.contacts}
                  onChange={setInputValue}
                  required
                  multiple
                />
              </div>
              <div className={styles.card__form__action_row}>
                <Button type='submit' disabled={isLoading}>
                  {(isLoading && 'Please wait...') || (mode === 'ADD' ? 'SAVE' : 'UPDATE')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </section>
      </div>
    </div>
  );
}

interface ITemplateFieldsFormProp {
  fields: TemplateField[];
  selectedTemplateId: number;
  setInputValue: (e: any) => void;
}

function TemplateFieldsForm({ fields, selectedTemplateId, setInputValue }: ITemplateFieldsFormProp) {
  const {
    register,
    unregister,
    getValues,
    formState: { dirtyFields, errors },
  } = useFormContext();

  const formValues = getValues();

  const [formFields, setFormFields] = useState<Array<any>>([]);

  useEffect(() => {
    selectedTemplateId > -1 && unregister('template');
  }, [selectedTemplateId]);

  useEffect(() => {
    if (fields.length > 0) {
      const formFields = fields.map((field) => {
        const options = field.type === 'select' && field.id === 'month' ? MONTHS : [];
        return {
          ...field,
          options,
        };
      });
      formFields.forEach((field) => {
        register(`template.${field.id}`, {
          required: true,
          value: (field.type === 'select' && field.options.length > 0 && field.options[0].value) || '',
        });
      });
      setFormFields(formFields);
    }
  }, [fields]);

  return (
    <>
      {fields.length > 0 && (
        <div className={styles.card__form__field_group}>
          {formFields.map((field) => {
            const templateFormValues = formValues['template'];
            const fieldValue = templateFormValues && templateFormValues[field.id];

            const errorTemplate: any = errors?.template;
            const errorTemplateField: any = (errorTemplate && errorTemplate[field.id]) || null;
            const hasError = errorTemplateField ? true : false;
            const errorType = (errorTemplateField && errorTemplateField.type) || '';
            const errorMessage = (errorTemplateField && errorTemplateField.message) || '';

            if (field.type === 'select') {
              return (
                <div className={styles.card__form__field_row} key={field.id}>
                  <Select
                    label={field.label}
                    options={field.options}
                    name={`template.${field.id}`}
                    defaultValues={fieldValue}
                    hasError={hasError}
                    errorType={errorType}
                    errorMessage={errorMessage}
                    onChange={setInputValue}
                    required
                  />
                </div>
              );
            } else {
              const name = `template.${field.id}`;
              return (
                <div className={styles.card__form__field_row} key={field.id}>
                  <Input
                    type={field.type}
                    label={field.label}
                    name={name}
                    defaultValue={fieldValue}
                    hasError={hasError}
                    errorType={errorType}
                    errorMessage={errorMessage}
                    onChange={setInputValue}
                    required
                    autoComplete='off'
                  />
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
