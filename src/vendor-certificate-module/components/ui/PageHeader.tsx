import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, meta, actions }: PageHeaderProps) {
  return (
    <header className="cert-page-header">
      <div>
        {eyebrow && <p className="cert-page-header__eyebrow">{eyebrow}</p>}
        <h1 className="cert-page-header__title">{title}</h1>
        {subtitle && <p className="cert-page-header__subtitle">{subtitle}</p>}
        {meta}
      </div>
      {actions && <div className="cert-page-header__actions">{actions}</div>}
    </header>
  );
}
