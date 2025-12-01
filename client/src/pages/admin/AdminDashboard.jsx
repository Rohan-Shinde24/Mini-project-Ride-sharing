import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Car, UserCheck, UserX } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { 'auth-token': token }
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading stats...</div>;
  if (!stats) return <div>Error loading stats</div>;

  const roleData = stats.userRoles.map(role => ({
    name: role._id.charAt(0).toUpperCase() + role._id.slice(1),
    value: role.count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
        </Link>

        <Link to="/admin/rides-management" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Rides</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRides}</p>
          </div>
        </Link>
        
        {/* Placeholder for more stats */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Registrations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
