import type { CertificateTemplate, IssuedCertificate } from '../types';

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function mapTemplateFromDB(row: Record<string, unknown>): CertificateTemplate {
  return {
    templateId: String(row.template_id),
    name: String(row.name),
    creatorId: String(row.creator_id),
    version: Number(row.version),
    status: row.status as CertificateTemplate['status'],
    layout: row.layout as CertificateTemplate['layout'],
    paperSize: row.paper_size as CertificateTemplate['paperSize'],
    orientation: 'landscape',
    title: String(row.title),
    titleStyle: parseJson(row.title_style, undefined),
    fields: parseJson(row.fields, []),
    signatures: parseJson(row.signatures, []),
    branding: parseJson(row.branding, {}),
    brandingPositions: parseJson(row.branding_positions, undefined),
    backgroundImage: row.background_image_path ? String(row.background_image_path) : undefined,
    backgroundColor: row.background_color ? String(row.background_color) : '#ffffff',
    borderConfig: parseJson(row.border_config, undefined),
    programTagline: row.program_tagline ? String(row.program_tagline) : undefined,
    disclaimer: row.disclaimer ? String(row.disclaimer) : undefined,
    additionalNotes: row.additional_notes ? String(row.additional_notes) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function mapCertificateFromDB(row: Record<string, unknown>): IssuedCertificate {
  return {
    certificateId: String(row.certificate_id),
    templateId: String(row.template_id),
    learnerId: String(row.learner_id),
    learnerName: String(row.learner_name),
    courseId: String(row.course_id),
    courseName: String(row.course_name),
    tenantName: String(row.tenant_name),
    issueDate: String(row.issue_date),
    certificateUrl: String(row.certificate_url),
    previewUrl: String(row.preview_url),
    qrCodeData: String(row.qr_code_data),
    verificationUrl: String(row.verification_url),
    status: row.status as IssuedCertificate['status'],
    issuingAuthority: String(row.issuing_authority),
    optionalFields: parseJson(row.optional_fields, {}),
  };
}
