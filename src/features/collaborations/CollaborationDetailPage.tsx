import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useCollaboration,
  useAcceptCollaboration,
  useDeclineCollaboration,
  useStartCollaboration,
  useCompleteCollaboration,
  useCancelCollaboration,
} from '../../core/application/useCollaborations';
import { useCurrentUser } from '../../core/application/useAuth';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { CollaborationStatus, UserRole } from '../../core/domain/enums';
import { useToast } from '../../shared/contexts/ToastContext';

export const CollaborationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: collaboration, isLoading, error } = useCollaboration(id);
  const { data: currentUser } = useCurrentUser();
  const { showSuccess, showError } = useToast();

  const acceptMutation = useAcceptCollaboration();
  const declineMutation = useDeclineCollaboration();
  const startMutation = useStartCollaboration();
  const completeMutation = useCompleteCollaboration();
  const cancelMutation = useCancelCollaboration();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 mt-4">Loading collaboration...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !collaboration) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load collaboration.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </MainLayout>
    );
  }

  const isClient = currentUser?.role === UserRole.CLIENT;
  const isTalent = currentUser?.role === UserRole.TALENT;

  const getStatusBadgeColor = (status: CollaborationStatus) => {
    switch (status) {
      case CollaborationStatus.PROPOSED:
        return 'bg-blue-500 text-white';
      case CollaborationStatus.ACCEPTED:
        return 'bg-green-500 text-white';
      case CollaborationStatus.IN_PROGRESS:
        return 'bg-purple-500 text-white';
      case CollaborationStatus.COMPLETED:
        return 'bg-gray-500 text-white';
      case CollaborationStatus.DECLINED:
        return 'bg-red-500 text-white';
      case CollaborationStatus.CANCELED:
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAccept = async () => {
    if (!confirm('Accept this collaboration proposal?')) return;
    try {
      await acceptMutation.mutateAsync(collaboration.collaborationId);
      showSuccess('Collaboration accepted successfully!');
    } catch (error: unknown) {
      showError(`Failed to accept: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Decline this collaboration proposal?')) return;
    try {
      await declineMutation.mutateAsync(collaboration.collaborationId);
      showSuccess('Collaboration declined.');
      navigate(-1);
    } catch (error: unknown) {
      showError(`Failed to decline: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStart = async () => {
    if (!confirm('Start work on this collaboration?')) return;
    try {
      await startMutation.mutateAsync(collaboration.collaborationId);
      showSuccess('Collaboration started! Good luck with the project.');
    } catch (error: unknown) {
      showError(`Failed to start: ${error.message || 'Unknown error'}`);
    }
  };

  const handleComplete = async () => {
    if (!confirm('Mark this collaboration as completed?')) return;
    try {
      await completeMutation.mutateAsync(collaboration.collaborationId);
      showSuccess('Collaboration marked as completed!');
    } catch (error: unknown) {
      showError(`Failed to complete: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this collaboration? This action cannot be undone.')) return;
    try {
      await cancelMutation.mutateAsync(collaboration.collaborationId);
      showSuccess('Collaboration canceled.');
    } catch (error: unknown) {
      showError(`Failed to cancel: ${error.message || 'Unknown error'}`);
    }
  };

  const canAccept = isTalent && collaboration.status === CollaborationStatus.PROPOSED;
  const canDecline = isTalent && collaboration.status === CollaborationStatus.PROPOSED;
  const canStart = collaboration.status === CollaborationStatus.ACCEPTED;
  const canComplete = collaboration.status === CollaborationStatus.IN_PROGRESS;
  const canCancel =
    collaboration.status !== CollaborationStatus.COMPLETED &&
    collaboration.status !== CollaborationStatus.DECLINED;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>

        {/* Header Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{collaboration.title}</h1>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeColor(
                    collaboration.status
                  )}`}
                >
                  {collaboration.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {collaboration.status !== CollaborationStatus.COMPLETED &&
              collaboration.status !== CollaborationStatus.DECLINED &&
              collaboration.status !== CollaborationStatus.CANCELED && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {canAccept && (
                    <Button
                      onClick={handleAccept}
                      disabled={acceptMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {acceptMutation.isPending ? 'Accepting...' : 'Accept Proposal'}
                    </Button>
                  )}
                  {canDecline && (
                    <Button
                      onClick={handleDecline}
                      disabled={declineMutation.isPending}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      {declineMutation.isPending ? 'Declining...' : 'Decline'}
                    </Button>
                  )}
                  {canStart && (
                    <Button
                      onClick={handleStart}
                      disabled={startMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {startMutation.isPending ? 'Starting...' : 'Start Work'}
                    </Button>
                  )}
                  {canComplete && (
                    <Button
                      onClick={handleComplete}
                      disabled={completeMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {completeMutation.isPending ? 'Completing...' : 'Mark as Completed'}
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      onClick={handleCancel}
                      disabled={cancelMutation.isPending}
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      {cancelMutation.isPending ? 'Canceling...' : 'Cancel Collaboration'}
                    </Button>
                  )}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Project Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{collaboration.description}</p>
              </div>

              {collaboration.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Additional Notes
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{collaboration.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Budget</h3>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(collaboration.budget)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Timeline</h3>
                  <p className="text-gray-900">
                    {formatDate(collaboration.startDate)} - {formatDate(collaboration.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Status Timeline</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <p className="font-semibold">Proposed</p>
                  <p className="text-sm text-gray-500">{formatDate(collaboration.proposedAt)}</p>
                </div>
              </div>

              {collaboration.respondedAt && (
                <div className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      collaboration.status === CollaborationStatus.DECLINED
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold">
                      {collaboration.status === CollaborationStatus.DECLINED
                        ? 'Declined'
                        : 'Accepted'}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(collaboration.respondedAt)}</p>
                  </div>
                </div>
              )}

              {collaboration.status === CollaborationStatus.IN_PROGRESS && (
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1.5"></div>
                  <div>
                    <p className="font-semibold">In Progress</p>
                    <p className="text-sm text-gray-500">Work started</p>
                  </div>
                </div>
              )}

              {collaboration.completedAt && (
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mt-1.5"></div>
                  <div>
                    <p className="font-semibold">Completed</p>
                    <p className="text-sm text-gray-500">{formatDate(collaboration.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps (conditional) */}
        {collaboration.status === CollaborationStatus.COMPLETED && isClient && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
              <p className="text-gray-700 mb-4">
                How was your experience? Help others by leaving a review for this talent.
              </p>
              <Link to={`/talents/${collaboration.talentProfileId}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Write a Review</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
export default CollaborationDetailPage;
