import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchTalents } from '../../core/application/useTalents';
import { TalentSearchRequest } from '../../core/domain/dtos';
import { TalentCard } from './components/TalentCard';
import { TalentFilters } from './components/TalentFilters';
import { TalentMap } from '../../shared/components/ui/TalentMap';
import { MainLayout } from '../../app/layouts/MainLayout';
import { TalentCardSkeleton } from '../../shared/components/ui/SkeletonLoader';
import { cardContainer, fadeIn } from '../../shared/lib/animations';

type ViewMode = 'list' | 'map';

export const TalentsListPage = () => {
  const [searchRequest, setSearchRequest] = useState<TalentSearchRequest>({ page: 0, size: 6 });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const { data: pagedResult, isLoading, error} = useSearchTalents(searchRequest);

  const talents = pagedResult?.content || [];
  const totalPages = pagedResult?.totalPages || 0;
  const currentPage = pagedResult?.page || 0;

  const handleFilterChange = (filters: TalentSearchRequest) => {
    setSearchRequest({ ...filters, page: 0, size: 6 });
  };

  const handlePageChange = (newPage: number) => {
    setSearchRequest({ ...searchRequest, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Browse Talents
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Find the perfect talent for your next project
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center px-4">
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 shadow-sm w-full sm:w-auto">
            <motion.button
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </motion.button>
            <motion.button
              onClick={() => setViewMode('map')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="hidden sm:inline">Map View</span>
              <span className="sm:hidden">Map</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden px-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <TalentFilters onFilterChange={handleFilterChange} />
          </aside>

          <div className="lg:col-span-3">
            {isLoading && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                variants={cardContainer}
                initial="hidden"
                animate="visible"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <TalentCardSkeleton key={i} />
                ))}
              </motion.div>
            )}

            {error && (
              <div className="text-center py-16 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-8 border border-red-200/50 shadow-lg">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-700 font-semibold text-lg">Failed to load talents</p>
                <p className="text-red-600 mt-2">Please try again later</p>
              </div>
            )}

            {talents && talents.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200/50 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold text-lg">
                  No talents found matching your criteria
                </p>
                <p className="text-sm text-slate-500 mt-2">Try adjusting your filters to see more results</p>
              </div>
            )}

            {talents && talents.length > 0 && (
              <>
                <AnimatePresence mode="wait">
                  {viewMode === 'list' ? (
                    <motion.div
                      key="list-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                        variants={cardContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {talents.map((talent) => (
                          <TalentCard key={talent.talentProfileId} talent={talent} />
                        ))}
                      </motion.div>

                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 px-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all text-sm"
                        >
                          Previous
                        </button>

                        <div className="flex gap-1 flex-wrap justify-center">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i;
                            } else if (currentPage < 3) {
                              pageNum = i;
                            } else if (currentPage >= totalPages - 3) {
                              pageNum = totalPages - 5 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 sm:px-4 sm:py-2 sm:w-auto rounded-lg transition-all text-sm font-medium ${
                                  pageNum === currentPage
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
                                }`}
                              >
                                {pageNum + 1}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all text-sm"
                        >
                          Next
                        </button>
                      </div>
                    )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="map-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TalentMap
                        talents={talents}
                        center={
                          searchRequest.latitude && searchRequest.longitude
                            ? [searchRequest.latitude, searchRequest.longitude]
                            : undefined
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
