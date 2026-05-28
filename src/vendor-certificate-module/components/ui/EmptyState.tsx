import type { ReactNode } from 'react';
import { Card } from 'react-bootstrap';
import { CertIcon } from './CertIcon';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="cert-empty-state text-center shadow-sm border-0">
      <Card.Body className="py-5 px-4">
        <CertIcon name={icon} className="text-primary d-block mx-auto mb-3" size="4rem" />
        <Card.Title as="p" className="fs-5 text-secondary mb-2">
          {title}
        </Card.Title>
        {description && <Card.Text className="text-muted mb-0">{description}</Card.Text>}
        {action && <div className="mt-4">{action}</div>}
      </Card.Body>
    </Card>
  );
}
