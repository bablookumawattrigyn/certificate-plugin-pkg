import { Link } from 'react-router-dom';
import { Button, Card, Placeholder } from 'react-bootstrap';
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCertificateDispatch, useCertificateSelector } from '../../store/hooks';
import { useCertPath } from '../hooks/useCertPath';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { CertIcon } from '../components/ui/CertIcon';
import { StatusBadge } from '../components/ui/StatusBadge';
import { TemplateThumbnail } from '../components/templates/TemplateThumbnail';
import { filterTemplates, countTemplateAssets } from '../utils/templateHelpers';
import { runAction } from '../utils/errors';

function TemplateListSkeleton() {
  return (
    <div className="cert-templates-skeleton">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="cert-templates-skeleton__card">
          <Placeholder animation="glow" className="cert-templates-skeleton__ph cert-templates-skeleton__ph-thumb" />
          <div className="cert-templates-skeleton__ph-body">
            <Placeholder as="div" animation="glow" className="cert-templates-skeleton__ph cert-templates-skeleton__ph-line" />
            <Placeholder as="div" animation="glow" className="cert-templates-skeleton__ph cert-templates-skeleton__ph-line cert-templates-skeleton__ph-line--medium" />
            <Placeholder as="div" animation="glow" className="cert-templates-skeleton__ph cert-templates-skeleton__ph-line cert-templates-skeleton__ph-line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplateList() {
  const certPath = useCertPath();
  const { state, actions } = useAppContext();
  const { templates, user, templatesLoading, backendConnected } = state;
  const search = useCertificateSelector((s) => s.certificateUi.templatesListSearch);
  const dispatch = useCertificateDispatch();

  const filteredTemplates = useMemo(() => filterTemplates(templates, search), [templates, search]);

  const stats = useMemo(() => {
    const published = templates.filter((t) => t.status === 'published').length;
    return { total: templates.length, published, drafts: templates.filter((t) => t.status === 'draft').length };
  }, [templates]);

  return (
    <div className="cert-templates">
      <PageHeader
        title="Certificate Templates 00877"
        subtitle="Create, manage, and publish certificate templates for your courses."
        meta={
          !backendConnected ? (
            <></>
          ) : undefined
        }
        actions={
          <>
            {user.role === 'course_creator' && (
              <Button as={Link} to={certPath('templates/new')} variant="primary" size="lg" className="d-inline-flex align-items-center gap-2">
                <CertIcon name="add" size="1.92rem" />
                Create Template
              </Button>
            )}
          </>
        }
      />

      {templatesLoading && <TemplateListSkeleton />}

      {!templatesLoading && filteredTemplates.length === 0 && (
        <EmptyState
          icon="inventory_2"
          title={templates.length === 0 ? 'No templates yet' : 'No matches found'}
          description={
            templates.length === 0
              ? 'Start with a blank canvas — add branding, fields, and signatures.'
              : 'Try another keyword or clear the search filter.'
          }
          action={
            templates.length === 0 && user.role === 'course_creator' ? (
              <Button as={Link} to={certPath('templates/new')} variant="primary" size="lg" className="d-inline-flex align-items-center gap-2">
                <CertIcon name="add" size="1.92rem" />
                Create your first template
              </Button>
            ) : undefined
          }
        />
      )}

      {!templatesLoading && filteredTemplates.length > 0 && (
        <div className="cert-templates__grid">
          {filteredTemplates.map((template) => {
            const logoCount = countTemplateAssets(template);

            return (
              <Card key={template.templateId} className="cert-template-card shadow-sm h-100 border-0">
                <Card.Body className="d-flex flex-column p-3 p-md-4">
                  <Link to={certPath(`templates/${template.templateId}/preview`)} className="cert-template-card__thumb-link">
                    <TemplateThumbnail template={template} />
                  </Link>

                  <div className="cert-template-card__row-title">
                    <h2 className="cert-template-card__name">{template.name}</h2>
                    <StatusBadge status={template.status} />
                  </div>
                  <p className="cert-template-card__meta">
                    Version {template.version} · <span className="text-capitalize">{template.layout}</span>
                  </p>

                  <div className="cert-template-card__counts">
                    <span className="cert-template-card__count">
                      <CertIcon name="draw" className="text-secondary" size="1.76rem" />
                      {template.signatures.length} signature{template.signatures.length !== 1 ? 's' : ''}
                    </span>
                    <span className="cert-template-card__count">
                      <CertIcon name="imagesmode" className="text-secondary" size="1.76rem" />
                      {logoCount} asset{logoCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="cert-template-card__updated">
                    Updated {new Date(template.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>

                  <div className="cert-template-card__actions mt-auto">
                    {template.status === 'draft' && (
                      <>
                        <Button as={Link} to={certPath(`templates/${template.templateId}/edit`)} variant="outline-secondary" size="sm" className="d-inline-flex align-items-center gap-1">
                          <CertIcon name="edit" size="1.6rem" />
                          Edit
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="d-inline-flex align-items-center gap-1"
                          onClick={() => runAction(() => actions.publishTemplate(template.templateId), 'Publish failed')}
                        >
                          <CertIcon name="publish" size="1.6rem" />
                          Publish
                        </Button>
                      </>
                    )}
                    <Button as={Link} to={certPath(`templates/${template.templateId}/preview`)} variant="outline-secondary" size="sm" className="d-inline-flex align-items-center gap-1">
                      <CertIcon name="visibility" size="1.6rem" />
                      Preview
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="d-inline-flex align-items-center gap-1"
                      onClick={() => runAction(() => actions.cloneTemplate(template.templateId), 'Clone failed')}
                    >
                      <CertIcon name="content_copy" size="1.6rem" />
                      Clone
                    </Button>
                    {template.status === 'published' && (
                      <Button as={Link} to={certPath(`templates/${template.templateId}/issuance`)} variant="outline-secondary" size="sm" className="d-inline-flex align-items-center gap-1">
                        <CertIcon name="rule_settings" size="1.6rem" />
                        Issuance
                      </Button>
                    )}
                    {template.status === 'draft' && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-inline-flex align-items-center gap-1"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this template?')) {
                            void runAction(() => actions.deleteTemplate(template.templateId), 'Delete failed');
                          }
                        }}
                      >
                        <CertIcon name="delete" size="1.6rem" />
                        Delete
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
