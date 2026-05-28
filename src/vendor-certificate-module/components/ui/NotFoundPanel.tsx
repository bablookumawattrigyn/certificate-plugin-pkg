import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCertPath } from '../../hooks/useCertPath';

interface NotFoundPanelProps {
  message: string;
  backLabel?: string;
  backTo?: string;
  action?: ReactNode;
}

export function NotFoundPanel({
  message,
  backLabel = 'Back to Templates',
  backTo,
  action,
}: NotFoundPanelProps) {
  const certPath = useCertPath();

  return (
    <div className="card text-center py-5 border-0 shadow-sm">
      <p className="text-muted fs-5 mb-4">{message}</p>
      {action ?? (
        <Link to={backTo ?? certPath('templates')} className="btn btn-primary">
          {backLabel}
        </Link>
      )}
    </div>
  );
}
