import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    ridesOffered: [],
    requestsMade: [],
    requestsReceived: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/users/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError(error.response?.data || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.put(`/api/requests/${requestId}/status`, { status });
      // Refresh data
      const res = await axios.get('/api/users/dashboard');
      setData(res.data);
    } catch (error) {
      console.error("Failed to update request", error);
      alert("Failed to update request status");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Failed to Load Dashboard</h3>
        <p className="text-slate-600 mb-4">{typeof error === 'string' ? error : 'An error occurred'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate stats
  const ridesOfferedCount = data.ridesOffered?.length || 0;
  const totalRidesCount = (data.requestsMade?.length || 0) + ridesOfferedCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.name || user?.email || 'Traveler'}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rides Offered Card */}
        <Card className="border-none text-white shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Rides Offered</p>
              <h3 className="text-3xl font-bold mt-2">{ridesOfferedCount}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Car className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Total Rides Card */}
        <Card className="border-none text-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Rides</p>
              <h3 className="text-3xl font-bold mt-2">{totalRidesCount}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requests Received (For Drivers) */}
        <Card>
          <CardHeader>
            <CardTitle>Requests Received</CardTitle>
          </CardHeader>
          <CardContent>
            {!data.requestsReceived || data.requestsReceived.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No requests received yet.</p>
            ) : (
              <div className="space-y-4">
                {data.requestsReceived.map(req => (
                  <div key={req._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">{req.passenger?.name || 'Passenger'}</p>
                      <p className="text-sm text-slate-500">
                        {req.ride?.from} → {req.ride?.to}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {req.ride?.date ? new Date(req.ride.date).toLocaleDateString() : 'Date N/A'}
                      </p>
                      {req.seats && (
                        <p className="text-xs text-slate-600 mt-1">
                          Seats: {req.seats} | Phone: {req.phone || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleRequestAction(req._id, 'accepted')}
                            className="px-3 py-1 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRequestAction(req._id, 'rejected')}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 text-sm rounded capitalize ${
                          req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Requests (For Passengers) */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {!data.requestsMade || data.requestsMade.length === 0 ? (
              <p className="text-slate-500 text-center py-4">You haven't made any requests.</p>
            ) : (
              <div className="space-y-4">
                {data.requestsMade.map(req => (
                  <div key={req._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">
                        {req.ride?.from} → {req.ride?.to}
                      </p>
                      <p className="text-sm text-slate-500">
                        Host: {req.ride?.host?.name || 'Driver'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {req.ride?.date ? new Date(req.ride.date).toLocaleDateString() : 'Date N/A'}
                      </p>
                      {req.seats && (
                        <p className="text-xs text-slate-600 mt-1">
                          Seats requested: {req.seats}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={`px-3 py-1 text-sm rounded capitalize ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
