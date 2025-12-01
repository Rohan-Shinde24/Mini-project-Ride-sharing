import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, User, Filter } from 'lucide-react';

const RideManagement = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, completed

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/rides', {
          headers: { 'auth-token': token }
        });
        setRides(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const getStatus = (date) => {
    return new Date(date) > new Date() ? 'Upcoming' : 'Completed';
  };

  const filteredRides = rides.filter(ride => {
    const matchesSearch = 
      ride.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.host?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStatus(ride.date);
    const matchesFilter = filterStatus === 'all' || status.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <div>Loading rides...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ride Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search rides..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRides.map(ride => (
              <tr key={ride._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{ride.host?.name || 'Unknown Host'}</div>
                      <div className="text-sm text-gray-500">{ride.host?.email || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    {ride.from} <span className="mx-2 text-gray-400">→</span> {ride.to}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(ride.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{ride.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{ride.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ride.seatsAvailable} / {ride.seats}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    getStatus(ride.date) === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatus(ride.date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RideManagement;
