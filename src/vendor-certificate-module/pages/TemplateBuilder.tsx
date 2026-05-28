import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTemplateState } from '../hooks/useTemplate';
import { useCertPath } from '../hooks/useCertPath';
import { runAction } from '../utils/errors';
import { FieldConfigurator } from '../components/TemplateBuilder/FieldConfigurator';
import { SignatureManager } from '../components/TemplateBuilder/SignatureManager';
import { BrandingUploader } from '../components/TemplateBuilder/BrandingUploader';
import { DesignSettings } from '../components/TemplateBuilder/DesignSettings';
import { CertificatePreviewPanel } from '../components/TemplateBuilder/CertificatePreviewPanel';
import { normalizeBorderConfig } from '../components/TemplateBuilder/BorderConfigurator';
import type {
  TemplateField,
  SignatureBlock,
  BrandingAssets,
  BrandingPositions,
  TemplateLayout,
  PaperSize,
} from '../types';

type BuilderTab = 'design' | 'fields' | 'signatures' | 'branding';

const defaultFields: TemplateField[] = [
  {
    id: 'field-learner',
    name: 'Learner Name',
    type: 'data-field',
    isDynamic: true,
    isRequired: true,
    isConfigurable: false,
    position: { x: 50, y: 40 },
    style: { fontSize: 24, fontFamily: 'serif', color: '#1a1a1a', alignment: 'center' },
  },
  {
    id: 'field-course',
    name: 'Course Name',
    type: 'data-field',
    isDynamic: true,
    isRequired: true,
    isConfigurable: false,
    position: { x: 50, y: 50 },
    style: { fontSize: 18, fontFamily: 'serif', color: '#333333', alignment: 'center' },
  },
  {
    id: 'field-tenant',
    name: 'Tenant / State Name',
    type: 'data-field',
    isDynamic: true,
    isRequired: true,
    isConfigurable: false,
    position: { x: 50, y: 20 },
    style: { fontSize: 14, fontFamily: 'sans-serif', color: '#555555', alignment: 'center' },
  },
  {
    id: 'field-date',
    name: 'Issue Date',
    type: 'data-field',
    isDynamic: true,
    isRequired: true,
    isConfigurable: false,
    position: { x: 50, y: 70 },
    style: { fontSize: 12, fontFamily: 'sans-serif', color: '#555555', alignment: 'center' },
  },
];

export function TemplateBuilder() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const certPath = useCertPath();
  const { state, actions } = useAppContext();
  const { template: existingTemplate, pending: templatePending } = useTemplateState(templateId);
  const isEditing = Boolean(templateId);

  const [activeTab, setActiveTab] = useState<BuilderTab>('design');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Certificate of Completion');
  const [titleStyle, setTitleStyle] = useState({ fontFamily: 'Poppins, sans-serif', fontSize: 30, color: '#1D4ED8' });
  const [layout, setLayout] = useState<TemplateLayout>('official');
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [fields, setFields] = useState<TemplateField[]>(defaultFields);
  const [signatures, setSignatures] = useState<SignatureBlock[]>([]);
  const [branding, setBranding] = useState<BrandingAssets>({ logos: [] });
  const [programTagline, setProgramTagline] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderConfig, setBorderConfig] = useState<import('../types').BorderConfig>({
    style: 'none',
    width: 3,
    color: '#b8860b',
    radius: 0,
    inset: 2,
    opacity: 1,
  });
  const [brandingPositions, setBrandingPositions] = useState<BrandingPositions>({
    logos: [{ x: 10, y: 8 }, { x: 50, y: 8 }, { x: 90, y: 8 }],
    qrCode: { x: 90, y: 90 },
  });

  // Drag handlers
  const handleFieldPositionChange = useCallback((fieldId: string, position: { x: number; y: number }) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, position } : f))
    );
  }, []);

  const handleSignaturePositionChange = useCallback((sigId: string, position: { x: number; y: number }) => {
    setSignatures((prev) =>
      prev.map((s) => (s.id === sigId ? { ...s, position } : s))
    );
  }, []);

  const handleBrandingPositionChange = useCallback((key: keyof BrandingPositions | string, position: { x: number; y: number }) => {
    setBrandingPositions((prev) => {
      // Handle logo-0, logo-1, logo-2
      if (key.startsWith('logo-')) {
        const index = parseInt(key.split('-')[1], 10);
        const currentLogos = prev.logos || [];
        // Ensure array is long enough
        const updatedLogos = [...currentLogos];
        while (updatedLogos.length <= index) {
          updatedLogos.push({ x: 10 + updatedLogos.length * 40, y: 8 });
        }
        updatedLogos[index] = position;
        return { ...prev, logos: updatedLogos };
      }
      // Handle qrCode
      if (key === 'qrCode') {
        return { ...prev, qrCode: position };
      }
      return prev;
    });
  }, []);

  // Load existing template if editing
  useEffect(() => {
    if (!isEditing || !existingTemplate) return;

    const existing = existingTemplate;
    setName(existing.name);
    setTitle(existing.title);
    setTitleStyle(existing.titleStyle || { fontFamily: 'Poppins, sans-serif', fontSize: 30, color: '#1D4ED8' });
    setLayout(existing.layout);
    setPaperSize(existing.paperSize);
    setFields(existing.fields);
    setSignatures(existing.signatures);
    setBranding(existing.branding?.logos ? existing.branding : { logos: [], ...existing.branding });
    setProgramTagline(existing.programTagline || '');
    setDisclaimer(existing.disclaimer || '');
    setBackgroundImage(existing.backgroundImage || '');
    setBackgroundColor(existing.backgroundColor || '#ffffff');
    setBorderConfig(normalizeBorderConfig(existing.borderConfig));
    setBrandingPositions(
      existing.brandingPositions || {
        logos: [
          { x: 10, y: 8 },
          { x: 50, y: 8 },
          { x: 90, y: 8 },
        ],
        qrCode: { x: 90, y: 90 },
      },
    );
  }, [isEditing, existingTemplate]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a template name.');
      return;
    }
    if (signatures.length < 1) {
      alert('At least 1 signature is required.');
      return;
    }

    const templateData = {
      name,
      creator_id: state.user.id,
      layout,
      paper_size: paperSize,
      title,
      title_style: titleStyle,
      program_tagline: programTagline || null,
      disclaimer: disclaimer || null,
      background_image_path: backgroundImage || null,
      background_color: backgroundColor || '#ffffff',
      border_config: borderConfig,
      fields,
      signatures,
      branding,
      branding_positions: brandingPositions,
    };

    const ok = await runAction(async () => {
      if (isEditing && templateId) {
        await actions.updateTemplate(templateId, templateData);
      } else {
        await actions.createTemplate(templateData);
      }
      navigate(certPath('templates'));
    }, 'Save failed');

    if (!ok) return;
  };

  const tabs: { key: BuilderTab; label: string }[] = [
    { key: 'design', label: 'Design & Layout' },
    { key: 'fields', label: 'Fields' },
    { key: 'signatures', label: 'Signatures' },
    { key: 'branding', label: 'Branding' },
  ];

  if (isEditing && templatePending) {
    return (
      <div className="card text-center py-5 border-0 shadow-sm">
        <p className="text-muted mb-0">Loading template…</p>
      </div>
    );
  }

  return (
    <div>
      <header className="cert-page-header">
        <div>
          <h1 className="cert-page-header__title">{isEditing ? 'Edit Template' : 'Create New Template'}</h1>
          <p className="cert-page-header__subtitle">
            Design your certificate template with fields, signatures, and branding.
          </p>
        </div>
        <div className="cert-page-header__actions">
          <button type="button" onClick={() => navigate(certPath('templates'))} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary">
            Save as Draft
          </button>
        </div>
      </header>

      <div className="card mb-4">
        <label className="cert-label" htmlFor="cert-template-name">
          Template Name *
        </label>
        <input
          id="cert-template-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., NIPUN Bharat Completion Certificate"
          className="input-field"
        />
      </div>

      <div className="cert-tabs">
        <nav className="cert-tabs__nav" aria-label="Template builder sections">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`cert-tabs__btn${activeTab === tab.key ? ' cert-tabs__btn--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="cert-builder-grid">
        <div>
          {activeTab === 'design' && (
            <DesignSettings
              paperSize={paperSize}
              setPaperSize={setPaperSize}
              programTagline={programTagline}
              setProgramTagline={setProgramTagline}
              disclaimer={disclaimer}
              setDisclaimer={setDisclaimer}
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              borderConfig={borderConfig}
              setBorderConfig={setBorderConfig}
              templateId={templateId}
            />
          )}
          {activeTab === 'fields' && (
            <FieldConfigurator fields={fields} setFields={setFields} title={title} setTitle={setTitle} titleStyle={titleStyle} setTitleStyle={setTitleStyle} />
          )}
          {activeTab === 'signatures' && (
            <SignatureManager signatures={signatures} setSignatures={setSignatures} templateId={templateId} />
          )}
          {activeTab === 'branding' && (
            <BrandingUploader branding={branding} setBranding={setBranding} templateId={templateId} />
          )}
        </div>

        <div>
          <CertificatePreviewPanel
            title={title}
            titleStyle={titleStyle}
            layout={layout}
            paperSize={paperSize}
            programTagline={programTagline}
            disclaimer={disclaimer}
            backgroundImage={backgroundImage}
            backgroundColor={backgroundColor}
            borderConfig={borderConfig}
            signatures={signatures}
            branding={branding}
            brandingPositions={brandingPositions}
            fields={fields}
            onFieldPositionChange={handleFieldPositionChange}
            onSignaturePositionChange={handleSignaturePositionChange}
            onBrandingPositionChange={handleBrandingPositionChange}
          />
        </div>
      </div>
    </div>
  );
}
