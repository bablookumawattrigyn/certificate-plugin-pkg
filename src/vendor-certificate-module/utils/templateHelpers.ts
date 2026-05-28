import type { CertificateTemplate } from '../types';

export function countTemplateAssets(template: CertificateTemplate): number {
  const logos = template.branding.logos?.length ?? 0;
  return logos + (template.branding.qrCodeImage ? 1 : 0);
}

export function filterTemplates(templates: CertificateTemplate[], query: string): CertificateTemplate[] {
  const q = query.trim().toLowerCase();
  if (!q) return templates;
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.templateId.toLowerCase().includes(q),
  );
}

export function newOfflineTemplateId(): string {
  return `tmpl-${Date.now()}`;
}
