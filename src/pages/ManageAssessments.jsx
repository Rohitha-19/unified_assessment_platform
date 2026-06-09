import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { assessmentAPI } from '../utils/api';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ManageAssessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await assessmentAPI.getAll();
        setAssessments(res.data);
      } catch (err) {
        console.error('Failed to fetch assessments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      await assessmentAPI.delete(id);
      setAssessments(assessments.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete assessment', err);
      alert('Failed to delete assessment');
    }
  };

  const handleDuplicate = async (assessment) => {
    try {
      await assessmentAPI.create({
        ...assessment,
        title: `${assessment.title} (Copy)`,
      });
      const res = await assessmentAPI.getAll();
      setAssessments(res.data);
    } catch (err) {
      console.error('Failed to duplicate assessment', err);
      alert('Failed to duplicate assessment');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading assessments...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Manage Assessments</h1>
        <p className="text-gray-400">View and manage your created assessments</p>
      </div>

      {/* Table View */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Questions</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-gray-800 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{assessment.title}</td>
                <td className="py-4 px-4">
                  <Badge variant="secondary">{assessment.type}</Badge>
                </td>
                <td className="py-4 px-4 text-white">{assessment.totalQuestions}</td>
                <td className="py-4 px-4 text-white">{assessment.duration} min</td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/instructor/assessment/${assessment.id}`)}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(assessment)}
                      className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-400"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {assessments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No assessments yet</p>
          </div>
        )}
      </Card>
    </div>
  );
};
