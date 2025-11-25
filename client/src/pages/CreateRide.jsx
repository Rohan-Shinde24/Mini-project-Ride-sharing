import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createRideSchema } from '../utils/validation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import RideMap from '../components/map/RideMap';

const CreateRide = () => {
  const navigate = useNavigate();
  const [mapState, setMapState] = useState({
    source: null,
    destination: null
  });
  const [profileLoading, setProfileLoading] = useState(true);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createRideSchema),
  });

  // Fetch user profile and auto-fill phone number
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        if (res.data.phone) {
          setValue('phone', res.data.phone);
        }
        setProfileLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  // Watch inputs for geocoding (simulated)
  const sourceValue = watch('from');
  const destValue = watch('to');

  // Geocoding function using Nominatim API
  const geocodeLocation = async (locationName) => {
    if (!locationName || locationName.length < 3) return null;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)},India&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          name: locationName,
          coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Geocode source location
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (sourceValue && sourceValue.length > 3) {
        const result = await geocodeLocation(sourceValue);
        if (result) {
          setMapState(prev => ({ ...prev, source: result }));
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [sourceValue]);

  // Geocode destination location
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (destValue && destValue.length > 3) {
        const result = await geocodeLocation(destValue);
        if (result) {
          setMapState(prev => ({ ...prev, destination: result }));
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [destValue]);

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/rides', data);
      alert('Ride created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create ride', error);
      alert(error.response?.data?.message || 'Failed to create ride. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      {/* Form Section */}
      <div className="overflow-y-auto pr-2">
        <Card>
          <CardHeader>
            <CardTitle>Offer a Ride</CardTitle>
            <p className="text-sm text-slate-500">Share your journey and save money.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="From"
                  placeholder="City or Address"
                  error={errors.from?.message}
                  {...register('from')}
                />
                <Input
                  label="To"
                  placeholder="City or Address"
                  error={errors.to?.message}
                  {...register('to')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  error={errors.date?.message}
                  {...register('date')}
                />
                <Input
                  label="Time"
                  type="time"
                  error={errors.time?.message}
                  {...register('time')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Price per Seat (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <Input
                  label="Available Seats"
                  type="number"
                  min="1"
                  max="8"
                  error={errors.seats?.message}
                  {...register('seats')}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="10-digit mobile number"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add details about your ride (e.g., no pets, music preference)"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-red-500">{errors.description.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Publish Ride
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="h-[400px] lg:h-auto bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
        <RideMap source={mapState.source} destination={mapState.destination} />
      </div>
    </div>
  );
};

export default CreateRide;
