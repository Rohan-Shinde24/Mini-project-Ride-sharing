import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Star, MapPin } from 'lucide-react';

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/profile/${userId}`);
      setProfile(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
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
      <div className="max-w-2xl mx-auto text-center py-10">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Public Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-medium text-slate-900">{profile.name}</p>
              </div>
            </div>

            {profile.address && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{profile.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <Star className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="font-medium text-slate-900">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-3xl font-bold text-emerald-600">
                {profile.rating.toFixed(1)}
              </p>
              <p className="text-sm text-slate-600">Rating</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{profile.totalRatings}</p>
              <p className="text-sm text-slate-600">Total Ratings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfile;
