type TemplateStatus = 'draft' | 'published' | 'archived';
type CertificateStatus = 'valid' | 'expired' | 'revoked';

const templateClasses: Record<TemplateStatus, string> = {
  draft: 'cert-badge--draft',
  published: 'cert-badge--published',
  archived: 'cert-badge--archived',
};

const certificateClasses: Record<CertificateStatus, string> = {
  valid: 'cert-badge--valid',
  expired: 'cert-badge--expired',
  revoked: 'cert-badge--revoked',
};

interface StatusBadgeProps {
  status: TemplateStatus | CertificateStatus;
  kind?: 'template' | 'certificate';
}

export function StatusBadge({ status, kind = 'template' }: StatusBadgeProps) {
  const className =
    kind === 'certificate'
      ? certificateClasses[status as CertificateStatus]
      : templateClasses[status as TemplateStatus];
  return <span className={className}>{status}</span>;
}
