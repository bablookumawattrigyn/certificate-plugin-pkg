import { useRef } from 'react';
import type { BorderConfig, PaperSize } from '../../types';
import { validateImageFile, uploadImageWithFallback } from '../../utils/mediaUpload';
import { BorderConfigurator } from './BorderConfigurator';

interface DesignSettingsProps {
  paperSize: PaperSize;
  setPaperSize: (v: PaperSize) => void;
  programTagline: string;
  setProgramTagline: (v: string) => void;
  disclaimer: string;
  setDisclaimer: (v: string) => void;
  backgroundImage: string;
  setBackgroundImage: (v: string) => void;
  backgroundColor: string;
  setBackgroundColor: (v: string) => void;
  borderConfig: BorderConfig;
  setBorderConfig: (v: BorderConfig) => void;
  templateId?: string;
}

const paperSizes: PaperSize[] = ['A4', 'A3', 'A5'];

export function DesignSettings({
  paperSize,
  setPaperSize,
  programTagline,
  setProgramTagline,
  disclaimer,
  setDisclaimer,
  backgroundImage,
  setBackgroundImage,
  backgroundColor,
  setBackgroundColor,
  borderConfig,
  setBorderConfig,
  templateId,
}: DesignSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    const url = await uploadImageWithFallback(file, templateId, 'background', 'background');
    setBackgroundImage(url);
  };

  const handleRemoveBackground = () => {
    setBackgroundImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="cert-design-settings">
      <div className="card">
        <h3 className="cert-design-settings__card-title">Paper Size</h3>
        <div className="cert-design-settings__row">
          {paperSizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setPaperSize(size)}
              className={`cert-design-settings__pill-btn${paperSize === size ? ' cert-design-settings__pill-btn--active' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="cert-design-settings__hint">Orientation: Landscape. The downloaded PDF will match this size.</p>
      </div>

      <div className="card">
        <h3 className="cert-design-settings__card-title">Background Image</h3>
        <p className="cert-design-settings__help">
          Upload a background image for the certificate template. This will appear behind all content. Recommended:
          high-resolution (≥300 DPI), landscape orientation.
        </p>

        {backgroundImage ? (
          <div className="d-flex flex-column gap-3">
            <div className="cert-design-settings__preview-wrap">
              <img src={backgroundImage} alt="Certificate background" className="cert-design-settings__preview-img" />
              <div className="cert-design-settings__preview-overlay" aria-hidden />
            </div>
            <div className="cert-design-settings__row">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary">
                Replace Image
              </button>
              <button type="button" onClick={handleRemoveBackground} className="btn-danger">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cert-design-settings__dropzone"
          >
            <div className="cert-design-settings__dropzone-icon" aria-hidden>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '4rem' }}>
                add_photo_alternate
              </span>
            </div>
            <p className="fw-semibold text-secondary mb-1">Click to upload background image</p>
            <p className="small text-muted mb-0">PNG, JPEG · Max 5 MB · Landscape recommended</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleBackgroundUpload}
          className="cert-design-settings__visually-hidden"
          tabIndex={-1}
        />
      </div>

      <div className="card">
        <h3 className="cert-design-settings__card-title">Background Color</h3>
        <p className="cert-design-settings__help">
          Set a background color for the certificate. This is used when no background image is uploaded.
        </p>
        <div className="cert-design-settings__row">
          <input
            type="color"
            value={backgroundColor || '#ffffff'}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="cert-border-config__color-input"
            style={{ width: '3rem', height: '2.5rem' }}
          />
          <input
            type="text"
            value={backgroundColor || '#ffffff'}
            onChange={(e) => setBackgroundColor(e.target.value)}
            placeholder="#ffffff"
            className="input-field cert-border-config__mono"
            style={{ maxWidth: '9rem' }}
          />
          <div
            className="cert-design-settings__color-swatch"
            style={{ backgroundColor: backgroundColor || '#ffffff' }}
            aria-hidden
          />
          {backgroundColor && backgroundColor !== '#ffffff' && (
            <button type="button" onClick={() => setBackgroundColor('#ffffff')} className="btn btn-link btn-sm text-muted p-0">
              Reset
            </button>
          )}
        </div>
        <div className="cert-design-settings__row mt-3">
          {['#ffffff', '#fffbeb', '#f0fdf4', '#eff6ff', '#fef2f2', '#faf5ff', '#fefce8', '#f5f5f4'].map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={`cert-design-settings__preset-dot${backgroundColor === color ? ' cert-design-settings__preset-dot--active' : ''}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <BorderConfigurator borderConfig={borderConfig} setBorderConfig={setBorderConfig} />

      <div className="card">
        <h3 className="cert-design-settings__card-title">Program Tagline (Optional)</h3>
        <input
          type="text"
          value={programTagline}
          onChange={(e) => setProgramTagline(e.target.value)}
          placeholder="e.g., NIPUN Bharat / SCERT / NCERT"
          className="input-field"
        />
      </div>

      <div className="card">
        <h3 className="cert-design-settings__card-title">Disclaimer (Optional)</h3>
        <textarea
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
          placeholder="Legal or instructional line..."
          rows={3}
          className="input-field"
          style={{ resize: 'none' }}
        />
      </div>
    </div>
  );
}
