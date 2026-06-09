import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { statsAPI, assessmentAPI, submissionAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { name: 'Assessment 1', submissions: 12 },
  { name: 'Assessment 2', submissions: 8 },
  { name: 'Assessment 3', submissions: 15 },
  { name: 'Assessment 4', submissions: 10 },
];

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, assessRes] = await Promise.all([
          statsAPI.getInstructorStats(),
          assessmentAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setAssessments(assessRes.data);
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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Instructor Dashboard</h1>
          <p className="text-gray-400">Manage your assessments and reviews</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/instructor/create-assessment')}
          className="gap-2"
        >
          + Create Assessment
        </Button>
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

        <Card className="hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.pendingReviews || 0}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-green-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Evaluated</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.evaluatedSubmissions || 0}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Submissions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalSubmissions || 0}</p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Submission Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="submissions" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Your Assessments</h3>
        <div className="space-y-3">
          {assessments.slice(0, 5).map((assessment) => (
            <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div>
                <p className="text-white font-medium">{assessment.title}</p>
                <p className="text-xs text-gray-500">{assessment.totalQuestions} questions</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{assessment.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/instructor/manage-assessment/${assessment.id}`)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
