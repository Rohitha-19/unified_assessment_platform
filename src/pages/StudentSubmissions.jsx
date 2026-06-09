import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { submissionAPI } from '../utils/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await submissionAPI.getAll();
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">My Submissions</h1>
        <p className="text-gray-400">View your assessment submissions and feedback</p>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card key={submission.id} hover className="cursor-pointer">
            <button
              onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center justify-between flex-1">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">Assessment #{submission.assessment_id}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {submission.status === 'evaluated' && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="text-2xl font-bold text-white">{submission.score}%</p>
                    </div>
                  )}
                  <Badge variant={submission.status === 'evaluated' ? 'success' : 'warning'}>
                    {submission.status === 'evaluated' ? 'Evaluated' : 'Pending'}
                  </Badge>
                  {expandedId === submission.id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
            </button>

            {expandedId === submission.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                {submission.status === 'evaluated' && submission.feedback && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Feedback</p>
                      <p className="text-white bg-gray-800 p-3 rounded-lg">{submission.feedback}</p>
                    </div>
                    {submission.evaluatedAt && (
                      <p className="text-xs text-gray-500">
                        Evaluated on {new Date(submission.evaluatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </Card>
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
