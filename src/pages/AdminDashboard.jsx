import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { statsAPI, userAPI, assessmentAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';

const mockData = [
  { name: 'Students', value: 25 },
  { name: 'Instructors', value: 5 },
  { name: 'Assessments', value: 12 },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsAPI.getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-green-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Students</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalStudents || 0}</p>
            </div>
            <BookOpen className="text-green-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Instructors</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalInstructors || 0}</p>
            </div>
            <FileText className="text-purple-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Assessments</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalAssessments || 0}</p>
            </div>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Analytics */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">System Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" onClick={() => window.location.href = '/admin/user-management'} className="w-full justify-start">
              Manage Users
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/assessment-oversight'} className="w-full justify-start">
              Assessment Oversight
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/logs'} className="w-full justify-start">
              View Logs
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Database</p>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">API Server</p>
              <Badge variant="success">Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">System Load</p>
              <Badge variant="success">Normal</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
