import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  TemplateLayout,
  PaperSize,
  SignatureBlock,
  BrandingAssets,
  BrandingPositions,
  BorderConfig,
  TemplateField,
} from '../../types';
import { CertificateBorder } from './BorderConfigurator';

interface CertificatePreviewPanelProps {
  title: string;
  titleStyle: { fontFamily: string; fontSize: number; color: string };
  layout: TemplateLayout;
  paperSize: PaperSize;
  programTagline: string;
  disclaimer: string;
  backgroundImage: string;
  backgroundColor: string;
  borderConfig: BorderConfig;
  signatures: SignatureBlock[];
  branding: BrandingAssets;
  brandingPositions: BrandingPositions;
  fields: TemplateField[];
  onFieldPositionChange: (fieldId: string, position: { x: number; y: number }) => void;
  onSignaturePositionChange: (sigId: string, position: { x: number; y: number }) => void;
  onBrandingPositionChange: (key: string, position: { x: number; y: number }) => void;
}

// ============================================================
// Draggable Element
// ============================================================
interface DraggableProps {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  onDragEnd: (id: string, pos: { x: number; y: number }) => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  label?: string;
  isFullscreen?: boolean;
}

function Draggable({ id, x, y, onDragEnd, children, containerRef, label, isFullscreen }: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x, y });
  const startRef = useRef({ mouseX: 0, mouseY: 0, elemX: x, elemY: y });

  // Sync with prop changes
  useEffect(() => {
    if (!isDragging) {
      setDragPos({ x, y });
    }
  }, [x, y, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: dragPos.x,
      elemY: dragPos.y,
    };
  }, [dragPos]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaX = ((e.clientX - startRef.current.mouseX) / rect.width) * 100;
      const deltaY = ((e.clientY - startRef.current.mouseY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(95, startRef.current.elemX + deltaX));
      const newY = Math.max(0, Math.min(95, startRef.current.elemY + deltaY));

      setDragPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(id, dragPos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, onDragEnd, dragPos, containerRef]);

  return (
    <div
      className={`absolute cursor-move select-none group ${
        isDragging ? 'z-50 opacity-90' : 'z-10 hover:z-40'
      }`}
      style={{
        left: `${dragPos.x}%`,
        top: `${dragPos.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Hover/drag outline */}
      <div
        className={`absolute -inset-1 rounded border transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50/30'
            : 'border-transparent group-hover:border-primary-300 group-hover:bg-primary-50/20'
        }`}
      />
      {/* Label tooltip */}
      {label && !isDragging && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block">
          <span
            className="bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{ fontSize: isFullscreen ? 11 : 7 }}
          >
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================
// Certificate Canvas (Draggable version)
// ============================================================
function DraggableCanvas({
  title,
  titleStyle,
  layout,
  programTagline,
  disclaimer,
  backgroundImage,
  backgroundColor,
  borderConfig,
  signatures,
  branding,
  brandingPositions,
  fields,
  onFieldPositionChange,
  onSignaturePositionChange,
  onBrandingPositionChange,
  isFullscreen = false,
}: CertificatePreviewPanelProps & { isFullscreen?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = isFullscreen ? 1 : 0.45;
  const px = (size: number) => `${size * scale}px`;

  const handleFieldDrag = useCallback((id: string, pos: { x: number; y: number }) => {
    onFieldPositionChange(id, pos);
  }, [onFieldPositionChange]);

  const handleSigDrag = useCallback((id: string, pos: { x: number; y: number }) => {
    onSignaturePositionChange(id, pos);
  }, [onSignaturePositionChange]);

  const handleBrandingDrag = useCallback((id: string, pos: { x: number; y: number }) => {
    onBrandingPositionChange(id, pos);
  }, [onBrandingPositionChange]);

  return (
    <div ref={containerRef} className="cert-canvas cert-canvas--fill" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.9 }}
        />
      )}

      {/* Border (from BorderConfig) */}
      {borderConfig && <CertificateBorder config={borderConfig} />}

      {/* Colourful layout accent */}
      {layout === 'colourful' && (
        <>
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 pointer-events-none" style={{ height: isFullscreen ? 8 : 3 }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 pointer-events-none" style={{ height: isFullscreen ? 8 : 3 }} />
        </>
      )}

      {/* === DRAGGABLE ELEMENTS === */}

      {/* Logos (up to 3, draggable) */}
      {(branding.logos || []).map((logoUrl, index) => {
        const logosPositions = brandingPositions?.logos || [];
        const pos = logosPositions[index] || { x: 10 + index * 40, y: 8 };
        return (
          <Draggable
            key={`logo-${index}`}
            id={`logo-${index}`}
            x={pos.x}
            y={pos.y}
            onDragEnd={handleBrandingDrag}
            containerRef={containerRef}
            label={`Logo ${index + 1}`}
            isFullscreen={isFullscreen}
          >
            <div style={{ width: isFullscreen ? 72 : 28, height: isFullscreen ? 72 : 28 }}>
              <img src={logoUrl} alt={`Logo ${index + 1}`} className="w-full h-full object-contain" />
            </div>
          </Draggable>
        );
      })}

      {/* QR Code (draggable) */}
      {branding.qrCodeImage ? (
        <Draggable
          id="qrCode"
          x={brandingPositions?.qrCode?.x ?? 90}
          y={brandingPositions?.qrCode?.y ?? 90}
          onDragEnd={handleBrandingDrag}
          containerRef={containerRef}
          label="QR Code"
          isFullscreen={isFullscreen}
        >
          <div
            className="border border-gray-300 rounded overflow-hidden bg-white"
            style={{ width: isFullscreen ? 56 : 22, height: isFullscreen ? 56 : 22 }}
          >
            <img src={branding.qrCodeImage} alt="QR Code" className="w-full h-full object-contain" />
          </div>
        </Draggable>
      ) : (
        <div
          className="absolute bg-gray-100 border border-gray-300 rounded flex items-center justify-center pointer-events-none"
          style={{
            left: `${brandingPositions?.qrCode?.x ?? 90}%`,
            top: `${brandingPositions?.qrCode?.y ?? 90}%`,
            transform: 'translate(-50%, -50%)',
            width: isFullscreen ? 48 : 18,
            height: isFullscreen ? 48 : 18,
          }}
        >
          <span className="text-gray-400" style={{ fontSize: px(8) }}>QR</span>
        </div>
      )}

      {/* Text Fields (all draggable) */}
      {fields.map((field) => (
        <Draggable
          key={field.id}
          id={field.id}
          x={field.position.x}
          y={field.position.y}
          onDragEnd={handleFieldDrag}
          containerRef={containerRef}
          label={field.name}
          isFullscreen={isFullscreen}
        >
          <p
            className="whitespace-nowrap"
            style={{
              fontSize: px(field.style?.fontSize || 12),
              fontFamily: field.style?.fontFamily || 'sans-serif',
              color: field.style?.color || '#333',
              fontWeight: field.name === 'Learner Name' || field.name.includes('Title') ? 'bold' : 'normal',
              fontStyle: field.isDynamic ? 'italic' : 'normal',
            }}
          >
            {field.isDynamic ? `{{${field.name}}}` : (field.value || field.name)}
          </p>
        </Draggable>
      ))}

      {/* Program Tagline (draggable as a pseudo-field) */}
      {programTagline && !fields.some(f => f.name === 'Program Tagline') && (
        <Draggable
          id="__tagline__"
          x={50}
          y={8}
          onDragEnd={() => {}}
          containerRef={containerRef}
          label="Program Tagline"
          isFullscreen={isFullscreen}
        >
          <p className="uppercase tracking-wider text-gray-500" style={{ fontSize: px(11) }}>
            {programTagline}
          </p>
        </Draggable>
      )}

      {/* Certificate Title (draggable) */}
      <Draggable
        id="__title__"
        x={50}
        y={25}
        onDragEnd={() => {}}
        containerRef={containerRef}
        label="Certificate Title"
        isFullscreen={isFullscreen}
      >
        <p style={{
          fontSize: px(titleStyle?.fontSize || 22),
          fontFamily: titleStyle?.fontFamily || 'Poppins, sans-serif',
          color: titleStyle?.color || '#1D4ED8',
          fontWeight: 'bold',
        }}>
          {title}
        </p>
      </Draggable>

      {/* Signatures (each draggable) */}
      {signatures.map((sig, index) => (
        <Draggable
          key={sig.id}
          id={sig.id}
          x={sig.position?.x ?? (20 + index * 30)}
          y={sig.position?.y ?? 85}
          onDragEnd={handleSigDrag}
          containerRef={containerRef}
          label={`Sig: ${sig.signatoryName}`}
          isFullscreen={isFullscreen}
        >
          <div className="flex flex-col items-center">
            {/* Signature image */}
            <div
              className="overflow-hidden"
              style={{
                width: isFullscreen ? 120 : 44,
                height: isFullscreen ? 50 : 20,
              }}
            >
              {sig.imageUrl && (sig.imageUrl.startsWith('blob:') || sig.imageUrl.startsWith('/')) ? (
                <img
                  src={sig.imageUrl}
                  alt={sig.signatoryName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded" />
              )}
            </div>
            {/* Line */}
            <div className="bg-gray-400" style={{ width: isFullscreen ? 70 : 28, height: 1, margin: '2px 0' }} />
            <p className="font-medium text-gray-700 whitespace-nowrap" style={{ fontSize: px(9) }}>
              {sig.signatoryName}
            </p>
            <p className="text-gray-500 whitespace-nowrap" style={{ fontSize: px(7) }}>
              {sig.designation}
            </p>
          </div>
        </Draggable>
      ))}

      {/* Disclaimer */}
      {disclaimer && (
        <Draggable
          id="__disclaimer__"
          x={50}
          y={95}
          onDragEnd={() => {}}
          containerRef={containerRef}
          label="Disclaimer"
          isFullscreen={isFullscreen}
        >
          <p className="text-gray-400 text-center" style={{ fontSize: px(8), maxWidth: isFullscreen ? 400 : 160 }}>
            {disclaimer}
          </p>
        </Draggable>
      )}
    </div>
  );
}

// ============================================================
// Exported Panel Component
// ============================================================
export function CertificatePreviewPanel(props: CertificatePreviewPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  return (
    <>
      {/* Sidebar Preview */}
      <div className="card sticky top-24">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
          <button
            onClick={() => setIsFullscreen(true)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            title="Open fullscreen preview"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Fullscreen
          </button>
        </div>
        <div className="cert-preview-stage border border-gray-300" style={{ minHeight: 280 }}>
          <DraggableCanvas {...props} isFullscreen={false} />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {props.paperSize} • Landscape • {props.layout} • Drag elements to reposition
        </p>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            title="Close fullscreen preview (Esc)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Info bar */}
          <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-800">Certificate Preview — Drag to Reposition</p>
            <p className="text-xs text-gray-500">{props.paperSize} • Landscape • {props.layout}</p>
          </div>

          {/* Certificate at full size */}
          <div className="cert-preview-stage cert-preview-stage--modal bg-white shadow-xl" style={{ maxWidth: 1000 }}>
            <DraggableCanvas {...props} isFullscreen={true} />
          </div>

          {/* Keyboard hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            Drag elements to reposition • Press Escape to close
          </p>
        </div>
      )}
    </>
  );
}
