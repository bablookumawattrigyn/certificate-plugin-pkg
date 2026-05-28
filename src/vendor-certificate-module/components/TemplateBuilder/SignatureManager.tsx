import { useState, useRef } from 'react';
import type { SignatureBlock, SignaturePlacement } from '../../types';
import { validateImageFile, uploadImageWithFallback } from '../../utils/mediaUpload';

interface SignatureManagerProps {
  signatures: SignatureBlock[];
  setSignatures: (sigs: SignatureBlock[]) => void;
  templateId?: string;
}

const placementOptions: { value: SignaturePlacement; label: string }[] = [
  { value: 'left-aligned', label: 'Left Aligned' },
  { value: 'right-aligned', label: 'Right Aligned' },
  { value: 'centered', label: 'Centered' },
  { value: 'horizontal-row', label: 'Horizontal Row' },
  { value: 'stacked-vertical', label: 'Stacked Vertical' },
];

function getPositionForPlacement(
  placement: SignaturePlacement,
  index: number,
  total: number,
): { x: number; y: number } {
  const baseY = 85;
  switch (placement) {
    case 'left-aligned':
      return { x: 20, y: baseY };
    case 'right-aligned':
      return { x: 80, y: baseY };
    case 'centered':
      return { x: 50, y: baseY };
    case 'horizontal-row': {
      const spacing = 80 / (total + 1);
      return { x: 10 + spacing * (index + 1), y: baseY };
    }
    case 'stacked-vertical':
      return { x: 50, y: 70 + index * 10 };
    default:
      return { x: 20 + index * 30, y: baseY };
  }
}

async function uploadSignatureImage(file: File, templateId: string | undefined, assetKey: string) {
  const validationError = validateImageFile(file);
  if (validationError) {
    alert(validationError);
    return null;
  }
  return uploadImageWithFallback(file, templateId, 'signature', assetKey);
}

export function SignatureManager({ signatures, setSignatures, templateId }: SignatureManagerProps) {
  const [newName, setNewName] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newPlacement, setNewPlacement] = useState<SignaturePlacement>('centered');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingSigId, setReplacingSigId] = useState<string | null>(null);

  const canAdd = signatures.length < 4;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadSignatureImage(file, templateId, `signature-${Date.now()}`);
    if (!url) return;

    setNewImageUrl(url);
    setNewImageName(file.name);
  };

  const handleReplaceFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingSigId) return;

    const url = await uploadSignatureImage(file, templateId, `signature-${replacingSigId}`);
    if (!url) return;

    setSignatures(signatures.map((s) => (s.id === replacingSigId ? { ...s, imageUrl: url } : s)));
    setReplacingSigId(null);
  };

  const addSignature = () => {
    if (!newName.trim() || !newDesignation.trim()) {
      alert('Signatory Name and Designation are mandatory.');
      return;
    }
    if (!canAdd) {
      alert('Maximum 4 signatures allowed per certificate.');
      return;
    }
    if (!newImageUrl) {
      alert('Please upload a signature image (transparent PNG).');
      return;
    }

    const newIndex = signatures.length;
    const totalAfterAdd = signatures.length + 1;

    const sig: SignatureBlock = {
      id: `sig-${Date.now()}`,
      signatoryName: newName.trim(),
      designation: newDesignation.trim(),
      imageUrl: newImageUrl,
      placement: newPlacement,
      position: getPositionForPlacement(newPlacement, newIndex, totalAfterAdd),
    };

    let updatedSignatures = [...signatures];
    if (newPlacement === 'horizontal-row' || newPlacement === 'stacked-vertical') {
      updatedSignatures = signatures.map((s, i) => ({
        ...s,
        position: getPositionForPlacement(newPlacement, i, totalAfterAdd),
      }));
    }

    setSignatures([...updatedSignatures, sig]);
    setNewName('');
    setNewDesignation('');
    setNewPlacement('centered');
    setNewImageUrl('');
    setNewImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSignature = (sigId: string) => {
    if (signatures.length <= 1) {
      alert('Minimum 1 signature is required.');
      return;
    }
    setSignatures(signatures.filter((s) => s.id !== sigId));
  };

  const updatePlacement = (sigId: string, placement: SignaturePlacement) => {
    const sigIndex = signatures.findIndex((s) => s.id === sigId);
    const newPosition = getPositionForPlacement(placement, sigIndex, signatures.length);

    if (placement === 'horizontal-row' || placement === 'stacked-vertical') {
      setSignatures(
        signatures.map((s, i) => ({
          ...s,
          placement,
          position: getPositionForPlacement(placement, i, signatures.length),
        })),
      );
    } else {
      setSignatures(signatures.map((s) => (s.id === sigId ? { ...s, placement, position: newPosition } : s)));
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/png"
        onChange={handleReplaceFileSelect}
        className="hidden"
      />

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Signature Configuration</h3>
        <p className="text-xs text-gray-400">
          Minimum 1 and maximum 4 signatures per certificate. Signatures must be uploaded as transparent PNG images.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">{signatures.length}/4 signatures added</span>
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(signatures.length / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      {signatures.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Signatures</h3>
          <div className="space-y-3">
            {signatures.map((sig, index) => (
              <div key={sig.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div
                  className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden cursor-pointer border border-gray-300"
                  onClick={() => {
                    setReplacingSigId(sig.id);
                    replaceFileInputRef.current?.click();
                  }}
                  title="Click to replace image"
                >
                  {sig.imageUrl ? (
                    <img src={sig.imageUrl} alt="Signature" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-gray-400">PNG</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {index + 1}. {sig.signatoryName}
                  </p>
                  <p className="text-xs text-gray-500">{sig.designation}</p>
                </div>
                <select
                  value={sig.placement}
                  onChange={(e) => updatePlacement(sig.id, e.target.value as SignaturePlacement)}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  {placementOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => removeSignature(sig.id)} className="text-xs text-danger-500 hover:text-danger-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {canAdd && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Signature</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Signatory Name *</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Dr. Rajesh Kumar" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Designation / Role *</label>
              <input type="text" value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} placeholder="e.g., State Project Director" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Placement</label>
              <select value={newPlacement} onChange={(e) => setNewPlacement(e.target.value as SignaturePlacement)} className="input-field">
                {placementOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Signature Image (Transparent PNG) *</label>
              {newImageUrl ? (
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img src={newImageUrl} alt="Signature preview" className="w-20 h-12 object-contain bg-gray-50 rounded border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 font-medium truncate">{newImageName}</p>
                      <p className="text-xs text-success-700">Image selected</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewImageUrl('');
                        setNewImageName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs text-danger-500 hover:text-danger-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer"
                >
                  <p className="text-sm text-gray-500">Click to browse and upload PNG</p>
                  <p className="text-xs text-gray-400 mt-1">Transparent background required</p>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/png" onChange={handleFileSelect} className="hidden" />
            </div>
            <button type="button" onClick={addSignature} className="btn-primary w-full">
              Add Signature
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
