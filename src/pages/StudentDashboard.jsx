import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { statsAPI, assessmentAPI, submissionAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const mockData = [
  { name: 'React', score: 85 },
  { name: 'JS', score: 78 },
  { name: 'CSS', score: 92 },
  { name: 'Node', score: 88 },
];

export const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assessRes, subRes] = await Promise.all([
          statsAPI.getStudentStats(),
          assessmentAPI.getAll(),
          submissionAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setAssessments(assessRes.data);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Welcome back!</h1>
        <p className="text-gray-400">Track your assessments and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Assessments</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalAssessments || 0}</p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-green-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.averageScore || 0}%</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Evaluations</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.pendingEvaluations || 0}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.completedAssessments || 0}</p>
            </div>
            <CheckCircle className="text-emerald-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {submissions.slice(0, 5).map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Assessment #{sub.assessment_id}</p>
                <p className="text-xs text-gray-500">{new Date(sub.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {sub.status === 'evaluated' && <span className="text-green-400 font-bold">{sub.score}%</span>}
                <Badge variant={sub.status === 'evaluated' ? 'success' : 'warning'}>
                  {sub.status === 'evaluated' ? 'Evaluated' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
