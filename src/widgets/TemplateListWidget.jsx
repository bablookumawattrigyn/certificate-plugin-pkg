import { MemoryRouter, useInRouterContext } from 'react-router-dom';
import { CertificateShell } from '../shell/CertificateShell';
import { CertificateModuleRoutes } from '../vendor-certificate-module/CertificateModuleRoutes';

/**
 * Use the host app's router when already inside one; otherwise provide MemoryRouter
 * so widgets work in apps without react-router (e.g. simple tab demos).
 */
export function RouterBridge({ children, initialEntries = ['/'] }) {
  if (useInRouterContext()) {
    return children;
  }
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
}

function TemplateRoutes() {
  const inHostRouter = useInRouterContext();

  if (inHostRouter) {
    return <CertificateModuleRoutes nested />;
  }

  return <CertificateModuleRoutes />;
}

/**
 * Drop-in template library. Uses host router when present; otherwise self-contained MemoryRouter.
 * @param {{ routeBase?: string }} props Host mount path when embedded (e.g. `/my-workspace/certificates`)
 */
export function TemplateList({ routeBase = '' }) {
  const initialEntry = routeBase ? `${routeBase.replace(/\/$/, '')}/templates` : '/templates';

  return (
    <CertificateShell load="templates" routeBase={routeBase}>
      <RouterBridge initialEntries={[initialEntry]}>
        <TemplateRoutes />
      </RouterBridge>
    </CertificateShell>
  );
}
