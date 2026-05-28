import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTemplateState } from '../hooks/useTemplate';
import { useCertPath } from '../hooks/useCertPath';
import { NotFoundPanel } from '../components/ui/NotFoundPanel';
import { EmptyState } from '../components/ui/EmptyState';
import { runAction } from '../utils/errors';
import { countTemplateAssets } from '../utils/templateHelpers';
import { downloadElementAsPdf } from '../utils/downloadPdf';
import { CertificateBorder } from '../components/TemplateBuilder/BorderConfigurator';
import type { CertificateTemplate } from '../types';

/**
 * Renders the certificate using absolute positioning based on saved field/signature/branding positions.
 * This matches exactly what the user configured via drag-and-drop in the builder.
 */
function PositionedCertificateRender({ template }: { template: CertificateTemplate }) {
  const logos = template.branding.logos || [];
  const logoPositions = template.brandingPositions?.logos || [];
  const qrPosition = template.brandingPositions?.qrCode || { x: 90, y: 90 };

  return (
    <div className="cert-canvas cert-canvas--fill" style={{ backgroundColor: template.backgroundColor || '#ffffff' }}>
      {/* Background image */}
      {template.backgroundImage && (
        <img
          src={template.backgroundImage}
          alt="Background"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
      )}

      {/* Background watermark */}
      {template.branding.backgroundWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.08 }}>
          <img
            src={template.branding.backgroundWatermark}
            alt="Watermark"
            crossOrigin="anonymous"
            className="w-1/3 h-1/3 object-contain"
          />
        </div>
      )}

      {/* Border */}
      {template.borderConfig && <CertificateBorder config={template.borderConfig} />}

      {/* Colourful layout accent */}
      {template.layout === 'colourful' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
        </>
      )}

      {/* === LOGOS (absolute positioned) === */}
      {logos.map((url, index) => {
        const pos = logoPositions[index] || { x: 10 + index * 40, y: 8 };
        return (
          <div
            key={`logo-${index}`}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '8%',
              height: '12%',
            }}
          >
            <img
              src={url}
              alt={`Logo ${index + 1}`}
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
            />
          </div>
        );
      })}

      {/* === TEXT FIELDS (absolute positioned) === */}
      {template.fields.map((field) => (
        <div
          key={field.id}
          className="absolute"
          style={{
            left: `${field.position.x}%`,
            top: `${field.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p
            className="whitespace-nowrap"
            style={{
              fontSize: `${(field.style?.fontSize || 12) * 0.8}px`,
              fontFamily: field.style?.fontFamily || 'sans-serif',
              color: field.style?.color || '#333',
              fontWeight: field.name === 'Learner Name' ? 'bold' : 'normal',
              fontStyle: field.isDynamic ? 'italic' : 'normal',
            }}
          >
            {field.isDynamic ? `{{${field.name}}}` : (field.value || field.name)}
          </p>
        </div>
      ))}

      {/* === TITLE (use field position if exists, otherwise center) === */}
      {!template.fields.some(f => f.name === 'Certificate Title') && (
        <div
          className="absolute"
          style={{ left: '50%', top: '28%', transform: 'translate(-50%, -50%)' }}
        >
          <p className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            {template.title}
          </p>
        </div>
      )}

      {/* === "This is to certify that" / "has successfully completed" static text === */}
      <div
        className="absolute"
        style={{ left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}
      >
        <p className="text-sm text-gray-500">This is to certify that</p>
      </div>
      <div
        className="absolute"
        style={{ left: '50%', top: '48%', transform: 'translate(-50%, -50%)' }}
      >
        <p className="text-sm text-gray-500">has successfully completed</p>
      </div>

      {/* === SIGNATURES (absolute positioned) === */}
      {template.signatures.map((sig, index) => {
        const pos = sig.position || { x: 20 + index * 30, y: 85 };
        return (
          <div
            key={sig.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Signature image */}
            <div style={{ width: '120px', height: '50px' }} className="overflow-hidden mb-1">
              {sig.imageUrl ? (
                <img
                  src={sig.imageUrl}
                  alt={sig.signatoryName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded" />
              )}
            </div>
            <div className="w-24 h-px bg-gray-400 mb-1" />
            <p className="text-sm font-medium text-gray-700 whitespace-nowrap">{sig.signatoryName}</p>
            <p className="text-xs text-gray-500 whitespace-nowrap">{sig.designation}</p>
          </div>
        );
      })}

      {/* === QR CODE (absolute positioned) === */}
      <div
        className="absolute"
        style={{
          left: `${qrPosition.x}%`,
          top: `${qrPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '7%',
          height: '11%',
        }}
      >
        {template.branding.qrCodeImage ? (
          <img
            src={template.branding.qrCodeImage}
            alt="QR Code"
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-[8px] text-gray-400">QR</span>
          </div>
        )}
      </div>

      {/* === DISCLAIMER === */}
      {template.disclaimer && (
        <div
          className="absolute"
          style={{ left: '50%', top: '96%', transform: 'translate(-50%, -50%)' }}
        >
          <p className="text-[9px] text-gray-400 text-center whitespace-nowrap">{template.disclaimer}</p>
        </div>
      )}

      {/* === PROGRAM TAGLINE === */}
      {template.programTagline && (
        <div
          className="absolute"
          style={{ left: '50%', top: '6%', transform: 'translate(-50%, -50%)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-widest">{template.programTagline}</p>
        </div>
      )}
    </div>
  );
}

export function TemplatePreview() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const certPath = useCertPath();
  const { actions } = useAppContext();
  const { template, pending, missing } = useTemplateState(templateId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  if (pending) {
    return <EmptyState icon="hourglass_top" title="Loading template…" />;
  }

  if (missing || !template) {
    return <NotFoundPanel message="Template not found." />;
  }

  const handlePublish = () => {
    if (!window.confirm('Publish this template? Published templates cannot be edited directly.')) return;
    void runAction(async () => {
      await actions.publishTemplate(template.templateId);
      navigate(certPath('templates'));
    }, 'Publish failed');
  };

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setDownloading(true);
    try {
      const filename = `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_v${template.version}.pdf`;
      await downloadElementAsPdf(pdfRef.current, filename, template.paperSize);
    } catch (err) {
      alert(`Download failed: ${(err as Error).message}`);
    } finally {
      setDownloading(false);
    }
  };

  const logoCount = countTemplateAssets(template);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
          <p className="text-sm text-gray-500 mt-1">{template.name} — Version {template.version}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(certPath('templates'))} className="btn-secondary">
            Back
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-secondary flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="btn-secondary flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Fullscreen
          </button>
          {template.status === 'draft' && (
            <>
              <Link to={certPath(`templates/${template.templateId}/edit`)} className="btn-secondary">
                Edit
              </Link>
              <button onClick={handlePublish} className="btn-primary">
                Publish Template
              </button>
            </>
          )}
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="card">
        <div ref={pdfRef} className="cert-preview-stage">
          <PositionedCertificateRender template={template} />
        </div>
      </div>

      {/* Template Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="card">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Layout</h4>
          <p className="text-sm font-medium capitalize">{template.layout}</p>
          <p className="text-xs text-gray-400">{template.paperSize} • Landscape</p>
        </div>
        <div className="card">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Fields</h4>
          <p className="text-sm font-medium">{template.fields.length} fields</p>
          <p className="text-xs text-gray-400">
            {template.fields.filter((f) => f.isRequired).length} mandatory,{' '}
            {template.fields.filter((f) => !f.isRequired).length} optional
          </p>
        </div>
        <div className="card">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Signatures</h4>
          <p className="text-sm font-medium">{template.signatures.length} signature(s)</p>
          <p className="text-xs text-gray-400">
            {template.signatures.map((s) => s.designation).join(', ')}
          </p>
        </div>
        <div className="card">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Logos & Assets</h4>
          <p className="text-sm font-medium">{logoCount} asset(s)</p>
          <p className="text-xs text-gray-400">
            {(template.branding.logos || []).length} logo(s)
            {template.branding.qrCodeImage ? ' • QR ✓' : ''}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-800">{template.name}</p>
            <p className="text-xs text-gray-500">Version {template.version} • {template.paperSize} • Landscape</p>
          </div>
          <div className="cert-preview-stage cert-preview-stage--modal bg-white shadow-xl">
            <PositionedCertificateRender template={template} />
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            Press Escape to close
          </p>
        </div>
      )}
    </div>
  );
}
