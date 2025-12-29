import { useState } from 'react';
import {
  useMyClientOrg,
  useCreateClientOrg,
  useUpdateClientOrg,
} from '../../core/application/useClientOrg';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateClientOrgRequest, UpdateClientOrgRequest } from '../../core/domain/dtos';
import { OrgType } from '../../core/domain/enums';
import { createClientOrgSchema, updateClientOrgSchema } from '../../shared/lib/formSchemas';
import { VALIDATION_LIMITS } from '../../shared/lib/validationUtils';

export const ClientOrgPage = () => {
  const { data: org, isLoading, error } = useMyClientOrg();
  const createOrg = useCreateClientOrg();
  const updateOrg = useUpdateClientOrg();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: createErrors },
  } = useForm<CreateClientOrgRequest>({
    resolver: zodResolver(createClientOrgSchema),
    defaultValues: {
      orgType: OrgType.PRODUCTION_COMPANY,
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
  } = useForm<UpdateClientOrgRequest>({
    resolver: zodResolver(updateClientOrgSchema),
  });

  const onCreateOrg = (data: CreateClientOrgRequest) => {
    createOrg.mutate(data);
  };

  const onUpdateOrg = (data: UpdateClientOrgRequest) => {
    updateOrg.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent shadow-lg"></div>
          <p className="text-slate-600 mt-6 text-lg font-medium">Loading your organization...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !org) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create Your Organization
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Set up your organization profile to start finding talent
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCreate(onCreateOrg)} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...registerCreate('orgName')}
                    placeholder="ABC Productions"
                    className={`mt-1 h-11 ${createErrors.orgName ? 'border-red-500' : ''}`}
                  />
                  {createErrors.orgName && (
                    <p className="text-sm text-red-600 mt-1">{createErrors.orgName.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Organization Type</label>
                  <select
                    {...registerCreate('orgType')}
                    className="mt-1 flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value={OrgType.PRODUCTION_COMPANY}>Production Company</option>
                    <option value={OrgType.AGENCY}>Agency</option>
                    <option value={OrgType.BRAND}>Brand</option>
                    <option value={OrgType.INDIVIDUAL}>Individual</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Description <span className="text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    {...registerCreate('description')}
                    className={`mt-1 flex w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${
                      createErrors.description ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Tell us about your organization..."
                    maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX}
                  />
                  {createErrors.description && (
                    <p className="text-sm text-red-600 mt-1">{createErrors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Website <span className="text-slate-500">(optional)</span>
                  </label>
                  <Input
                    {...registerCreate('website')}
                    placeholder="https://..."
                    className={`mt-1 h-11 ${createErrors.website ? 'border-red-500' : ''}`}
                  />
                  {createErrors.website && (
                    <p className="text-sm text-red-600 mt-1">{createErrors.website.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Address <span className="text-slate-500">(optional)</span>
                  </label>
                  <Input
                    {...registerCreate('address')}
                    placeholder="123 Main St, Los Angeles, CA"
                    className={`mt-1 h-11 ${createErrors.address ? 'border-red-500' : ''}`}
                  />
                  {createErrors.address && (
                    <p className="text-sm text-red-600 mt-1">{createErrors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Contact Email <span className="text-slate-500">(optional)</span>
                    </label>
                    <Input
                      {...registerCreate('contactEmail')}
                      type="email"
                      placeholder="contact@example.com"
                      className={`mt-1 h-11 ${createErrors.contactEmail ? 'border-red-500' : ''}`}
                    />
                    {createErrors.contactEmail && (
                      <p className="text-sm text-red-600 mt-1">
                        {createErrors.contactEmail.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Contact Phone <span className="text-slate-500">(optional)</span>
                    </label>
                    <Input
                      {...registerCreate('contactPhone')}
                      placeholder="+1 (555) 123-4567"
                      className={`mt-1 h-11 ${createErrors.contactPhone ? 'border-red-500' : ''}`}
                    />
                    {createErrors.contactPhone && (
                      <p className="text-sm text-red-600 mt-1">
                        {createErrors.contactPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Logo URL <span className="text-slate-500">(optional)</span>
                  </label>
                  <Input
                    {...registerCreate('logoUrl')}
                    placeholder="https://..."
                    className={`mt-1 h-11 ${createErrors.logoUrl ? 'border-red-500' : ''}`}
                  />
                  {createErrors.logoUrl && (
                    <p className="text-sm text-red-600 mt-1">{createErrors.logoUrl.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createOrg.isPending}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                >
                  {createOrg.isPending ? 'Creating...' : 'Create Organization'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!org) {
    return null;
  }

  const getOrgTypeLabel = (type: OrgType) => {
    switch (type) {
      case OrgType.PRODUCTION_COMPANY:
        return 'Production Company';
      case OrgType.AGENCY:
        return 'Agency';
      case OrgType.BRAND:
        return 'Brand';
      case OrgType.INDIVIDUAL:
        return 'Individual';
      default:
        return type;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex items-start gap-6 -mt-16">
              <div className="relative">
                {org.logoUrl ? (
                  <img
                    src={org.logoUrl}
                    alt={org.orgName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 pt-16">
                <h1 className="text-3xl font-bold text-slate-900">{org.orgName}</h1>
                <div className="mt-2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold shadow-md">
                    {getOrgTypeLabel(org.orgType)}
                  </span>
                </div>
              </div>
              <div className="pt-16">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    } else {
                      resetUpdate({
                        orgName: org.orgName,
                        orgType: org.orgType,
                        description: org.description || '',
                        website: org.website || '',
                        address: org.address || '',
                        contactEmail: org.contactEmail || '',
                        contactPhone: org.contactPhone || '',
                        logoUrl: org.logoUrl || '',
                      });
                      setIsEditing(true);
                    }
                  }}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  {isEditing ? 'Cancel' : 'Edit Organization'}
                </Button>
              </div>
            </div>

            {org.description && !isEditing && (
              <div className="mt-6 pl-6">
                <p className="text-slate-700 leading-relaxed">{org.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {isEditing ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">
                Edit Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitUpdate(onUpdateOrg)} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Organization Name</label>
                  <Input {...registerUpdate('orgName')} className="mt-1 h-11" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Organization Type</label>
                  <select
                    {...registerUpdate('orgType')}
                    className="mt-1 flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={OrgType.PRODUCTION_COMPANY}>Production Company</option>
                    <option value={OrgType.AGENCY}>Agency</option>
                    <option value={OrgType.BRAND}>Brand</option>
                    <option value={OrgType.INDIVIDUAL}>Individual</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    {...registerUpdate('description')}
                    className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Website</label>
                  <Input {...registerUpdate('website')} className="mt-1 h-11" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <Input {...registerUpdate('address')} className="mt-1 h-11" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Contact Email</label>
                    <Input {...registerUpdate('contactEmail')} type="email" className="mt-1 h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Contact Phone</label>
                    <Input {...registerUpdate('contactPhone')} className="mt-1 h-11" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Logo URL</label>
                  <Input {...registerUpdate('logoUrl')} className="mt-1 h-11" />
                </div>

                <Button
                  type="submit"
                  disabled={updateOrg.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                >
                  {updateOrg.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Contact Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {org.contactEmail && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      Email
                    </h3>
                    <a
                      href={`mailto:${org.contactEmail}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {org.contactEmail}
                    </a>
                  </div>
                )}
                {org.contactPhone && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      Phone
                    </h3>
                    <a href={`tel:${org.contactPhone}`} className="text-slate-700 font-medium">
                      {org.contactPhone}
                    </a>
                  </div>
                )}
                {org.website && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      Website
                    </h3>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      {org.website}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
                {org.address && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      Address
                    </h3>
                    <p className="text-slate-700">{org.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};
export default ClientOrgPage;
