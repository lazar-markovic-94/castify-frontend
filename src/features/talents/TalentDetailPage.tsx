import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTalentProfile } from '../../core/application/useTalents';
import { useCreateConversation } from '../../core/application/useMessaging';
import { useCurrentUser } from '../../core/application/useAuth';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Button } from '../../shared/components/ui/Button';
import { Card, CardContent } from '../../shared/components/ui/Card';

export const TalentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: talent, isLoading, error } = useTalentProfile(id);
  const { data: currentUser } = useCurrentUser();
  const createConversation = useCreateConversation();

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
    if (!currentUser || !talent) return;

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/talents">
            <Button variant="outline">← Back to Talents</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {talent.profileImageUrl && (
                <div className="md:col-span-1">
                  <img
                    src={talent.profileImageUrl}
                    alt={talent.fullName}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}

              <div className={talent.profileImageUrl ? 'md:col-span-2' : 'md:col-span-3'}>
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

                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={handleStartConversation}
                    disabled={createConversation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contact Talent
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
