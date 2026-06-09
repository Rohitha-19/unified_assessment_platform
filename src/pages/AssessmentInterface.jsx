import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Modal } from '../components/UI';
import { assessmentAPI, submissionAPI } from '../utils/api';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';

export const AssessmentInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await assessmentAPI.getById(id);
        setAssessment(res.data);
        setTimeLeft(res.data.duration * 60);
        setAnswers(new Array(res.data.questions.length).fill(null));
      } catch (err) {
        console.error('Failed to fetch assessment', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submission = {
        assessment_id: parseInt(id),
        answers: assessment.questions.map((q, idx) => ({
          questionId: q.id,
          answer: answers[idx],
        })),
      };
      await submissionAPI.create(submission);
      navigate('/student/submissions');
    } catch (err) {
      console.error('Failed to submit', err);
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  if (loading || !assessment) {
    return <div className="text-center py-12">Loading assessment...</div>;
  }

  const question = assessment.questions[currentQuestion];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{assessment.title}</h1>
          <Badge variant="primary" className="mt-2">
            {currentQuestion + 1} / {assessment.questions.length}
          </Badge>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <Clock size={20} className="text-blue-400" />
          <div className="text-right">
            <p className="text-xs text-gray-400">Time Left</p>
            <p className={`text-xl font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-bold text-white mb-4">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {assessment.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-lg font-semibold transition-all ${
                    idx === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[idx] !== null
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Question Content */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-bold text-white mb-6">{question.text}</h3>

            {question.type === 'mcq' && (
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-500/50">
                    <input
                      type="radio"
                      name="mcq"
                      value={idx}
                      checked={answers[currentQuestion] === idx}
                      onChange={() => handleAnswerChange(question.id, idx)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-white">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'short' && (
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            )}

            {question.type === 'long' && (
              <textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your detailed answer here..."
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              {currentQuestion === assessment.questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setShowSubmitModal(true)}
                  className="flex-1 gap-2"
                >
                  Submit Assessment
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex-1 gap-2 ml-auto"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Assessment">
        <div className="space-y-4">
          <p className="text-gray-300">Are you sure you want to submit this assessment? You cannot make changes after submission.</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
