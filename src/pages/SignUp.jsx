import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Select } from '../components/UI';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup(formData.name, formData.email, formData.password, formData.role);
      const redirects = {
        student: '/student/dashboard',
        instructor: '/instructor/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirects[res.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AP</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Assessment Platform</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a password"
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'instructor', label: 'Instructor' },
            ]}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
          >
            Create Account
          </Button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
