import { useParams, Link } from 'react-router-dom';
import { Alert, Card, Container, ListGroup } from 'react-bootstrap';
import { mockCertificates } from '../data/mockData';
import { useCertPath } from '../hooks/useCertPath';

export function VerificationPage() {
  const { certificateId } = useParams();
  const certPath = useCertPath();

  const certificate = mockCertificates.find((c) => c.certificateId === certificateId);

  if (!certificate) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4 px-3">
        <Card className="shadow cert-verify-card text-center border-0" style={{ maxWidth: '28rem', width: '100%' }}>
          <Card.Body className="p-4 p-md-5">
            <div className="cert-verify-card__icon cert-verify-card__icon--danger mx-auto mb-3">
              <span className="material-symbols-outlined" style={{ fontSize: '3.2rem' }}>
                cancel
              </span>
            </div>
            <Card.Title as="h1" className="fs-4 fw-bold mb-2">
              Certificate Not Found
            </Card.Title>
            <Card.Text className="text-muted small mb-3">
              The certificate ID{' '}
              <code className="user-select-all bg-light px-2 py-1 rounded small">{certificateId}</code> could not be
              verified.
            </Card.Text>
            <Card.Text className="text-muted small mb-0">Please check the QR code or certificate ID and try again.</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const statusVariant: Record<typeof certificate.status, 'success' | 'warning' | 'danger'> = {
    valid: 'success',
    expired: 'warning',
    revoked: 'danger',
  };

  const statusLabel: Record<typeof certificate.status, string> = {
    valid: 'Valid',
    expired: 'Expired',
    revoked: 'Revoked',
  };

  const v = statusVariant[certificate.status];

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4 px-3">
      <Card className="shadow cert-verify-card border-0" style={{ maxWidth: '36rem', width: '100%' }}>
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className={`cert-verify-card__icon cert-verify-card__icon--${v} mx-auto mb-3`}>
              <span className="material-symbols-outlined" style={{ fontSize: '3.2rem' }}>
                {v === 'success' ? 'verified' : v === 'warning' ? 'schedule' : 'gpp_bad'}
              </span>
            </div>
            <Card.Title as="h1" className="fs-4 fw-bold mb-1">
              Certificate Verification
            </Card.Title>
            <Card.Text className="text-muted small mb-0">Digital authenticity check</Card.Text>
          </div>

          <Alert variant={v} className="text-center fw-semibold fs-5 mb-4">
            Status: {statusLabel[certificate.status]}
          </Alert>

          <ListGroup variant="flush" className="mb-4 rounded border">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span className="text-muted small">Learner Name</span>
              <span className="fw-medium text-end ps-2">{certificate.learnerName}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span className="text-muted small">Course Name</span>
              <span className="fw-medium text-end ps-2">{certificate.courseName}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span className="text-muted small">Issue Date</span>
              <span className="fw-medium text-end ps-2">
                {new Date(certificate.issueDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span className="text-muted small">Issuing Authority</span>
              <span className="fw-medium text-end ps-2">{certificate.issuingAuthority}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
              <span className="text-muted small">Certificate ID</span>
              <span className="font-monospace small text-break text-end ps-2">{certificate.certificateId}</span>
            </ListGroup.Item>
          </ListGroup>

          <div className="text-center border-top pt-4">
            <p className="text-muted small mb-3">
              This certificate was digitally generated and verified by the DIKSHA Certificate Module.
            </p>
            <Link to={certPath('templates')} className="btn btn-link btn-sm p-0">
              <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.76rem' }}>
                arrow_back
              </span>
              Go to templates
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
