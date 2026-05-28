import type { CertificateTemplate } from '../../types';
import { CertIcon } from '../ui/CertIcon';

interface TemplateThumbnailProps {
  template: CertificateTemplate;
}

export function TemplateThumbnail({ template }: TemplateThumbnailProps) {
  const logos = template.branding.logos || [];
  const assetCount =
    logos.length + (template.branding.qrCodeImage ? 1 : 0) + (template.branding.backgroundWatermark ? 1 : 0);

  return (
    <div className="cert-template-thumb">
      {template.backgroundImage && (
        <img src={template.backgroundImage} alt="" className="cert-template-thumb__bg" />
      )}

      {template.layout === 'bordered' && <div className="cert-template-thumb__border-accent" aria-hidden />}

      {template.layout === 'colourful' && (
        <>
          <div className="cert-template-thumb__gradient-top" aria-hidden />
          <div className="cert-template-thumb__gradient-bottom" aria-hidden />
        </>
      )}

      <div className="cert-template-thumb__body">
        <div className="cert-template-thumb__logos">
          {logos.slice(0, 3).map((url, i) => (
            <div key={i} className="cert-template-thumb__logo-slot">
              <img src={url} alt="" className="cert-template-thumb__logo-img" />
            </div>
          ))}
          {logos.length === 0 && (
            <>
              <div className="cert-template-thumb__logo-slot" aria-hidden />
              <div style={{ flex: 1 }} />
              <div className="cert-template-thumb__logo-slot" aria-hidden />
            </>
          )}
        </div>

        <div className="cert-template-thumb__center">
          {template.programTagline && <p className="cert-template-thumb__tagline">{template.programTagline}</p>}
          <p className="cert-template-thumb__title">{template.title}</p>
          <div className="cert-template-thumb__rule" />
          <p className="cert-template-thumb__learner">Learner Name</p>
          <p className="cert-template-thumb__course">Course Name</p>
        </div>

        <div className="cert-template-thumb__sigs">
          {template.signatures.slice(0, 3).map((sig) => (
            <div key={sig.id} className="cert-template-thumb__sig">
              <div className="cert-template-thumb__sig-img-wrap">
                {sig.imageUrl && (sig.imageUrl.startsWith('blob:') || sig.imageUrl.startsWith('/')) ? (
                  <img src={sig.imageUrl} alt="" className="cert-template-thumb__sig-img" />
                ) : (
                  <div className="cert-template-thumb__sig-placeholder" />
                )}
              </div>
              <div className="cert-template-thumb__sig-line" />
              <p className="cert-template-thumb__sig-name">{sig.signatoryName}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cert-template-thumb__badge-size">{template.paperSize}</div>

      {assetCount > 0 && (
        <div className="cert-template-thumb__badge-assets">
          <CertIcon name="image" size="1.04rem" />
          <span>{assetCount}</span>
        </div>
      )}
    </div>
  );
}
