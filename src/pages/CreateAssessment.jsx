import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Modal, Badge } from '../components/UI';
import { assessmentAPI } from '../utils/api';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const CreateAssessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({ title: '', description: '', subject: '', type: 'quiz', duration: 30 });
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ type: 'mcq', text: '', options: ['', '', '', ''] });
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    if (!newQuestion.text) {
      alert('Please enter question text');
      return;
    }

    if (newQuestion.type === 'mcq') {
      if (newQuestion.options.some((o) => !o)) {
        alert('Please fill all MCQ options');
        return;
      }
      setQuestions([...questions, { ...newQuestion, id: questions.length + 1 }]);
    } else {
      setQuestions([...questions, { ...newQuestion, id: questions.length + 1 }]);
    }

    setNewQuestion({ type: 'mcq', text: '', options: ['', '', '', ''] });
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handlePublish = async () => {
    if (!basicInfo.title || !basicInfo.description || !basicInfo.subject) {
      alert('Please fill all required fields');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...basicInfo,
        questions: questions.map(({ id, ...q }) => q),
      };
      await assessmentAPI.create(payload);
      navigate('/instructor/manage-assessments');
    } catch (err) {
      console.error('Failed to create assessment', err);
      alert('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Create Assessment</h1>
        <p className="text-gray-400">Build a new assessment</p>
      </div>

      {/* Steps */}
      <div className="flex gap-4">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              step === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Step {s}
          </button>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              value={basicInfo.title}
              onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
              placeholder="Assessment title"
            />

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Description</label>
              <textarea
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                placeholder="Describe this assessment..."
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <Input
              label="Subject"
              value={basicInfo.subject}
              onChange={(e) => setBasicInfo({ ...basicInfo, subject: e.target.value })}
              placeholder="e.g., Web Development"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Type"
                value={basicInfo.type}
                onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                options={[
                  { value: 'quiz', label: 'Quiz' },
                  { value: 'exam', label: 'Exam' },
                  { value: 'assignment', label: 'Assignment' },
                ]}
              />

              <Input
                label="Duration (minutes)"
                type="number"
                value={basicInfo.duration}
                onChange={(e) => setBasicInfo({ ...basicInfo, duration: parseInt(e.target.value) })}
              />
            </div>

            <Button
              variant="primary"
              onClick={() => setStep(2)}
              className="w-full"
            >
              Next: Add Questions
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Add Question Form */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Add Question</h3>

            <div className="space-y-4">
              <Select
                label="Question Type"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value, options: e.target.value === 'mcq' ? ['', '', '', ''] : undefined })}
                options={[
                  { value: 'mcq', label: 'Multiple Choice' },
                  { value: 'short', label: 'Short Answer' },
                  { value: 'long', label: 'Long Answer' },
                ]}
              />

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter question..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {newQuestion.type === 'mcq' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Options</label>
                  {newQuestion.options.map((opt, idx) => (
                    <Input
                      key={idx}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        newOpts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleAddQuestion}
                className="w-full gap-2"
              >
                <Plus size={16} />
                Add Question
              </Button>
            </div>
          </Card>

          {/* Questions List */}
          <div className="space-y-3">
            {questions.map((q) => (
              <Card key={q.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      {q.type.toUpperCase()}
                    </Badge>
                    <p className="text-white font-medium">{q.text}</p>
                    {q.type === 'mcq' && (
                      <ul className="mt-2 space-y-1 text-sm text-gray-400">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>• {opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={questions.length === 0}
              className="flex-1"
            >
              Review & Publish
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Review Assessment</h3>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Title</p>
                <p className="text-white font-bold">{basicInfo.title}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Subject</p>
                <p className="text-white font-bold">{basicInfo.subject}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Type</p>
                <p className="text-white font-bold">{basicInfo.type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white font-bold">{basicInfo.duration} minutes</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Description</p>
              <p className="text-white">{basicInfo.description}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Total Questions</p>
              <p className="text-white font-bold">{questions.length}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handlePublish}
              isLoading={loading}
              className="flex-1"
            >
              Publish Assessment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
