import { Routes, Route, Navigate } from 'react-router-dom';
import { PageShell } from './components/Layout/PageShell';
import { TemplateList } from './pages/TemplateList';
import { TemplateBuilder } from './pages/TemplateBuilder';
import { TemplatePreview } from './pages/TemplatePreview';
import { LearnerCertificates } from './pages/LearnerCertificates';
import { VerificationPage } from './pages/VerificationPage';
import { IssuanceConfig } from './pages/IssuanceConfig';
import { useRouteDataLoader } from './hooks/useRouteDataLoader';
import { useCertPath } from './hooks/useCertPath';

function NestedCertificateRoutes() {
  useRouteDataLoader();

  return (
    <Routes>
      <Route index element={<Navigate to="templates" replace />} />
      <Route path="templates" element={<TemplateList />} />
      <Route path="templates/new" element={<TemplateBuilder />} />
      <Route path="templates/:templateId/edit" element={<TemplateBuilder />} />
      <Route path="templates/:templateId/preview" element={<TemplatePreview />} />
      <Route path="templates/:templateId/issuance" element={<IssuanceConfig />} />
      <Route path="certificates" element={<LearnerCertificates />} />
      <Route path="*" element={<Navigate to="templates" replace />} />
    </Routes>
  );
}

function StandaloneCertificateRoutes() {
  const certPath = useCertPath();

  return (
    <Routes>
      <Route path="/verify/:certificateId" element={<VerificationPage />} />
      <Route path="/" element={<PageShell />}>
        <Route index element={<Navigate to={certPath('templates')} replace />} />
        <Route path="templates" element={<TemplateList />} />
        <Route path="templates/new" element={<TemplateBuilder />} />
        <Route path="templates/:templateId/edit" element={<TemplateBuilder />} />
        <Route path="templates/:templateId/preview" element={<TemplatePreview />} />
        <Route path="templates/:templateId/issuance" element={<IssuanceConfig />} />
        <Route path="certificates" element={<LearnerCertificates />} />
      </Route>
    </Routes>
  );
}

interface CertificateModuleRoutesProps {
  /** When true, routes are relative for host splat mounts (`/my-workspace/certificates/*`). */
  nested?: boolean;
}

/** Router tree for embedding (no BrowserRouter / AppProvider — parent supplies those). */
export function CertificateModuleRoutes({ nested = false }: CertificateModuleRoutesProps) {
  if (nested) {
    return <NestedCertificateRoutes />;
  }

  return <StandaloneCertificateRoutes />;
}
