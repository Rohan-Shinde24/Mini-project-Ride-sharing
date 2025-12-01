import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const MyRides = () => {
  const [myRides, setMyRides] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-rides'); // 'my-rides', 'received', 'sent'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch rides created by user
      const ridesRes = await axios.get('/api/rides/my-rides');
      setMyRides(ridesRes.data);

      // Fetch booking requests received for user's rides
      const receivedRes = await axios.get('/api/requests/received');
      setReceivedRequests(receivedRes.data);

      // Fetch booking requests sent by user
      const sentRes = await axios.get('/api/requests/sent');
      setSentRequests(sentRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      if (action === 'cancelled') {
        if (!window.confirm('Are you sure you want to cancel this request?')) return;
        await axios.delete(`/api/requests/${requestId}`);
        alert('Request cancelled successfully');
      } else {
        await axios.put(`/api/requests/${requestId}/status`, { status: action });
        alert(`Request ${action}!`);
      }
      fetchData(); // Refresh data
    } catch (error) {
      alert(error.response?.data || `Failed to ${action} request`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      pending: <AlertCircle className="h-3 w-3" />,
      accepted: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Rides</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my-rides')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'my-rides'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          My Rides ({myRides.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'received'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Requests Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'sent'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          My Requests ({sentRequests.length})
        </button>
      </div>

      {/* My Rides Tab */}
      {activeTab === 'my-rides' && (
        <div className="space-y-4">
          {myRides.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No rides created yet</h3>
                <p className="text-slate-500 mt-1">Start by creating your first ride!</p>
              </CardContent>
            </Card>
          ) : (
            myRides.map((ride) => (
              <Card key={ride._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3 text-lg font-semibold">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          {ride.from}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          {ride.to}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {new Date(ride.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          {ride.time}
                        </div>
                        <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          {ride.seats} seats available
                        </div>
                      </div>
                      {ride.description && (
                        <p className="text-sm text-slate-600 italic">{ride.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-2xl font-bold text-emerald-600">₹{ride.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Received Requests Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No requests received</h3>
                <p className="text-slate-500 mt-1">Requests for your rides will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-400" />
                        <span className="font-semibold text-slate-900">
                          {request.passenger?.name || 'Unknown User'}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          {request.ride?.from}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          {request.ride?.to}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {new Date(request.ride?.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          {request.ride?.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleRequestAction(request._id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      )}
                      {(request.status === 'pending' || request.status === 'accepted') && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRequestAction(request._id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {request.status === 'accepted' ? 'Cancel Booking' : 'Reject'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Sent Requests Tab */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No requests sent</h3>
                <p className="text-slate-500 mt-1">Search for rides and request a seat!</p>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">
                          Request to {request.ride?.host?.name || request.ride?.driver?.name || 'Driver'}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          {request.ride?.from}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          {request.ride?.to}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-slate-400" />
                          {request.ride?.carModel} ({request.ride?.carType})
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {new Date(request.ride?.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          {request.ride?.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xl font-bold text-emerald-600">
                        ₹{request.ride?.price}
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRequestAction(request._id, 'cancelled')} // Reusing handleRequestAction but we need to modify it or create new handler
                        className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyRides;
