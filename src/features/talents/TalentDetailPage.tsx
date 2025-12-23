import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTalentProfile } from '../../core/application/useTalents';
import { useCreateConversation } from '../../core/application/useMessaging';
import { useCurrentUser } from '../../core/application/useAuth';
import { usePortfolioItems } from '../../core/application/useMedia';
import { getInitials } from '../../shared/utils/stringUtils';
import {
  useTalentRatings,
  useTalentStatistics,
  useCreateRating,
} from '../../core/application/useRatings';
import { useCreateCollaboration } from '../../core/application/useCollaborations';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Button } from '../../shared/components/ui/Button';
import { useToast } from '../../shared/contexts/ToastContext';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { PortfolioGallery } from '../../shared/components/ui/PortfolioGallery';
import { MediaViewer } from '../../shared/components/ui/MediaViewer';
import { ReviewForm } from '../../shared/components/ui/ReviewForm';
import { ReviewList } from '../../shared/components/ui/ReviewList';
import { RatingBreakdown } from '../../shared/components/ui/RatingBreakdown';
import { CollaborationRequestModal } from '../../shared/components/ui/CollaborationRequestModal';
import { PortfolioItemWithMedia } from '../../core/domain/entities';
import { CreateRatingRequest, CreateCollaborationRequest } from '../../core/domain/dtos';
import { UserRole } from '../../core/domain/enums';

export const TalentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: talent, isLoading, error } = useTalentProfile(id);
  const { data: currentUser } = useCurrentUser();
  const createConversation = useCreateConversation();
  const { showSuccess, showError } = useToast();

  // Portfolio state and hooks
  const { data: portfolioItems = [], isLoading: isLoadingPortfolio } = usePortfolioItems(id);
  const [selectedMediaItem, setSelectedMediaItem] = useState<PortfolioItemWithMedia | null>(null);

  // Rating state and hooks
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);

  // Collaboration state
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);

  // Image error state
  const [imageError, setImageError] = useState(false);
  const {
    data: ratingsData,
    isLoading: isLoadingRatings,
  } = useTalentRatings({
    talentProfileId: id!,
    page: currentReviewPage,
    size: 10,
  });
  const { data: statistics, isLoading: isLoadingStatistics } = useTalentStatistics(id);
  const createRating = useCreateRating();
  const createCollaboration = useCreateCollaboration();

  const isClient = currentUser?.role === UserRole.CLIENT;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !talent) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load talent profile.</p>
        </div>
      </MainLayout>
    );
  }

  const handleStartConversation = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!talent) return;

    createConversation.mutate(
      {
        talentUserId: talent.userId,
        clientUserId: currentUser.userId,
      },
      {
        onSuccess: (conversation) => {
          navigate(`/messages?conversationId=${conversation.conversationId}`);
        },
      }
    );
  };

  const handleMediaItemClick = (item: PortfolioItemWithMedia) => {
    setSelectedMediaItem(item);
  };

  const handleNextMedia = () => {
    if (!selectedMediaItem) return;
    const currentIndex = portfolioItems.findIndex(
      (item) => item.portfolioItemId === selectedMediaItem.portfolioItemId
    );
    if (currentIndex < portfolioItems.length - 1) {
      setSelectedMediaItem(portfolioItems[currentIndex + 1]);
    }
  };

  const handlePreviousMedia = () => {
    if (!selectedMediaItem) return;
    const currentIndex = portfolioItems.findIndex(
      (item) => item.portfolioItemId === selectedMediaItem.portfolioItemId
    );
    if (currentIndex > 0) {
      setSelectedMediaItem(portfolioItems[currentIndex - 1]);
    }
  };

  const handleReviewSubmit = async (reviewData: CreateRatingRequest) => {
    try {
      await createRating.mutateAsync(reviewData);
      setShowReviewForm(false);
      showSuccess('Review submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showError(`Failed to submit review: ${error.message || 'Unknown error'}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentReviewPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollaborationSubmit = async (requestData: CreateCollaborationRequest) => {
    try {
      await createCollaboration.mutateAsync(requestData);
      setShowCollaborationModal(false);
      showSuccess('Collaboration request sent successfully! The talent will be notified.');
    } catch (error: any) {
      console.error('Error sending collaboration request:', error);
      showError(`Failed to send collaboration request: ${error.message || 'Unknown error'}`);
    }
  };

  const capabilities = [
    talent.capabilities.canDoActing && 'Acting',
    talent.capabilities.canDoVoiceover && 'Voiceover',
    talent.capabilities.canDoModeling && 'Modeling',
    talent.capabilities.canDoSinging && 'Singing',
    talent.capabilities.canDoDancing && 'Dancing',
    talent.capabilities.canDoHosting && 'Hosting',
  ].filter((cap): cap is string => Boolean(cap));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link to="/talents">
            <Button variant="outline">← Back to Talents</Button>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Profile Image or Initials */}
                  <div className="md:col-span-1">
                    {talent.profileImageUrl && talent.profileImageUrl.trim() !== '' && !imageError ? (
                      <img
                        src={talent.profileImageUrl}
                        alt={talent.fullName}
                        className="w-full rounded-lg object-cover aspect-square"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-lg">
                        <span className="text-8xl font-bold text-white/30">{getInitials(talent.fullName)}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold mb-2">{talent.fullName}</h1>

                    {talent.location.city && talent.location.country && (
                      <p className="text-muted-foreground mb-4">
                        {talent.location.city}, {talent.location.country}
                      </p>
                    )}

                    {talent.averageRating !== null && talent.totalRatings !== null && talent.totalRatings > 0 && (
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="text-2xl font-bold">{talent.averageRating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({talent.totalRatings} {talent.totalRatings === 1 ? 'review' : 'reviews'})</span>
                        </div>
                        {talent.tier && (
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            talent.tier === 'PREMIUM' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
                            talent.tier === 'GOLD' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                            talent.tier === 'SILVER' ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' :
                            'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                          }`}>
                            {talent.tier} TIER
                          </span>
                        )}
                      </div>
                    )}

                    {(talent.completedCollaborations !== null || talent.successRate !== null) && (
                      <div className="mb-6 flex gap-6">
                        {talent.completedCollaborations !== null && (
                          <div>
                            <p className="text-sm text-muted-foreground">Completed Projects</p>
                            <p className="text-xl font-semibold">{talent.completedCollaborations}</p>
                          </div>
                        )}
                        {talent.successRate !== null && (
                          <div>
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                            <p className="text-xl font-semibold">{talent.successRate.toFixed(0)}%</p>
                          </div>
                        )}
                      </div>
                    )}

                    {talent.bio && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Bio</h2>
                        <p className="text-muted-foreground">{talent.bio}</p>
                      </div>
                    )}

                    {capabilities.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Capabilities</h2>
                        <div className="flex flex-wrap gap-2">
                          {capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {talent.languages.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Languages</h2>
                        <div className="flex flex-wrap gap-2">
                          {talent.languages.map((lang) => (
                            <span
                              key={lang}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {talent.tags.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                          {talent.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {talent.socialLinks.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Social Media</h2>
                        <div className="space-y-2">
                          {talent.socialLinks.map((link) => (
                            <div key={link.platform} className="flex items-center gap-2">
                              <span className="font-medium">{link.platform}:</span>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {link.url}
                              </a>
                              {link.followerCount && (
                                <span className="text-sm text-muted-foreground">
                                  ({link.followerCount.toLocaleString()} followers)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Show for both authenticated and anonymous users */}
                    <div className="mt-8">
                      {!currentUser && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 text-center">
                            <Link to="/login" className="font-semibold hover:underline">Sign in</Link> or <Link to="/register" className="font-semibold hover:underline">create an account</Link> to contact this talent or request collaboration
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          size="lg"
                          onClick={() => {
                            if (!currentUser) {
                              navigate('/login');
                              return;
                            }
                            if (currentUser.role !== UserRole.CLIENT) {
                              showError('Only clients can request collaborations');
                              return;
                            }
                            setShowCollaborationModal(true);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">{!currentUser ? 'Sign in to Request Collaboration' : 'Request Collaboration'}</span>
                            <span className="sm:hidden">{!currentUser ? 'Sign in to Collaborate' : 'Collaborate'}</span>
                          </span>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={handleStartConversation}
                          disabled={createConversation.isPending}
                          className="border-2"
                        >
                          {createConversation.isPending ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Starting conversation...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="hidden sm:inline">{!currentUser ? 'Sign in to Contact Talent' : 'Contact Talent'}</span>
                              <span className="sm:hidden">{!currentUser ? 'Sign in to Contact' : 'Contact'}</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            {portfolioItems.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
                  {isLoadingPortfolio ? (
                    <div className="text-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="text-muted-foreground mt-4">Loading portfolio...</p>
                    </div>
                  ) : (
                    <PortfolioGallery
                      items={portfolioItems}
                      onItemClick={handleMediaItemClick}
                      isOwner={false}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Form Section - CLIENT only */}
            {isClient && !showReviewForm && (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-2">Have you worked with {talent.fullName}?</h3>
                  <p className="text-gray-600 mb-4">Share your experience to help other clients</p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm
                talentProfileId={talent.talentProfileId}
                talentName={talent.fullName}
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
                isSubmitting={createRating.isPending}
              />
            )}

            {/* Reviews Section */}
            {ratingsData && ratingsData.ratings.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Reviews ({ratingsData.totalRatings})
                  </h2>
                  <ReviewList
                    reviews={ratingsData.ratings}
                    totalReviews={ratingsData.totalRatings}
                    currentPage={ratingsData.page}
                    totalPages={ratingsData.totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoadingRatings}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating Breakdown */}
            {statistics && !isLoadingStatistics && (
              <RatingBreakdown statistics={statistics} />
            )}

            {isLoadingStatistics && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="text-gray-600 mt-4">Loading stats...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      <MediaViewer
        item={selectedMediaItem}
        onClose={() => setSelectedMediaItem(null)}
        onNext={handleNextMedia}
        onPrevious={handlePreviousMedia}
        hasNext={
          selectedMediaItem
            ? portfolioItems.findIndex(
                (item) => item.portfolioItemId === selectedMediaItem.portfolioItemId
              ) <
              portfolioItems.length - 1
            : false
        }
        hasPrevious={
          selectedMediaItem
            ? portfolioItems.findIndex(
                (item) => item.portfolioItemId === selectedMediaItem.portfolioItemId
              ) > 0
            : false
        }
      />

      {/* Collaboration Request Modal */}
      {showCollaborationModal && talent && (
        <CollaborationRequestModal
          talentProfileId={talent.talentProfileId}
          talentName={talent.fullName}
          onSubmit={handleCollaborationSubmit}
          onClose={() => setShowCollaborationModal(false)}
          isSubmitting={createCollaboration.isPending}
        />
      )}
    </MainLayout>
  );
};
