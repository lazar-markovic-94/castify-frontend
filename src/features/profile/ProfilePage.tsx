import { useState, useRef } from 'react';
import {
  useMyTalentProfile,
  useCreateTalentProfile,
  useUpdatePrimaryLocation,
  useAddGeoArea,
  useRemoveGeoArea,
  useUpdateTalentLanguages,
  useUpdateTalentTags,
  useUpdateTalentCapabilities,
  useUpdateTalentSocialLinks,
  useUpdateProfileImage,
} from '../../core/application/useTalents';
import { useUploadImage } from '../../core/application/useUpload';
import { useToast } from '../../shared/contexts/ToastContext';
import {
  usePortfolioItems,
  useUploadAndAddToPortfolio,
  useRemoveFromPortfolio,
} from '../../core/application/useMedia';
import { useTalentStatistics } from '../../core/application/useRatings';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { MediaUpload, MediaUploadMetadata } from '../../shared/components/ui/MediaUpload';
import { PortfolioGallery } from '../../shared/components/ui/PortfolioGallery';
import { MediaViewer } from '../../shared/components/ui/MediaViewer';
import { PortfolioItemWithMedia } from '../../core/domain/entities';
import { useForm } from 'react-hook-form';
import { LocationMode } from '../../core/domain/enums';
import {
  CreateTalentProfileRequest,
  UpdatePrimaryLocationRequest,
  AddGeoAreaRequest,
  UpdateCapabilitiesRequest,
} from '../../core/domain/dtos';
import { GeoArea } from '../../core/domain/entities';

// Form types that match the HTML form structure
interface LanguagesFormData {
  languages: string; // Comma-separated string in the form
}

interface TagsFormData {
  tags: string; // Comma-separated string in the form
}

interface SocialLinksFormData {
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

export const ProfilePage = () => {
  const { data: profile, isLoading, error } = useMyTalentProfile();
  const { data: statistics } = useTalentStatistics(profile?.talentProfileId);
  const createProfile = useCreateTalentProfile();
  const updatePrimaryLocation = useUpdatePrimaryLocation();
  const addGeoArea = useAddGeoArea();
  const removeGeoArea = useRemoveGeoArea();
  const updateLanguages = useUpdateTalentLanguages();
  const updateTags = useUpdateTalentTags();
  const updateCapabilities = useUpdateTalentCapabilities();
  const updateSocialLinks = useUpdateTalentSocialLinks();
  const updateProfileImage = useUpdateProfileImage();
  const uploadImage = useUploadImage();
  const { showSuccess, showError } = useToast();

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [newGeoAreaCity, setNewGeoAreaCity] = useState('');
  const [newGeoAreaCountry, setNewGeoAreaCountry] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Portfolio state and hooks
  const { data: portfolioItems = [], isLoading: isLoadingPortfolio } = usePortfolioItems(
    profile?.talentProfileId
  );
  const uploadAndAddToPortfolio = useUploadAndAddToPortfolio();
  const removeFromPortfolio = useRemoveFromPortfolio();
  const [selectedMediaItem, setSelectedMediaItem] = useState<PortfolioItemWithMedia | null>(null);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  const { register: registerCreate, handleSubmit: handleSubmitCreate, setValue: setCreateValue } = useForm<CreateTalentProfileRequest>({
    defaultValues: {
      locationMode: LocationMode.SPECIFIC,
      primaryLocation: undefined,
      geoAreas: [],
    },
  });

  const [isCapturingCreateLocation, setIsCapturingCreateLocation] = useState(false);

  const captureCreateLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturingCreateLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get city and country
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const city = data.address?.city || data.address?.town || data.address?.village || '';
          const country = data.address?.country || '';

          setCreateValue('primaryLocation', {
            latitude,
            longitude,
            city,
            country,
          });

          // Also add to geoAreas as primary
          setCreateValue('geoAreas', [{ city, country, isPrimary: true }]);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          alert('Failed to get location details. Please enter city and country manually.');
        } finally {
          setIsCapturingCreateLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Please enter it manually.');
        setIsCapturingCreateLocation(false);
      }
    );
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const imageUrl = await uploadImage.mutateAsync(file);

      // If creating profile, set form value
      if (!profile) {
        setCreateValue('profileImageUrl', imageUrl);
      } else {
        // If updating profile, call update endpoint
        await updateProfileImage.mutateAsync(imageUrl);
        showSuccess('Profile image updated successfully!');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showError(`Failed to upload image: ${error.message || 'Unknown error'}`);
      setProfileImagePreview(null);
    }
  };

  const { register: registerLocation, handleSubmit: handleSubmitLocation, reset: resetLocation, setValue: setLocationValue } = useForm<any>();
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const { register: registerLanguages, handleSubmit: handleSubmitLanguages, reset: resetLanguages } = useForm<LanguagesFormData>();
  const { register: registerTags, handleSubmit: handleSubmitTags, reset: resetTags } = useForm<TagsFormData>();
  const { register: registerCapabilities, handleSubmit: handleSubmitCapabilities } = useForm<UpdateCapabilitiesRequest>();
  const { register: registerSocial, handleSubmit: handleSubmitSocial, reset: resetSocial } = useForm<SocialLinksFormData>();

  const onCreateProfile = (data: CreateTalentProfileRequest) => {
    console.log('Create profile called with data:', data);
    createProfile.mutate(data, {
      onError: (error: any) => {
        console.error('Create profile error:', error);
        showError(`Failed to create profile: ${error.message || 'Unknown error'}`);
      },
      onSuccess: (profile) => {
        console.log('Profile created successfully:', profile);
        showSuccess('Profile created successfully! Welcome to Castify!');
      }
    });
  };

  const onUpdatePrimaryLocation = (data: any) => {
    const locationData: UpdatePrimaryLocationRequest = {
      primaryLocation: {
        city: data.city,
        country: data.country,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      }
    };

    updatePrimaryLocation.mutate(locationData, {
      onSuccess: () => {
        setEditingSection(null);
        showSuccess('Primary location updated successfully!');
      },
      onError: () => showError('Failed to update primary location'),
    });
  };

  const handleAddGeoArea = () => {
    if (!newGeoAreaCity.trim() || !newGeoAreaCountry.trim()) {
      showError('Please enter both city and country');
      return;
    }

    addGeoArea.mutate(
      {
        city: newGeoAreaCity.trim(),
        country: newGeoAreaCountry.trim(),
        isPrimary: false,
      },
      {
        onSuccess: () => {
          setNewGeoAreaCity('');
          setNewGeoAreaCountry('');
          showSuccess('Service area added successfully!');
        },
        onError: (error: any) => {
          showError(`Failed to add location: ${error.message || 'Unknown error'}`);
        },
      }
    );
  };

  const handleRemoveGeoArea = (city: string, country: string) => {
    if (!confirm(`Remove ${city}, ${country} from service areas?`)) {
      return;
    }

    removeGeoArea.mutate({ city, country }, {
      onSuccess: () => showSuccess('Service area removed successfully!'),
      onError: () => showError('Failed to remove service area'),
    });
  };

  const onUpdateLanguages = (data: LanguagesFormData) => {
    const languages = data.languages.split(',').map((l: string) => l.trim()).filter(Boolean);
    updateLanguages.mutate({ languages }, {
      onSuccess: () => {
        setEditingSection(null);
        showSuccess('Languages updated successfully!');
      },
      onError: () => showError('Failed to update languages'),
    });
  };

  const onUpdateTags = (data: TagsFormData) => {
    const tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    updateTags.mutate({ tags }, {
      onSuccess: () => {
        setEditingSection(null);
        showSuccess('Tags updated successfully!');
      },
      onError: () => showError('Failed to update tags'),
    });
  };

  const onUpdateCapabilities = (data: UpdateCapabilitiesRequest) => {
    updateCapabilities.mutate(data, {
      onSuccess: () => {
        setEditingSection(null);
        showSuccess('Capabilities updated successfully!');
      },
      onError: () => showError('Failed to update capabilities'),
    });
  };

  const onUpdateSocialLinks = (data: SocialLinksFormData) => {
    // Transform form data to SocialLink array
    const socialLinks = [];

    if (data.instagramUrl) {
      socialLinks.push({ platform: 'Instagram', url: data.instagramUrl, followerCount: null });
    }
    if (data.twitterUrl) {
      socialLinks.push({ platform: 'Twitter', url: data.twitterUrl, followerCount: null });
    }
    if (data.linkedinUrl) {
      socialLinks.push({ platform: 'LinkedIn', url: data.linkedinUrl, followerCount: null });
    }
    if (data.websiteUrl) {
      socialLinks.push({ platform: 'Website', url: data.websiteUrl, followerCount: null });
    }

    updateSocialLinks.mutate({ socialLinks }, {
      onSuccess: () => {
        setEditingSection(null);
        showSuccess('Social links updated successfully!');
      },
      onError: () => showError('Failed to update social links'),
    });
  };

  // Portfolio handlers
  const handlePortfolioUpload = async (file: File, metadata: MediaUploadMetadata) => {
    try {
      await uploadAndAddToPortfolio.mutateAsync({
        file,
        mediaType: metadata.mediaType,
        contentType: metadata.contentType,
        title: metadata.title,
        description: metadata.description,
        displayOrder: portfolioItems.length,
      });
      setShowMediaUpload(false);
      showSuccess('Media added to portfolio successfully!');
    } catch (error: any) {
      console.error('Error uploading media:', error);
      showError(`Failed to upload media: ${error.message || 'Unknown error'}`);
    }
  };

  const handlePortfolioRemove = async (portfolioItemId: string) => {
    try {
      await removeFromPortfolio.mutateAsync(portfolioItemId);
      showSuccess('Portfolio item removed successfully!');
    } catch (error: any) {
      console.error('Error removing portfolio item:', error);
      showError(`Failed to remove item: ${error.message || 'Unknown error'}`);
    }
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

  const captureCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Set coordinates
        setLocationValue('latitude', latitude);
        setLocationValue('longitude', longitude);

        // Try to reverse geocode using a free API
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();

          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
            const country = data.address.country || '';

            setLocationValue('city', city);
            setLocationValue('country', country);
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
        } finally {
          setIsCapturingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter it manually.');
        setIsCapturingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent shadow-lg"></div>
          <p className="text-slate-600 mt-6 text-lg font-medium">Loading your profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !profile) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create Your Talent Profile
              </CardTitle>
              <p className="text-slate-600 mt-2">Let's set up your profile to get discovered by clients</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                console.log('Form submit event triggered');
                handleSubmitCreate(onCreateProfile)(e);
              }} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input {...registerCreate('fullName')} placeholder="John Doe" className="mt-1 h-11" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Bio</label>
                  <textarea
                    {...registerCreate('bio')}
                    className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Tell clients about your experience, skills, and what makes you unique..."
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={captureCreateLocation}
                    disabled={isCapturingCreateLocation}
                    className="w-full mb-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
                  >
                    {isCapturingCreateLocation ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Use Current Location
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="hidden" {...registerCreate('locationMode')} value={LocationMode.SPECIFIC} />
                  <input type="hidden" {...registerCreate('primaryLocation.latitude')} />
                  <input type="hidden" {...registerCreate('primaryLocation.longitude')} />
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Primary City</label>
                    <Input {...registerCreate('primaryLocation.city')} placeholder="Belgrade" className="mt-1 h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <Input {...registerCreate('primaryLocation.country')} placeholder="Serbia" className="mt-1 h-11" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Your primary city is where you're based. You'll be able to add additional service areas after creating your profile.</p>

                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Profile Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <input type="hidden" {...registerCreate('profileImageUrl')} />

                  <div className="flex items-center gap-4">
                    {profileImagePreview ? (
                      <div className="relative">
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfileImagePreview(null);
                            setCreateValue('profileImageUrl', '');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadImage.isPending}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      {uploadImage.isPending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {profileImagePreview ? 'Change Image' : 'Upload Image'}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, GIF</p>
                </div>

                <Button type="submit" disabled={createProfile.isPending} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg">
                  {createProfile.isPending ? 'Creating...' : 'Create Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex items-start gap-6 -mt-16">
              <div className="relative">
                <div className="relative group">
                  {profile.profileImageUrl ? (
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">{profile.fullName.charAt(0)}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImage.isPending}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadImage.isPending ? (
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadImage.isPending}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors"
                >
                  {uploadImage.isPending ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex-1 pt-16">
                <h1 className="text-3xl font-bold text-slate-900">{profile.fullName}</h1>
                {profile.primaryLocation && (
                  <p className="text-slate-600 flex items-center gap-1 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.primaryLocation.city}, {profile.primaryLocation.country}
                  </p>
                )}
                {profile.geoAreas && profile.geoAreas.length > 0 && (
                  <p className="text-sm text-slate-500 mt-1">
                    Service areas: {profile.geoAreas.map(area => `${area.city}, ${area.country}`).join(' • ')}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold shadow-md">
                    {profile.verificationStatus}
                  </span>
                  {profile.tier && (
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${
                      profile.tier === 'PREMIUM' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
                      profile.tier === 'GOLD' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                      profile.tier === 'SILVER' ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' :
                      'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                    }`}>
                      {profile.tier} TIER
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completeness Indicator */}
            {statistics && (
              <div className="mt-6 px-6 pb-6 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Profile Completeness</span>
                  <span className="text-sm font-bold text-slate-900">{statistics.engagementMetrics.profileCompleteness}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      statistics.engagementMetrics.profileCompleteness >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      statistics.engagementMetrics.profileCompleteness >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      statistics.engagementMetrics.profileCompleteness >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${statistics.engagementMetrics.profileCompleteness}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {statistics.engagementMetrics.profileCompleteness < 100 &&
                    'Complete your profile to increase visibility and attract more opportunities!'}
                  {statistics.engagementMetrics.profileCompleteness === 100 &&
                    '✨ Perfect! Your profile is complete.'}
                </p>
              </div>
            )}

            {profile.bio && (
              <div className="mt-6 pl-6">
                <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Primary Location Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Primary Location
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingSection === 'primaryLocation') {
                    setEditingSection(null);
                  } else {
                    if (profile.primaryLocation) {
                      resetLocation({
                        city: profile.primaryLocation.city || '',
                        country: profile.primaryLocation.country || '',
                        latitude: profile.primaryLocation.latitude || '',
                        longitude: profile.primaryLocation.longitude || '',
                      });
                    }
                    setEditingSection('primaryLocation');
                  }
                }}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {editingSection === 'primaryLocation' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'primaryLocation' ? (
              <form onSubmit={handleSubmitLocation(onUpdatePrimaryLocation)} className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-600">Your primary location (where you're based)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={captureCurrentLocation}
                    disabled={isCapturingLocation}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    {isCapturingLocation ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Locating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Use Current Location
                      </span>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">City</label>
                    <Input {...registerLocation('city')} className="mt-1 h-10" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Country</label>
                    <Input {...registerLocation('country')} className="mt-1 h-10" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Latitude</label>
                    <Input {...registerLocation('latitude')} type="number" step="any" className="mt-1 h-10" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Longitude</label>
                    <Input {...registerLocation('longitude')} type="number" step="any" className="mt-1 h-10" required />
                  </div>
                </div>
                <Button type="submit" disabled={updatePrimaryLocation.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {updatePrimaryLocation.isPending ? 'Saving...' : 'Save Primary Location'}
                </Button>
              </form>
            ) : (
              <div className="space-y-2">
                {profile.primaryLocation ? (
                  <>
                    <p className="text-slate-700">
                      {profile.primaryLocation.city}, {profile.primaryLocation.country}
                    </p>
                    <p className="text-sm text-slate-500">
                      Coordinates: {profile.primaryLocation.latitude.toFixed(4)}, {profile.primaryLocation.longitude.toFixed(4)}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">No primary location set</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Areas Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Service Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              List all cities where you're available for work. Agencies will see these locations when searching for talent.
            </p>

            {/* Current GEO Areas */}
            {profile.geoAreas && profile.geoAreas.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Current Service Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.geoAreas.map((area) => (
                    <div
                      key={`${area.city}-${area.country}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        area.isPrimary
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{area.city}, {area.country}</span>
                      {area.isPrimary && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Primary</span>
                      )}
                      {!area.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGeoArea(area.city, area.country)}
                          disabled={removeGeoArea.isPending}
                          className="hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New GEO Area */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add New Service Area:</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="City (e.g., Novi Sad)"
                  value={newGeoAreaCity}
                  onChange={(e) => setNewGeoAreaCity(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Country (e.g., Serbia)"
                  value={newGeoAreaCountry}
                  onChange={(e) => setNewGeoAreaCountry(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddGeoArea}
                  disabled={addGeoArea.isPending || !newGeoAreaCity.trim() || !newGeoAreaCountry.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {addGeoArea.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Example: Belgrade, Serbia • Novi Sad, Serbia • Sombor, Serbia</p>
            </div>
          </CardContent>
        </Card>

        {/* Languages Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Languages
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingSection === 'languages') {
                    setEditingSection(null);
                  } else {
                    resetLanguages({ languages: (profile.languages || []).join(', ') });
                    setEditingSection('languages');
                  }
                }}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {editingSection === 'languages' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'languages' ? (
              <form onSubmit={handleSubmitLanguages(onUpdateLanguages)} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Languages (comma separated)</label>
                  <Input {...registerLanguages('languages')} placeholder="English, Spanish, French" className="mt-1 h-10" />
                </div>
                <Button type="submit" disabled={updateLanguages.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {updateLanguages.isPending ? 'Saving...' : 'Save'}
                </Button>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.languages.length > 0 ? (
                  profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-sm"
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">No languages added</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tags & Specialties
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingSection === 'tags') {
                    setEditingSection(null);
                  } else {
                    resetTags({ tags: (profile.tags || []).join(', ') });
                    setEditingSection('tags');
                  }
                }}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {editingSection === 'tags' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'tags' ? (
              <form onSubmit={handleSubmitTags(onUpdateTags)} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Tags (comma separated)</label>
                  <Input
                    {...registerTags('tags')}
                    placeholder="Commercial Acting, Horror Films, Product Modeling"
                    className="mt-1 h-10"
                  />
                  <p className="text-xs text-slate-500 mt-1">Add searchable keywords that describe your skills and specialties</p>
                </div>
                <Button type="submit" disabled={updateTags.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {updateTags.isPending ? 'Saving...' : 'Save'}
                </Button>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.tags && profile.tags.length > 0 ? (
                  profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">No tags added yet. Add tags to improve searchability!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Capabilities Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Capabilities
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSection(editingSection === 'capabilities' ? null : 'capabilities')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {editingSection === 'capabilities' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'capabilities' ? (
              <form onSubmit={handleSubmitCapabilities(onUpdateCapabilities)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Acting', 'Voiceover', 'Modeling', 'Singing', 'Dancing', 'Hosting'].map((capability) => {
                    const key = `canDo${capability}` as keyof UpdateCapabilitiesRequest;
                    return (
                      <label key={capability} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <input
                          type="checkbox"
                          {...registerCapabilities(key)}
                          defaultChecked={Boolean(profile.capabilities[key])}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{capability}</span>
                      </label>
                    );
                  })}
                </div>
                <Button type="submit" disabled={updateCapabilities.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {updateCapabilities.isPending ? 'Saving...' : 'Save'}
                </Button>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[
                  profile.capabilities.canDoActing && 'Acting',
                  profile.capabilities.canDoVoiceover && 'Voiceover',
                  profile.capabilities.canDoModeling && 'Modeling',
                  profile.capabilities.canDoSinging && 'Singing',
                  profile.capabilities.canDoDancing && 'Dancing',
                  profile.capabilities.canDoHosting && 'Hosting',
                ]
                  .filter(Boolean)
                  .map((capability) => (
                    <span
                      key={capability as string}
                      className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {capability}
                    </span>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Social Links
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editingSection === 'social') {
                    setEditingSection(null);
                  } else {
                    const instagram = profile.socialLinks?.find(sl => sl.platform === 'Instagram');
                    const twitter = profile.socialLinks?.find(sl => sl.platform === 'Twitter');
                    const linkedin = profile.socialLinks?.find(sl => sl.platform === 'LinkedIn');
                    const website = profile.socialLinks?.find(sl => sl.platform === 'Website');

                    resetSocial({
                      instagramUrl: instagram?.url || '',
                      twitterUrl: twitter?.url || '',
                      linkedinUrl: linkedin?.url || '',
                      websiteUrl: website?.url || '',
                    });
                    setEditingSection('social');
                  }
                }}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {editingSection === 'social' ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === 'social' ? (
              <form onSubmit={handleSubmitSocial(onUpdateSocialLinks)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Instagram</label>
                    <Input {...registerSocial('instagramUrl')} placeholder="https://instagram.com/..." className="mt-1 h-10" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Twitter</label>
                    <Input {...registerSocial('twitterUrl')} placeholder="https://twitter.com/..." className="mt-1 h-10" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">LinkedIn</label>
                    <Input {...registerSocial('linkedinUrl')} placeholder="https://linkedin.com/..." className="mt-1 h-10" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Website</label>
                    <Input {...registerSocial('websiteUrl')} placeholder="https://..." className="mt-1 h-10" />
                  </div>
                </div>
                <Button type="submit" disabled={updateSocialLinks.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {updateSocialLinks.isPending ? 'Saving...' : 'Save'}
                </Button>
              </form>
            ) : (
              <div className="space-y-2">
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      {link.platform === 'Instagram' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                      {link.platform === 'Twitter' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      )}
                      {link.platform === 'LinkedIn' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {link.platform === 'Website' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      )}
                      {link.platform}
                    </a>
                  ))
                ) : (
                  <p className="text-slate-500">No social links added</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Portfolio
              </CardTitle>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {showMediaUpload ? 'Cancel' : 'Add Media'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showMediaUpload ? (
              <div className="mb-6">
                <MediaUpload onFileSelect={handlePortfolioUpload} />
                {uploadAndAddToPortfolio.isPending && (
                  <div className="mt-4 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="text-slate-600 mt-2">Uploading media...</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {isLoadingPortfolio ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="text-slate-600 mt-4">Loading portfolio...</p>
                  </div>
                ) : (
                  <PortfolioGallery
                    items={portfolioItems}
                    onItemClick={handleMediaItemClick}
                    onItemRemove={handlePortfolioRemove}
                    isOwner={true}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
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
    </MainLayout>
  );
};
