import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { CertificateRouteProvider } from '../routes/CertificateRouteContext';
import { certificateStore } from '../store';
import { AppProvider, useAppContext } from '../vendor-certificate-module/context/AppContext';

function DataLoader({ load }) {
  const { loadTemplates, loadCertificates } = useAppContext();

  useEffect(() => {
    if (load === 'templates') void loadTemplates();
    if (load === 'certificates') void loadCertificates();
  }, [load, loadTemplates, loadCertificates]);

  return null;
}

/**
 * Shared Redux + API context for exported widgets (styles loaded once from package entry).
 * @param {string} [routeBase] Host mount path, e.g. `/my-workspace/certificates`
 */
export function CertificateShell({ load, routeBase = '', children }) {
  return (
    <div className="cert-plugin-root">
      <Provider store={certificateStore}>
        <AppProvider>
          <CertificateRouteProvider routeBase={routeBase}>
            {load ? <DataLoader load={load} /> : null}
            {children}
          </CertificateRouteProvider>
        </AppProvider>
      </Provider>
    </div>
  );
}
