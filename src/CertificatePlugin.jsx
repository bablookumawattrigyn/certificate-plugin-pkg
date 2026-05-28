import { BrowserRouter } from 'react-router-dom';
import { CertificateShell } from './shell/CertificateShell';
import { CertificateModuleRoutes } from './vendor-certificate-module/CertificateModuleRoutes';

/** Full standalone app: router + all certificate routes. */
export default function CertificatePlugin() {
  return (
    <CertificateShell>
      <BrowserRouter>
        <CertificateModuleRoutes />
      </BrowserRouter>
    </CertificateShell>
  );
}
