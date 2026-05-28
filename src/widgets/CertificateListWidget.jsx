import { CertificateShell } from '../shell/CertificateShell';
import { LearnerCertificates } from '../vendor-certificate-module/pages/LearnerCertificates';

/** Drop-in issued certificates list. Self-contained data loading — no host CSS import. */
export function CertificateList() {
  return (
    <CertificateShell load="certificates">
      <LearnerCertificates />
    </CertificateShell>
  );
}
