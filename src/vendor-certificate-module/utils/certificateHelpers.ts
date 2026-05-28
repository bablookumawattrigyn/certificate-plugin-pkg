import type { IssuedCertificate } from '../types';

export function filterCertificates(certs: IssuedCertificate[], query: string): IssuedCertificate[] {
  const q = query.trim().toLowerCase();
  if (!q) return certs;
  return certs.filter(
    (cert) =>
      cert.learnerName.toLowerCase().includes(q) ||
      cert.courseName.toLowerCase().includes(q) ||
      cert.certificateId.toLowerCase().includes(q),
  );
}
