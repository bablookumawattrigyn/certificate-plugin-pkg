import type { IssuedCertificate } from '../types';

/** Offline fallback data for the verification page when no backend is available. */
export const mockCertificates: IssuedCertificate[] = [
  {
    certificateId: 'cert-uuid-001',
    templateId: 'tmpl-001',
    learnerId: 'learner-101',
    learnerName: 'Amit Patel',
    courseId: 'course-nipun-01',
    courseName: 'NIPUN Bharat - Foundation Literacy',
    tenantName: 'NCERT',
    issueDate: '2025-04-15T00:00:00Z',
    certificateUrl: '/certificates/cert-uuid-001.pdf',
    previewUrl: '/certificates/cert-uuid-001-preview.png',
    qrCodeData: 'https://diksha.gov.in/verify/cert-uuid-001',
    verificationUrl: 'https://diksha.gov.in/verify/cert-uuid-001',
    status: 'valid',
    issuingAuthority: 'NCERT',
    optionalFields: {
      district: 'Ahmedabad',
      block: 'Daskroi',
      completionPercentage: 100,
      gradeScore: 'A+',
    },
  },
  {
    certificateId: 'cert-uuid-002',
    templateId: 'tmpl-001',
    learnerId: 'learner-102',
    learnerName: 'Sunita Devi',
    courseId: 'course-nipun-01',
    courseName: 'NIPUN Bharat - Foundation Literacy',
    tenantName: 'NCERT',
    issueDate: '2025-04-16T00:00:00Z',
    certificateUrl: '/certificates/cert-uuid-002.pdf',
    previewUrl: '/certificates/cert-uuid-002-preview.png',
    qrCodeData: 'https://diksha.gov.in/verify/cert-uuid-002',
    verificationUrl: 'https://diksha.gov.in/verify/cert-uuid-002',
    status: 'valid',
    issuingAuthority: 'NCERT',
    optionalFields: {
      district: 'Jaipur',
      block: 'Sanganer',
      completionPercentage: 100,
      gradeScore: 'A',
    },
  },
];
