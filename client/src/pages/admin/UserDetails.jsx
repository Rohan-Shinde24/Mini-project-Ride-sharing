import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Star, ArrowLeft, Car, Clock } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offered');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { 'auth-token': token }
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) return <div>Loading user details...</div>;
  if (!data) return <div>User not found</div>;

  const { user, ridesOffered, ridesTaken } = data;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/admin/users')}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
      </button>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-100 p-4 rounded-full">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  {user.role}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-600">{user.rating.toFixed(1)} ({user.totalRatings})</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex items-center text-gray-600">
            <Mail className="w-5 h-5 mr-3 text-slate-400" />
            {user.email}
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-3 text-slate-400" />
            {user.phone || 'No phone provided'}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 text-slate-400" />
            {user.address || 'No address provided'}
          </div>
        </div>

        {user.bio && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600 text-sm">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Rides History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('offered')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'offered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rides Offered ({ridesOffered.length})
            </button>
            <button
              onClick={() => setActiveTab('taken')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'taken'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rides Taken ({ridesTaken.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'offered' ? (
            <div className="space-y-4">
              {ridesOffered.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rides offered yet.</p>
              ) : (
                ridesOffered.map(ride => (
                  <div key={ride._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{ride.from} → {ride.to}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(ride.date).toLocaleDateString()} at {ride.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">₹{ride.price}</div>
                      <div className="text-xs text-gray-500">{ride.seatsAvailable} seats left</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {ridesTaken.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No rides taken yet.</p>
              ) : (
                ridesTaken.map(req => (
                  <div key={req._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{req.ride?.from} → {req.ride?.to}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <span className={`capitalize px-2 py-0.5 rounded-full text-xs ${
                            req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{req.seats} Seat(s)</div>
                      <div className="text-xs text-gray-500">Requested on {new Date(req.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
