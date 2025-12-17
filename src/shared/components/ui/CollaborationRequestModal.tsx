import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { Input } from './Input';
import { CreateCollaborationRequest } from '../../../core/domain/dtos';

interface CollaborationRequestModalProps {
  talentProfileId: string;
  talentName: string;
  onSubmit: (data: CreateCollaborationRequest) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

interface FormData {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export const CollaborationRequestModal = ({
  talentProfileId,
  talentName,
  onSubmit,
  onClose,
  isSubmitting = false,
}: CollaborationRequestModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onFormSubmit = (data: FormData) => {
    // Convert date strings to ISO-8601 timestamps (Instant format)
    const startDateISO = data.startDate ? new Date(data.startDate).toISOString() : null;
    const endDateISO = data.endDate ? new Date(data.endDate).toISOString() : null;

    const collaborationRequest: CreateCollaborationRequest = {
      talentProfileId,
      title: data.title.trim(),
      description: data.description.trim(),
      budget: data.budget ? parseFloat(data.budget) : null,
      startDate: startDateISO,
      endDate: endDateISO,
      notes: data.notes?.trim() || null,
    };

    onSubmit(collaborationRequest);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Request Collaboration</h2>
              <p className="text-gray-600 mt-1">Send a project proposal to {talentName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Voice Over for Commercial Advertisement"
                {...register('title', { required: 'Project title is required' })}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe your project in detail: objectives, requirements, deliverables..."
                {...register('description', { required: 'Project description is required' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold mb-2">
                Budget (USD) <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 1500.00"
                {...register('budget')}
              />
              <p className="text-sm text-gray-500 mt-1">Enter your proposed budget for this project</p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold mb-2">
                  Start Date <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold mb-2">
                  End Date <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold mb-2">
                Additional Notes <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional information, special requirements, or questions..."
                {...register('notes')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </span>
                ) : (
                  'Send Collaboration Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
