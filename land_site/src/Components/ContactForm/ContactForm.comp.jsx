import { useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useI18n } from '../../i18n/LanguageProvider';
import './ContactForm.comp.css';

const ContactForm = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const config = useMemo(() => {
    return {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    };
  }, []);

  const isConfigured = Boolean(config.serviceId && config.templateId && config.publicKey);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfigured) {
      setStatus({
        state: 'error',
        message: t('contact.form.notConfigured')
      });
      return;
    }

    setStatus({ state: 'sending', message: '' });

    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message
        },
        {
          publicKey: config.publicKey
        }
      );

      setStatus({ state: 'success', message: t('contact.form.success') });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', message: t('contact.form.error') });
    }
  };

  return (
    <div className="contact-form-card">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label" htmlFor="name">{t('contact.form.name')}</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            autoComplete="name"
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="email">{t('contact.form.email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            autoComplete="email"
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="message">{t('contact.form.message')}</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </div>

        {status.state !== 'idle' && (
          <div className={`form-status ${status.state}`}>{status.message}</div>
        )}

        <button className="btn primary" type="submit" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
        </button>

        {!isConfigured && (
          <div className="form-hint">
            {t('contact.form.hint')} <code>.env</code>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
