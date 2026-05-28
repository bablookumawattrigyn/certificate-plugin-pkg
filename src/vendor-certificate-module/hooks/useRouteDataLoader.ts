import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';



/** Issued-certificates list (not template builder / preview routes). */
function isIssuedCertificatesRoute(pathname: string): boolean {
  if (pathname.includes('/templates')) return false;
  if (/\/certificates\/certificates\/?$/.test(pathname)) return true;
  return pathname === '/certificates' || pathname === '/certificates/';
}

/** Fetch list data only for the active section (templates vs certificates). */
export function useRouteDataLoader() {
  const { pathname } = useLocation();
  const { loadTemplates, loadCertificates } = useAppContext();

  useEffect(() => {
    if (isIssuedCertificatesRoute(pathname)) {
      void loadCertificates();
      return;
    }

    void loadTemplates();
  }, [pathname, loadTemplates, loadCertificates]);
}

