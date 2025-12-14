import { Link } from 'react-router-dom';
import { TalentProfile } from '../../../core/domain/entities';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';

interface TalentCardProps {
  talent: TalentProfile;
}

export const TalentCard = ({ talent }: TalentCardProps) => {
  // Debug: log rating data
  console.log('Talent Card Data:', {
    name: talent.fullName,
    tier: talent.tier,
    averageRating: talent.averageRating,
    totalRatings: talent.totalRatings,
    completedCollaborations: talent.completedCollaborations,
    successRate: talent.successRate
  });

  const capabilitiesText = [
    talent.capabilities.canDoActing && 'Acting',
    talent.capabilities.canDoVoiceover && 'Voiceover',
    talent.capabilities.canDoModeling && 'Modeling',
    talent.capabilities.canDoSinging && 'Singing',
    talent.capabilities.canDoDancing && 'Dancing',
    talent.capabilities.canDoHosting && 'Hosting',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {talent.profileImageUrl ? (
          <div className="w-full h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
            <img
              src={talent.profileImageUrl}
              alt={talent.fullName}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/30">{talent.fullName.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-lg">
            {talent.verificationStatus}
          </span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-slate-900 mb-1">{talent.fullName}</CardTitle>
        {talent.location.city && talent.location.country && (
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {talent.location.city}, {talent.location.country}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {talent.totalRatings !== null && talent.totalRatings > 0 && talent.averageRating !== null ? (
            <>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="font-semibold text-slate-900">{talent.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-slate-500">({talent.totalRatings} {talent.totalRatings === 1 ? 'review' : 'reviews'})</span>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm text-slate-500">No reviews yet</span>
            </div>
          )}
          {talent.tier && (
            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold ${
              talent.tier === 'PREMIUM' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
              talent.tier === 'GOLD' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
              talent.tier === 'SILVER' ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' :
              'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
            }`}>
              {talent.tier}
            </span>
          )}
          {talent.completedCollaborations !== null && talent.completedCollaborations > 0 && (
            <span className="text-xs text-slate-500">
              {talent.completedCollaborations} {talent.completedCollaborations === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        {talent.bio && (
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">{talent.bio}</p>
        )}

        {capabilitiesText && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Skills</p>
            <p className="text-sm text-slate-600">{capabilitiesText}</p>
          </div>
        )}

        {talent.languages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Languages</p>
            <div className="flex flex-wrap gap-2">
              {talent.languages.slice(0, 3).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Link to={`/talents/${talent.talentProfileId}`}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
