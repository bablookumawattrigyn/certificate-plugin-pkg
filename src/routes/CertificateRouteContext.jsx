import { createContext, useContext, useMemo } from 'react';

const CertificateRouteContext = createContext({ routeBase: '' });

/** Prefix for certificate URLs when embedded in a host app (e.g. `/my-workspace/certificates`). */
export function CertificateRouteProvider({ routeBase = '', children }) {
  const value = useMemo(
    () => ({ routeBase: String(routeBase).replace(/\/$/, '') }),
    [routeBase],
  );

  return (
    <CertificateRouteContext.Provider value={value}>{children}</CertificateRouteContext.Provider>
  );
}

export function useCertificateRouteBase() {
  return useContext(CertificateRouteContext).routeBase;
}

/** Build a certificate-module path (`templates/new`, `certificates`, …). */
export function useCertPath() {
  const routeBase = useCertificateRouteBase();

  return useMemo(() => {
    return (segment) => {
      const path = String(segment).replace(/^\//, '');
      if (!routeBase) return `/${path}`;
      return `${routeBase}/${path}`;
    };
  }, [routeBase]);
}
