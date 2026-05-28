import { useRef } from 'react';
import type { BrandingAssets } from '../../types';
import { validateImageFile, uploadImageWithFallback } from '../../utils/mediaUpload';

interface BrandingUploaderProps {
  branding: BrandingAssets;
  setBranding: (b: BrandingAssets) => void;
  templateId?: string;
}

export function BrandingUploader({ branding, setBranding, templateId }: BrandingUploaderProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logos = branding.logos || [];
  const canAddLogo = logos.length < 3;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    const url = await uploadImageWithFallback(file, templateId, 'logo', `logo-${logos.length}`);
    setBranding({ ...branding, logos: [...logos, url] });
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleRemoveLogo = (index: number) => {
    setBranding({ ...branding, logos: logos.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-700">Logos</h3>
          <span className="text-xs text-gray-500">{logos.length}/3 uploaded</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Upload up to 3 logos (State, Program, Institution). Drag them on the preview to position.
        </p>

        {logos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {logos.map((url, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-2 relative group">
                <img src={url} alt={`Logo ${index + 1}`} className="w-full h-16 object-contain" />
                <button
                  type="button"
                  onClick={() => handleRemoveLogo(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-danger-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove logo"
                >
                  ×
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-1">Logo {index + 1}</p>
              </div>
            ))}
          </div>
        )}

        {canAddLogo && (
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer"
          >
            <p className="text-sm text-gray-500">Click to upload logo</p>
            <p className="text-xs text-gray-400 mt-1">PNG or JPEG • Max 5 MB</p>
          </button>
        )}

        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Asset Guidelines</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Logos should have transparent backgrounds (PNG preferred)</li>
          <li>• Maximum file size: 5 MB per asset</li>
          <li>• Recommended logo dimensions: 200×200px minimum</li>
          <li>• Drag uploaded assets on the preview to position them</li>
        </ul>
      </div>
    </div>
  );
}
