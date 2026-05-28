import { useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';
import type { IssuedCertificate } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { CertIcon } from '../components/ui/CertIcon';
import { SearchField } from '../components/ui/SearchField';
import { StatusBadge } from '../components/ui/StatusBadge';
import { filterCertificates } from '../utils/certificateHelpers';

export function LearnerCertificates() {
  const { state } = useAppContext();
  const { certificates, certificatesLoading } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [shareModalCert, setShareModalCert] = useState<IssuedCertificate | null>(null);

  const filteredCerts = filterCertificates(certificates, searchQuery);

  const handleDownload = (cert: IssuedCertificate) => {
    alert(`Downloading certificate: ${cert.certificateId}\nURL: ${cert.certificateUrl}`);
  };

  return (
    <div className="cert-learner-certs">
      <PageHeader
        title="Issued Certificates"
        subtitle="View, download, and share your certificates."
        actions={
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search learner, course, or ID…"
            ariaLabel="Search certificates"
            className="cert-learner-certs__search"
          />
        }
      />

      {certificatesLoading && (
        <EmptyState icon="hourglass_top" title="Loading certificates…" description="Fetching issued credentials." />
      )}

      {!certificatesLoading && filteredCerts.length === 0 && (
        <EmptyState
          icon="workspace_premium"
          title="No certificates found"
          description="Certificates are issued automatically upon course completion."
        />
      )}

      {!certificatesLoading && filteredCerts.length > 0 && (
        <Stack gap={3}>
          {filteredCerts.map((cert) => (
            <Card key={cert.certificateId} className="shadow-sm border-0">
              <Card.Body>
                <Row className="g-4 align-items-start">
                  <Col xs="auto">
                    <div className="cert-thumb-placeholder d-flex flex-column align-items-center justify-content-center text-center p-2">
                      <CertIcon name="workspace_premium" className="text-primary mb-1" size="2.8rem" />
                      <span className="small fw-semibold text-primary text-uppercase" style={{ fontSize: '1.04rem' }}>
                        Certificate
                      </span>
                      <span className="text-muted" style={{ fontSize: '1.04rem' }}>
                        {cert.tenantName}
                      </span>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-wrap justify-content-between gap-2 align-items-start mb-2">
                      <div className="min-w-0">
                        <Card.Title as="h2" className="h5 mb-1 text-break">
                          {cert.courseName}
                        </Card.Title>
                        <Card.Subtitle className="text-muted small mb-0">{cert.learnerName}</Card.Subtitle>
                      </div>
                      <StatusBadge status={cert.status} kind="certificate" />
                    </div>

                    <Stack direction="horizontal" gap={3} className="flex-wrap small text-muted mb-2">
                      <span className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="calendar_today" size="1.6rem" />
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="account_balance" size="1.6rem" />
                        {cert.issuingAuthority}
                      </span>
                      <span className="d-inline-flex align-items-center gap-1 text-break">
                        <CertIcon name="fingerprint" size="1.6rem" />
                        {cert.certificateId}
                      </span>
                    </Stack>

                    {cert.optionalFields && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {cert.optionalFields.district && (
                          <Badge bg="light" text="dark" className="fw-normal border">
                            <CertIcon name="location_on" size="1.44rem" className="me-1" />
                            {cert.optionalFields.district}
                          </Badge>
                        )}
                        {cert.optionalFields.gradeScore && (
                          <Badge bg="light" text="dark" className="fw-normal border">
                            Grade: {cert.optionalFields.gradeScore}
                          </Badge>
                        )}
                        {cert.optionalFields.completionPercentage != null && (
                          <Badge bg="light" text="dark" className="fw-normal border">
                            {cert.optionalFields.completionPercentage}% Complete
                          </Badge>
                        )}
                      </div>
                    )}

                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Button variant="primary" size="sm" onClick={() => handleDownload(cert)} className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="download" size="1.76rem" />
                        Download PDF
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => setShareModalCert(cert)} className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="share" size="1.76rem" />
                        Share
                      </Button>
                      <Button variant="outline-secondary" size="sm" href={`/verify/${cert.certificateId}`} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="verified_user" size="1.76rem" />
                        Verify
                      </Button>
                    </Stack>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Stack>
      )}

      <Modal show={shareModalCert != null} onHide={() => setShareModalCert(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {shareModalCert && (
            <>
              <p className="text-muted small mb-3">
                Share your certificate for <strong>{shareModalCert.courseName}</strong>
              </p>
              <Stack gap={2}>
                <Button variant="outline-secondary" className="d-flex align-items-center justify-content-center gap-2">
                  <CertIcon name="share" />
                  Share on Social Media
                </Button>
                <Button variant="outline-secondary" className="d-flex align-items-center justify-content-center gap-2">
                  <CertIcon name="mail" />
                  Share via Email
                </Button>
                <div className="d-flex gap-2">
                  <Form.Control readOnly size="sm" value={shareModalCert.verificationUrl} className="font-monospace" />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(shareModalCert.verificationUrl);
                      alert('Link copied!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </Stack>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
