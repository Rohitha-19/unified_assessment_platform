import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { submissionAPI, assessmentAPI } from '../utils/api';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EvaluateSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await submissionAPI.getAll();
        const pending = res.data.filter((s) => s.status === 'pending');
        setSubmissions(pending);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSelectSubmission = async (sub) => {
    setSelectedSubmission(sub);
    try {
      const res = await assessmentAPI.getById(sub.assessment_id);
      setAssessment(res.data);
      setScore(sub.score || '');
      setFeedback(sub.feedback || '');
    } catch (err) {
      console.error('Failed to fetch assessment', err);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!score || !feedback) {
      alert('Please fill score and feedback');
      return;
    }

    setIsEvaluating(true);
    try {
      await submissionAPI.update(selectedSubmission.id, {
        score: parseInt(score),
        feedback,
        status: 'evaluated',
      });

      setSubmissions(submissions.filter((s) => s.id !== selectedSubmission.id));
      setSelectedSubmission(null);
      setAssessment(null);
      alert('Evaluation submitted');
    } catch (err) {
      console.error('Failed to submit evaluation', err);
      alert('Failed to submit evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Evaluate Submissions</h1>
        <p className="text-gray-400">Review and grade student submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission List */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Pending Reviews ({submissions.length})</h3>
            <div className="space-y-2 max-h-96 scrollable">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedSubmission?.id === sub.id
                      ? 'bg-blue-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <p className="text-white font-medium">Assessment #{sub.assessment_id}</p>
                  <p className="text-xs text-gray-400">Student #{sub.student_id}</p>
                </button>
              ))}

              {submissions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending submissions</p>
              )}
            </div>
          </Card>
        </div>

        {/* Evaluation Panel */}
        <div className="lg:col-span-2">
          {selectedSubmission && assessment ? (
            <Card>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-4"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <h3 className="text-lg font-bold text-white mb-4">{assessment.title}</h3>

              {/* Answers */}
              <div className="mb-6 space-y-4">
                <p className="text-sm font-medium text-gray-400">Student Answers:</p>
                {selectedSubmission.answers.map((ans, idx) => {
                  const question = assessment.questions.find((q) => q.id === ans.questionId);
                  return (
                    <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-white font-medium text-sm">{question?.text}</p>
                      {question?.type === 'mcq' && (
                        <p className="text-blue-400 text-sm mt-1">{question?.options[ans.answer]}</p>
                      )}
                      {(question?.type === 'short' || question?.type === 'long') && (
                        <p className="text-gray-300 text-sm mt-1">{ans.answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Evaluation Form */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleSubmitEvaluation}
                  isLoading={isEvaluating}
                  className="w-full"
                >
                  Submit Evaluation
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-gray-400 text-center py-8">Select a submission to evaluate</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
