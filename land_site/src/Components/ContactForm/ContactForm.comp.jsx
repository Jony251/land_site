import { useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useI18n } from '../../i18n/LanguageProvider';
import { useSiteCopy } from '../../i18n/siteCopy';
import './ContactForm.comp.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState = {
  name: '',
  email: '',
  budget: '',
  timeline: '',
  message: '',
};

const ContactForm = () => {
  const { t } = useI18n();
  const sc = useSiteCopy();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const config = useMemo(() => {
    return {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };
  }, []);

  const isConfigured = Boolean(config.serviceId && config.templateId && config.publicKey);

  const validateField = (field, value) => {
    if (field === 'name') {
      if (!value.trim()) return sc('form.nameRequired');
      if (value.trim().length < 2) return sc('form.nameMin');
      return '';
    }

    if (field === 'email') {
      if (!value.trim()) return sc('form.emailRequired');
      if (!EMAIL_REGEX.test(value.trim())) return sc('form.emailInvalid');
      return '';
    }

    if (field === 'budget') {
      if (!value.trim()) return sc('form.budgetRequired');
      return '';
    }

    if (field === 'timeline') {
      if (!value.trim()) return sc('form.timelineRequired');
      return '';
    }

    if (field === 'message') {
      if (!value.trim()) return sc('form.messageRequired');
      if (value.trim().length < 20) return sc('form.messageMin');
      return '';
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors = Object.keys(formData).reduce((acc, field) => {
      const value = formData[field];
      const message = validateField(field, value);
      if (message) acc[field] = message;
      return acc;
    }, {});

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextTouched = Object.keys(formData).reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(nextTouched);

    if (!validateForm()) {
      setStatus({ state: 'error', message: sc('form.fixErrors') });
      return;
    }

    if (!isConfigured) {
      setStatus({
        state: 'error',
        message: t('contact.form.notConfigured'),
      });
      return;
    }

    setStatus({ state: 'sending', message: '' });

    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          name: formData.name,
          email: formData.email,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          title: 'Blue Cat Contact Form',
          Email_JS_Blue_Cat_Proj: 'Blue Cat Website',
        },
        {
          publicKey: config.publicKey,
        }
      );

      setStatus({ state: 'success', message: t('contact.form.success') });
      setFormData(initialFormState);
      setErrors({});
      setTouched({});
    } catch {
      setStatus({ state: 'error', message: t('contact.form.error') });
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
    setStatus({ state: 'idle', message: '' });
  };

  return (
    <div className="contact-form-card">
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label className="form-label" htmlFor="name">{t('contact.form.name')}</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="form-input"
            autoComplete="name"
          />
          {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="email">{t('contact.form.email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="form-input"
            autoComplete="email"
          />
          {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label className="form-label" htmlFor="budget">{sc('form.budgetLabel')}</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              aria-invalid={Boolean(errors.budget)}
              aria-describedby={errors.budget ? 'budget-error' : undefined}
            >
              <option value="">{sc('form.budgetPlaceholder')}</option>
              <option value="under_1000">{sc('form.budget1')}</option>
              <option value="1000_3000">{sc('form.budget2')}</option>
              <option value="3000_7000">{sc('form.budget3')}</option>
              <option value="7000_plus">{sc('form.budget4')}</option>
            </select>
            {errors.budget && <p className="field-error" id="budget-error">{errors.budget}</p>}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="timeline">{sc('form.timelineLabel')}</label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              aria-invalid={Boolean(errors.timeline)}
              aria-describedby={errors.timeline ? 'timeline-error' : undefined}
            >
              <option value="">{sc('form.timelinePlaceholder')}</option>
              <option value="asap">{sc('form.timeline1')}</option>
              <option value="2_4_weeks">{sc('form.timeline2')}</option>
              <option value="1_2_months">{sc('form.timeline3')}</option>
              <option value="flexible">{sc('form.timeline4')}</option>
            </select>
            {errors.timeline && <p className="field-error" id="timeline-error">{errors.timeline}</p>}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="message">{t('contact.form.message')}</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className="form-textarea"
            style={{ resize: 'none' }}
          />
          {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
        </div>

        {status.state !== 'idle' && (
          <div className={`form-status ${status.state}`} role="status" aria-live="polite">
            {status.message}
          </div>
        )}

        <div className="form-buttons">
          <button className="btn primary" type="submit" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
          </button>
          <button className="btn secondary" type="button" onClick={handleReset}>
            {t('contact.form.reset')}
          </button>
        </div>

        {!isConfigured && (
          <div className="form-hint">
            {t('contact.form.hint')}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
