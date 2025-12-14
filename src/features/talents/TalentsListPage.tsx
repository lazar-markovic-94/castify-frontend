import { useState } from 'react';
import { useSearchTalents } from '../../core/application/useTalents';
import { TalentSearchRequest } from '../../core/domain/dtos';
import { TalentCard } from './components/TalentCard';
import { TalentFilters } from './components/TalentFilters';
import { MainLayout } from '../../app/layouts/MainLayout';

export const TalentsListPage = () => {
  const [searchRequest, setSearchRequest] = useState<TalentSearchRequest>({ page: 0, size: 6 });
  const { data: pagedResult, isLoading, error } = useSearchTalents(searchRequest);

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
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Browse Talents
          </h1>
          <p className="text-slate-600 text-lg">
            Find the perfect talent for your next project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <TalentFilters onFilterChange={handleFilterChange} />
          </aside>

          <div className="lg:col-span-3">
            {isLoading && (
              <div className="text-center py-20">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent shadow-lg"></div>
                <p className="text-slate-600 mt-6 text-lg font-medium">Discovering amazing talents...</p>
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {talents.map((talent) => (
                    <TalentCard key={talent.talentProfileId} talent={talent} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            page === currentPage
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
                          }`}
                        >
                          {page + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
