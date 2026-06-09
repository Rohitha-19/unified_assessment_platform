import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../components/UI';

export const SignIn = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: 'student@test.com',
    password: 'password123',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signin(formData.email, formData.password);
      const redirects = {
        student: '/student/dashboard',
        instructor: '/instructor/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirects[res.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
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
          <h1 className="text-3xl font-bold text-white mb-2">Assessment Platform</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
          >
            Sign In
          </Button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-xs text-gray-400">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Student: student@test.com / password123</p>
          <p>Instructor: instructor@test.com / password123</p>
          <p>Admin: admin@test.com / password123</p>
        </div>
      </div>
    </div>
  );
};
