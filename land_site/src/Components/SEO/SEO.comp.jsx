import { useEffect } from 'react';

const upsertMeta = (selector, attrs) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const SEO = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    }

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      });
      upsertMeta('meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: description,
      });
    }
  }, [description, title]);

  return null;
};

export default SEO;
