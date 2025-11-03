import React, { useState } from 'react';
import './Info.comp.css';

const Info = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({ name: '', email: '', message: '' });
  };
  
  const services = [
  {
    title: "עמוד נחיתה (One‑page)",
    description: "דפי נחיתה ואתרי תדמית ממוקדי המרה."
  },
  {
    title: "איסוף לידים",
    description: "כלי חכם לאיסוף וניתוח נתונים שמניע את העסק שלך קדימה."
  },
  {
    title: "תמיכה וליווי מתמשך",
    description: "תחזוקה, ניטור ועדכונים שוטפים במתכונת ריטיינר."
  },
  {
    title: "עדכון ושדרוג אתרים קיימים",
    description: "תיקוני תוכן ועיצוב, הוספת סקשנים ושיפורי ביצועים."
  },
  {
    title: "אינטגרציות בקאנד ו‑API",
    description: "חיבורי תשלום, CRM/ERP ושירותי צד שלישי דרך API."
  }
];

  return (
    <section className="info-section rtl" dir="rtl">
      <div className="container">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <div className="contact-form-container">
          <h2>Get a Free Quote</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">How can we help you?</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Info;