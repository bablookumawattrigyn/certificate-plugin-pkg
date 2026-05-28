import type { ComponentType, ReactNode } from 'react';

/** Template library widget (list + builder / preview / issuance). */
export const TemplateList: ComponentType;

/** Issued learner certificates list widget. */
export const CertificateList: ComponentType;

/** Redux + API wrapper; pass `routeBase` when embedding under a host path. */
export const CertificateShell: ComponentType<{
  children: ReactNode;
  routeBase?: string;
  load?: 'templates' | 'certificates';
}>;

/** Full standalone certificate module with router. */
declare const CertificatePlugin: ComponentType;
export default CertificatePlugin;

export const CertificateModuleRoutes: ComponentType<{ nested?: boolean }>;
export const AppProvider: ComponentType<{ children: ReactNode }>;
