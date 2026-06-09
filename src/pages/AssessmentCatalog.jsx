import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Input } from '../components/UI';
import { assessmentAPI } from '../utils/api';
import { Search, Eye, Play } from 'lucide-react';

export const AssessmentCatalog = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await assessmentAPI.getAll();
        setAssessments(res.data);
        setFilteredAssessments(res.data);
      } catch (err) {
        console.error('Failed to fetch assessments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  useEffect(() => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter((a) => a.subject === selectedFilter);
    }

    setFilteredAssessments(filtered);
  }, [searchTerm, selectedFilter, assessments]);

  const subjects = ['all', ...new Set(assessments.map((a) => a.subject))];

  if (loading) {
    return <div className="text-center py-12">Loading assessments...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Assessment Catalog</h1>
        <p className="text-gray-400">Browse and start assessments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assessments..."
            className="pl-10"
          />
        </div>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject === 'all' ? 'All Subjects' : subject}
            </option>
          ))}
        </select>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} hover className="flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="primary">{assessment.subject}</Badge>
                <Badge variant="secondary">{assessment.type}</Badge>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{assessment.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{assessment.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>
                  <p className="text-gray-500">Questions</p>
                  <p className="font-bold text-white">{assessment.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-bold text-white">{assessment.duration} min</p>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/student/assessment/${assessment.id}`)}
                className="w-full gap-2"
              >
                <Play size={16} />
                Start Assessment
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No assessments found</p>
        </div>
      )}
    </div>
  );
};
