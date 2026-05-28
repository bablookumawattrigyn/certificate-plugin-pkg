import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTemplateState } from '../hooks/useTemplate';
import { useCertPath } from '../hooks/useCertPath';
import { NotFoundPanel } from '../components/ui/NotFoundPanel';
import { EmptyState } from '../components/ui/EmptyState';
import type { IssuanceConditions } from '../types';

export function IssuanceConfig() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const certPath = useCertPath();
  const { template, pending, missing } = useTemplateState(templateId);

  const [conditions, setConditions] = useState<IssuanceConditions>({
    moduleCompletion: true,
    minimumScore: undefined,
    mandatoryQuizzes: true,
    attendanceRequired: false,
    creatorApproval: false,
  });

  const [hasMinScore, setHasMinScore] = useState(false);

  if (pending) {
    return <EmptyState icon="hourglass_top" title="Loading template…" />;
  }

  if (missing || !template) {
    return <NotFoundPanel message="Template not found." />;
  }

  if (template.status !== 'published') {
    return <NotFoundPanel message="Template must be published to configure issuance." />;
  }

  const handleSave = () => {
    const finalConditions: IssuanceConditions = {
      ...conditions,
      minimumScore: hasMinScore ? conditions.minimumScore : undefined,
    };
    // In a real app, this would save to the backend
    console.log('Issuance conditions saved:', finalConditions);
    alert('Issuance conditions saved successfully!');
    navigate(certPath('templates'));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Issuance Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure auto-issuance conditions for: <strong>{template.name}</strong>
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(certPath('templates'))} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conditions */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Auto-Issuance Conditions</h3>
            <p className="text-xs text-gray-400 mb-4">
              Certificates will be automatically generated when the learner meets all enabled conditions.
            </p>

            <div className="space-y-4">
              {/* 100% Module Completion */}
              <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.moduleCompletion}
                  onChange={(e) =>
                    setConditions({ ...conditions, moduleCompletion: e.target.checked })
                  }
                  className="mt-0.5 rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">100% Module Completion</p>
                  <p className="text-xs text-gray-500">
                    Learner must complete all modules in the course.
                  </p>
                </div>
              </label>

              {/* Minimum Score */}
              <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMinScore}
                  onChange={(e) => setHasMinScore(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Minimum Score in Assessments</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Require a minimum assessment score for certificate issuance.
                  </p>
                  {hasMinScore && (
                    <input
                      type="number"
                      value={conditions.minimumScore || ''}
                      onChange={(e) =>
                        setConditions({ ...conditions, minimumScore: Number(e.target.value) })
                      }
                      placeholder="e.g., 60"
                      min={0}
                      max={100}
                      className="input-field w-32"
                    />
                  )}
                </div>
              </label>

              {/* Mandatory Quizzes */}
              <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.mandatoryQuizzes}
                  onChange={(e) =>
                    setConditions({ ...conditions, mandatoryQuizzes: e.target.checked })
                  }
                  className="mt-0.5 rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Completion of Mandatory Quizzes</p>
                  <p className="text-xs text-gray-500">
                    All mandatory quizzes must be attempted and submitted.
                  </p>
                </div>
              </label>

              {/* Attendance */}
              <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.attendanceRequired}
                  onChange={(e) =>
                    setConditions({ ...conditions, attendanceRequired: e.target.checked })
                  }
                  className="mt-0.5 rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Attendance in Virtual Classes (Optional)
                  </p>
                  <p className="text-xs text-gray-500">
                    Require attendance in live/virtual sessions.
                  </p>
                </div>
              </label>

              {/* Creator Approval */}
              <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions.creatorApproval}
                  onChange={(e) =>
                    setConditions({ ...conditions, creatorApproval: e.target.checked })
                  }
                  className="mt-0.5 rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">Creator Approval (Optional)</p>
                  <p className="text-xs text-gray-500">
                    Require manual approval from the course creator before issuance.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Generation Workflow Info */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Generation Workflow</h3>
            <ol className="space-y-3">
              {[
                'System detects Auto-Issuance Conditions met',
                'Fetches the linked certificate template',
                'Merges learner, course, and template data',
                'Generates a secure PDF',
                'Stores certificate metadata in DB',
                'Places certificate in learner profile',
                'Sends notification: "Your certificate is ready to download."',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card bg-warning-50 border-warning-500/20">
            <h3 className="text-sm font-semibold text-warning-700 mb-2">Validation Rules</h3>
            <ul className="text-xs text-warning-700 space-y-1">
              <li>• No duplicate certificates for the same course + user</li>
              <li>• Template must be published</li>
              <li>• All required dynamic fields must be available</li>
              <li>• Learner must meet all enabled completion criteria</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
