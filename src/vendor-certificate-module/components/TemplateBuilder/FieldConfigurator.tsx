import { useState } from 'react';
import type { TemplateField } from '../../types';

interface FieldConfiguratorProps {
  fields: TemplateField[];
  setFields: (fields: TemplateField[]) => void;
  title: string;
  setTitle: (v: string) => void;
  titleStyle: { fontFamily: string; fontSize: number; color: string };
  setTitleStyle: (v: { fontFamily: string; fontSize: number; color: string }) => void;
}

const fontFamilies = [
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Garamond, serif', label: 'Garamond' },
];

const optionalFieldOptions = [
  { name: 'Instructor / Teacher Name', type: 'data-field' as const },
  { name: 'Completion Percentage', type: 'data-field' as const },
  { name: 'Grade / Score', type: 'data-field' as const },
  { name: 'Additional Notes', type: 'text' as const },
];

function FieldStyleControls({
  field,
  onUpdate,
}: {
  field: TemplateField;
  onUpdate: (key: string, value: string | number) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap mt-2">
      <select
        value={field.style?.fontFamily || 'Poppins, sans-serif'}
        onChange={(e) => onUpdate('fontFamily', e.target.value)}
        className="text-xs border border-gray-200 rounded px-2 py-1"
      >
        {fontFamilies.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={field.style?.fontSize || 12}
          onChange={(e) => onUpdate('fontSize', Number(e.target.value))}
          className="text-xs border border-gray-200 rounded px-2 py-1 w-14"
          min={8}
          max={72}
        />
        <span className="text-[10px] text-gray-400">px</span>
      </div>
      <input
        type="color"
        value={field.style?.color || '#444444'}
        onChange={(e) => onUpdate('color', e.target.value)}
        className="w-7 h-6 rounded border border-gray-200 cursor-pointer"
      />
    </div>
  );
}

export function FieldConfigurator({ fields, setFields, title, setTitle, titleStyle, setTitleStyle }: FieldConfiguratorProps) {
  const [showAddField, setShowAddField] = useState(false);

  // Filter out Certificate ID field
  const visibleFields = fields.filter((f) => f.name !== 'Certificate ID');
  const mandatoryFields = visibleFields.filter((f) => f.isRequired && !f.isConfigurable);
  const optionalFields = visibleFields.filter((f) => !f.isRequired || f.isConfigurable);

  const addField = (name: string, type: TemplateField['type']) => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      name,
      type,
      isDynamic: type === 'data-field',
      isRequired: false,
      isConfigurable: true,
      position: { x: 50, y: 60 + optionalFields.length * 5 },
      style: { fontSize: 14, fontFamily: 'Poppins, sans-serif', color: '#171717', alignment: 'center' },
    };
    // Add to fields but keep Certificate ID filtered out
    const cleanedFields = fields.filter((f) => f.name !== 'Certificate ID');
    setFields([...cleanedFields, newField]);
    setShowAddField(false);
  };

  const removeField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && !field.isConfigurable) {
      alert('Mandatory fields cannot be removed.');
      return;
    }
    setFields(fields.filter((f) => f.id !== fieldId));
  };

  const updateFieldStyle = (fieldId: string, key: string, value: string | number) => {
    setFields(
      fields.map((f) =>
        f.id === fieldId
          ? { ...f, style: { ...f.style, [key]: value } }
          : f
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Certificate Title */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Certificate Title</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Certificate of Completion"
          className="input-field"
        />
        <p className="text-xs text-gray-400 mt-1 mb-3">
          This appears as the main heading on the certificate.
        </p>
        <div className="flex gap-2 flex-wrap">
          <select
            value={titleStyle.fontFamily}
            onChange={(e) => setTitleStyle({ ...titleStyle, fontFamily: e.target.value })}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            {fontFamilies.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={titleStyle.fontSize}
              onChange={(e) => setTitleStyle({ ...titleStyle, fontSize: Number(e.target.value) })}
              className="text-xs border border-gray-200 rounded px-2 py-1 w-14"
              min={16}
              max={72}
            />
            <span className="text-[10px] text-gray-400">px</span>
          </div>
          <input
            type="color"
            value={titleStyle.color}
            onChange={(e) => setTitleStyle({ ...titleStyle, color: e.target.value })}
            className="w-7 h-6 rounded border border-gray-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Mandatory Fields */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Mandatory Fields</h3>
        <p className="text-xs text-gray-400 mb-4">
          These fields are auto-populated and cannot be removed. Customize their appearance below.
        </p>
        <div className="space-y-3">
          {mandatoryFields.map((field) => (
            <div
              key={field.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{field.name}</p>
                  <p className="text-xs text-gray-500">
                    {field.isDynamic ? 'Dynamic' : 'Static'} • Required
                  </p>
                </div>
              </div>
              <FieldStyleControls
                field={field}
                onUpdate={(key, value) => updateFieldStyle(field.id, key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional / Configurable Fields */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Optional Fields</h3>
            <p className="text-xs text-gray-400">Add or remove fields as needed.</p>
          </div>
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="btn-secondary text-xs"
          >
            + Add Field
          </button>
        </div>

        {/* Add Field Dropdown */}
        {showAddField && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-xs font-medium text-primary-700 mb-2">Select a field to add:</p>
            <div className="grid grid-cols-2 gap-2">
              {optionalFieldOptions
                .filter((opt) => !fields.some((f) => f.name === opt.name))
                .map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => addField(opt.name, opt.type)}
                    className="text-left text-xs px-3 py-2 bg-white rounded border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    {opt.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Existing Optional Fields */}
        <div className="space-y-3">
          {optionalFields.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No optional fields added yet.
            </p>
          ) : (
            optionalFields.map((field) => (
              <div
                key={field.id}
                className="p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">{field.name}</p>
                  <button
                    onClick={() => removeField(field.id)}
                    className="text-xs text-danger-500 hover:text-danger-700"
                  >
                    Remove
                  </button>
                </div>
                <FieldStyleControls
                  field={field}
                  onUpdate={(key, value) => updateFieldStyle(field.id, key, value)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
