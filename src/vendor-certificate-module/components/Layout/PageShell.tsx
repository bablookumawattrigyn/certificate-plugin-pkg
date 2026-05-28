import { Outlet } from 'react-router-dom';
import { useRouteDataLoader } from '../../hooks/useRouteDataLoader';

/** Content shell — host apps supply outer chrome; data loads per route. */
export function PageShell() {
  useRouteDataLoader();

  return (
    <main className="cert-page-shell">
      <div className="cert-page-shell__inner container-fluid px-3 px-md-4 px-lg-5">
        <Outlet />
      </div>
    </main>
  );
}
