// ============================================================
// Certificate Module - Type Definitions
// Based on FRS: Certificates Module – Standalone Service
// ============================================================

// Template statuses
export type TemplateStatus = 'draft' | 'published' | 'archived';

// Certificate statuses
export type CertificateStatus = 'valid' | 'expired' | 'revoked';

// Pre-built template layouts
export type TemplateLayout = 'minimal' | 'bordered' | 'official' | 'colourful';

// Paper sizes
export type PaperSize = 'A5' | 'A4' | 'A3';

// Alignment options
export type Alignment = 'left' | 'center' | 'right';

// Signature placement
export type SignaturePlacement = 'left-aligned' | 'right-aligned' | 'centered' | 'horizontal-row' | 'stacked-vertical';

// ============================================================
// Signature Block
// ============================================================
export interface SignatureBlock {
  id: string;
  signatoryName: string;
  designation: string;
  imageUrl: string; // transparent PNG
  placement: SignaturePlacement;
  position?: { x: number; y: number }; // percentage-based position for drag
}

// ============================================================
// Branding Assets
// ============================================================
export interface BrandingAssets {
  logos: string[]; // Up to 3 logos
  qrCodeImage?: string;
  backgroundWatermark?: string;
}

// Positions for branding elements (percentage-based)
export interface BrandingPositions {
  logos: { x: number; y: number }[]; // Position for each logo
  qrCode: { x: number; y: number };
}

// ============================================================
// Template Field (dynamic or static)
// ============================================================
export interface TemplateField {
  id: string;
  name: string;
  type: 'data-field' | 'text' | 'image' | 'component';
  value?: string;
  isDynamic: boolean;
  isRequired: boolean;
  isConfigurable: boolean;
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    alignment?: Alignment;
  };
}

// ============================================================
// Border Configuration
// ============================================================
export type BorderStyle = 'none' | 'solid' | 'double' | 'dashed' | 'dotted' | 'groove' | 'ridge' | 'inset' | 'outset'
  | 'ornamental-classic' | 'ornamental-floral' | 'ornamental-greek' | 'ornamental-celtic'
  | 'ornamental-art-deco' | 'ornamental-royal' | 'ornamental-simple-elegant' | 'ornamental-wave';

export interface BorderConfig {
  style: BorderStyle;
  width: number; // px
  color: string;
  radius: number; // px
  inset: number; // % from edge
  opacity: number; // 0-1
}

// ============================================================
// Certificate Template
// ============================================================
export interface CertificateTemplate {
  templateId: string;
  name: string;
  creatorId: string;
  version: number;
  status: TemplateStatus;
  layout: TemplateLayout;
  paperSize: PaperSize;
  orientation: 'landscape';
  title: string;
  titleStyle?: { fontFamily: string; fontSize: number; color: string };
  fields: TemplateField[];
  signatures: SignatureBlock[];
  branding: BrandingAssets;
  brandingPositions?: BrandingPositions;
  backgroundImage?: string;
  backgroundColor?: string;
  borderConfig?: BorderConfig;
  programTagline?: string;
  customTextBlock?: string;
  disclaimer?: string;
  additionalNotes?: string;
  localisation?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Issuance Conditions
// ============================================================
export interface IssuanceConditions {
  moduleCompletion: boolean; // 100% module completion
  minimumScore?: number;
  mandatoryQuizzes: boolean;
  attendanceRequired: boolean;
  creatorApproval: boolean;
}

// ============================================================
// Issued Certificate
// ============================================================
export interface IssuedCertificate {
  certificateId: string; // UUID
  templateId: string;
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseName: string;
  tenantName: string;
  issueDate: string;
  certificateUrl: string;
  previewUrl: string;
  qrCodeData: string;
  verificationUrl: string;
  status: CertificateStatus;
  issuingAuthority: string;
  optionalFields?: {
    schoolName?: string;
    district?: string;
    block?: string;
    classGrade?: string;
    instructorName?: string;
    courseDuration?: string;
    completionPercentage?: number;
    gradeScore?: string;
    learningOutcomes?: string;
  };
}

// ============================================================
// User / Persona
// ============================================================
export type UserRole = 'course_creator' | 'learner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
}
