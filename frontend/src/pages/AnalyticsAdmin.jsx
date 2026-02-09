import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, AlertCircle, CheckCircle, Clock, 
  Activity 
} from 'lucide-react';
import { getAllUsers } from '../services/authApi';
import { getAllComplaints } from '../services/complaintApi';

const AnalyticsAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalComplaints: 0,
    totalUsers: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
    rejectedComplaints: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const complaintData = await getAllComplaints({ limit: 10000 });
      const userData = await getAllUsers();

      console.log('Complaint Data:', complaintData);
      console.log('User Data:', userData);

      const complaintsArray = complaintData?.data || [];
      const usersArray = userData?.data || [];

      setComplaints(complaintsArray);
      setUsers(usersArray);

      calculateAnalytics(complaintsArray, usersArray);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (complaintsData, usersData) => {
    const stats = {
      totalComplaints: complaintsData.length,
      totalUsers: usersData.length,
      pendingComplaints: complaintsData.filter(c => c.status?.toLowerCase() === 'pending').length,
      resolvedComplaints: complaintsData.filter(c => c.status?.toLowerCase() === 'resolved').length,
      inProgressComplaints: complaintsData.filter(c => c.status?.toLowerCase() === 'in progress').length,
      rejectedComplaints: complaintsData.filter(c => c.status?.toLowerCase() === 'rejected').length,
    };
    console.log('Calculated Analytics:', stats);
    setAnalytics(stats);
  };

  const getStatusDistribution = () => {
    const data = [
      { name: 'Pending', value: analytics.pendingComplaints, color: '#F59E0B' },
      { name: 'In Progress', value: analytics.inProgressComplaints, color: '#3B82F6' },
      { name: 'Resolved', value: analytics.resolvedComplaints, color: '#10B981' },
      { name: 'Rejected', value: analytics.rejectedComplaints, color: '#EF4444' },
    ];
    return data.filter(item => item.value > 0);
  };

  const getCategoryDistribution = () => {
    const categories = {};
    complaints.forEach(complaint => {
      const category = complaint.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name,
      value
    }));
  };

  const getPriorityDistribution = () => {
    const priorities = {};
    complaints.forEach(complaint => {
      const priority = complaint.priority || 'Normal';
      priorities[priority] = (priorities[priority] || 0) + 1;
    });
    
    return Object.entries(priorities).map(([name, value]) => ({
      name: name,
      value,
    }));
  };

  const getMonthlyTrend = () => {
    const monthlyData = {};
    
    complaints.forEach(complaint => {
      const date = new Date(complaint.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .slice(-6); 
  };

  const getUserGrowthTrend = () => {
    const monthlyData = {};
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, users]) => ({ month, users }))
      .slice(-6); 
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor = 'bg-white', iconBg = 'bg-gray-800' }) => (
    <div className={`${bgColor} border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Comprehensive overview of complaints and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={AlertCircle}
          title="Total Complaints"
          value={analytics.totalComplaints}
          subtitle="All time"
          bgColor="bg-white"
          iconBg="bg-blue-600"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={analytics.totalUsers}
          subtitle="Registered users"
          bgColor="bg-white"
          iconBg="bg-purple-600"
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={analytics.pendingComplaints}
          subtitle="Awaiting action"
          bgColor="bg-amber-50"
          iconBg="bg-amber-600"
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved"
          value={analytics.resolvedComplaints}
          subtitle="Successfully closed"
          bgColor="bg-green-50"
          iconBg="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Complaint Status Overview</h3>
            <Activity size={24} className="text-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
              <p className="text-sm font-semibold text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{analytics.inProgressComplaints}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
              <p className="text-sm font-semibold text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{analytics.rejectedComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Resolution Rate</h3>
            <TrendingUp size={24} className="text-green-600" />
          </div>
          <div className="flex items-end gap-4">
            <p className="text-5xl font-bold text-green-600">
              {analytics.totalComplaints > 0 
                ? Math.round((analytics.resolvedComplaints / analytics.totalComplaints) * 100)
                : 0}%
            </p>
            <p className="text-gray-600 mb-2">of complaints resolved</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Complaints by Status</h3>
          {getStatusDistribution().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <p>No complaint data available</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Complaints by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPriorityDistribution()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Complaints Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMonthlyTrend()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="Complaints"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">User Growth (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getUserGrowthTrend()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Complaints by Category</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={getCategoryDistribution()} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis dataKey="name" type="category" stroke="#6B7280" width={120} />
            <Tooltip 
              contentStyle={{ 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsAdmin;