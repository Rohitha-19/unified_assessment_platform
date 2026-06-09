import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Modal } from '../components/UI';
import { profileAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.get();
        setProfile(res.data);
        setEditData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await profileAPI.update(editData);
      setProfile(editData);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await profileAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      alert('Password changed successfully');
    } catch (err) {
      console.error('Failed to change password', err);
      alert('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editData?.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              value={editData?.email || ''}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Role</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white capitalize">
                {profile?.role}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveProfile}
              isLoading={isSaving}
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Account Settings */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>

          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
              className="w-full"
            >
              Change Password
            </Button>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-300">
                Last login: Just now
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />

          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
              isLoading={isSaving}
              className="flex-1"
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
