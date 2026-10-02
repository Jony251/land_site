import { useState } from 'react';
import { MASCOT_IMAGE, OWNER_PHOTO } from '../../config/owner';
import './OwnerPhoto.comp.css';

/**
 * Round owner portrait with a mascot fallback.
 *
 * Input:
 * - `alt` (string): description of the owner photo.
 * - `className` (string, optional): extra classes.
 * - `loading` ('lazy' | 'eager', optional, default 'lazy'): native loading hint, kept after the fallback.
 *
 * Output:
 * - `<img>` showing `OWNER_PHOTO`, or `MASCOT_IMAGE` if the photo fails to load.
 */
const OwnerPhoto = ({ alt, className = '', loading = 'lazy' }) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={`owner-photo ${className}`.trim()}
      src={failed ? MASCOT_IMAGE : OWNER_PHOTO}
      alt={failed ? 'Blue Cat' : alt}
      onError={() => setFailed(true)}
      loading={loading}
    />
  );
};

export default OwnerPhoto;
