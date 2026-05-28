import { Form, InputGroup } from 'react-bootstrap';
import { CertIcon } from './CertIcon';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}

export function SearchField({ value, onChange, placeholder, ariaLabel, className }: SearchFieldProps) {
  return (
    <InputGroup className={`shadow-sm ${className ?? ''}`.trim()}>
      <InputGroup.Text className="bg-white border-end-0">
        <CertIcon name="search" className="text-muted" />
      </InputGroup.Text>
      <Form.Control
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-start-0"
      />
    </InputGroup>
  );
}
