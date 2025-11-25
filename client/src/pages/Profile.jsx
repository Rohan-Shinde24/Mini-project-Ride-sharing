import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { profileUpdateSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, Phone, MapPin, Star, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(profileUpdateSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      setProfile(res.data);
      reset({
        name: res.data.name,
        phone: res.data.phone || '',
        address: res.data.address || '',
        bio: res.data.bio || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      const res = await axios.put('/api/profile', data);
      setProfile(res.data);
      if (updateUser) {
        updateUser(res.data);
      }
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    reset({
      name: profile.name,
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-100">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(profile.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-700">
                  {profile.rating.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500">
                  ({profile.totalRatings} {profile.totalRatings === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
              {profile.bio && (
                <p className="text-slate-600 italic max-w-2xl">"{profile.bio}"</p>
              )}
            </div>

            {/* Edit Button */}
            {!editMode && (
              <Button
                onClick={() => setEditMode(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Name"
                placeholder="Your full name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email"
                value={profile.email}
                disabled
                className="bg-slate-100 cursor-not-allowed"
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="10-digit mobile number"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Input
                label="Address"
                placeholder="Your city or location"
                error={errors.address?.message}
                {...register('address')}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="text-sm font-medium text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  isLoading={updating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{profile.email}</p>
                </div>
              </div>

              {profile.phone && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{profile.phone}</p>
                  </div>
                </div>
              )}

              {profile.address && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">{profile.address}</p>
                  </div>
                </div>
              )}

              {!profile.phone && !profile.address && (
                <div className="text-center py-6 text-slate-500">
                  <p>Add more details to your profile by clicking "Edit Profile"</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
