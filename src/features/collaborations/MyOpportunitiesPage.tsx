import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTalentCollaborations } from '../../core/application/useCollaborations';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { CollaborationStatus, ServiceType } from '../../core/domain/enums';
import { Collaboration } from '../../core/domain/entities';

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.VOICE_OVER]: 'Voice Over',
  [ServiceType.ACTING_FROM_HOME]: 'Acting from Home',
  [ServiceType.ACTING_ON_LOCATION]: 'Acting on Location',
  [ServiceType.PHOTO_SHOOTING]: 'Photo Shooting',
  [ServiceType.FULL_VIDEO_PRODUCTION]: 'Full Video Production',
};

export const MyOpportunitiesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<CollaborationStatus | undefined>(undefined);
  const { data: collaborationsData, isLoading } = useTalentCollaborations(selectedStatus);

  const getStatusBadgeColor = (status: CollaborationStatus) => {
    switch (status) {
      case CollaborationStatus.PROPOSED:
        return 'bg-yellow-100 text-yellow-800';
      case CollaborationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case CollaborationStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case CollaborationStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case CollaborationStatus.DECLINED:
        return 'bg-red-100 text-red-800';
      case CollaborationStatus.CANCELED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const statusTabs = [
    { label: 'All', value: undefined },
    { label: 'New Requests', value: CollaborationStatus.PROPOSED },
    { label: 'Accepted', value: CollaborationStatus.ACCEPTED },
    { label: 'In Progress', value: CollaborationStatus.IN_PROGRESS },
    { label: 'Completed', value: CollaborationStatus.COMPLETED },
  ];

  const renderCollaborationCard = (collaboration: Collaboration) => {
    const isNewRequest = collaboration.status === CollaborationStatus.PROPOSED;

    return (
      <Card
        key={collaboration.collaborationId}
        className={`hover:shadow-lg transition-shadow ${isNewRequest ? 'border-2 border-yellow-300' : ''}`}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {isNewRequest && (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white mb-2">
                  NEW REQUEST
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{collaboration.title}</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                  collaboration.status
                )}`}
              >
                {collaboration.status.replace('_', ' ')}
              </span>
            </div>
            <Link to={`/collaborations/${collaboration.collaborationId}`}>
              <Button variant="outline" size="sm">
                {isNewRequest ? 'Respond →' : 'View Details →'}
              </Button>
            </Link>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{collaboration.description}</p>

          {/* Services Required */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Services Required</p>
            <div className="flex flex-wrap gap-2">
              {collaboration.servicesRequired.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800"
                >
                  {SERVICE_TYPE_LABELS[service]}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {collaboration.deadline && (
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-semibold text-red-600">{formatDate(collaboration.deadline)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-semibold">{formatCurrency(collaboration.budget)}</p>
            </div>
            {collaboration.startDate && (
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold">{formatDate(collaboration.startDate)}</p>
              </div>
            )}
            {collaboration.endDate && (
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold">{formatDate(collaboration.endDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="font-semibold">{formatDate(collaboration.proposedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Count new requests
  const newRequestsCount =
    collaborationsData?.collaborations.filter((c) => c.status === CollaborationStatus.PROPOSED)
      .length || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">My Opportunities</h1>
            {newRequestsCount > 0 && (
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-500 text-white">
                {newRequestsCount} New
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            Review collaboration requests and manage your active projects
          </p>
        </div>

        {/* Status Tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => (
                <motion.button
                  key={tab.label}
                  onClick={() => setSelectedStatus(tab.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === tab.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  {tab.value === CollaborationStatus.PROPOSED && newRequestsCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-bold">
                      {newRequestsCount}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collaborations List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-4">Loading your opportunities...</p>
          </div>
        ) : !collaborationsData || collaborationsData.collaborations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">No opportunities yet</h3>
              <p className="text-gray-600 mb-4">
                {selectedStatus
                  ? `No opportunities with status "${selectedStatus.replace('_', ' ')}"`
                  : 'When clients request collaborations with you, they will appear here'}
              </p>
              <Link to="/profile">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Complete Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStatus || 'all'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {collaborationsData.collaborations.map(renderCollaborationCard)}
              </div>

              {/* Summary */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{collaborationsData.total}</span>{' '}
                    {selectedStatus ? `${selectedStatus.replace('_', ' ').toLowerCase()} ` : ''}
                    {collaborationsData.total === 1 ? 'opportunity' : 'opportunities'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </MainLayout>
  );
};
export default MyOpportunitiesPage;
