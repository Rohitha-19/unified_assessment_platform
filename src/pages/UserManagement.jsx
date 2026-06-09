import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Modal, Select } from '../components/UI';
import { userAPI } from '../utils/api';
import { Trash2, Plus, Search } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userAPI.getAll();
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill all fields');
      return;
    }

    setIsAdding(true);
    try {
      await userAPI.create(newUser);
      const res = await userAPI.getAll();
      setUsers(res.data);
      setFilteredUsers(res.data);
      setNewUser({ name: '', email: '', password: '', role: 'student' });
      setShowAddModal(false);
      alert('User created successfully');
    } catch (err) {
      console.error('Failed to create user', err);
      alert('Failed to create user');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userAPI.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage platform users</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="gap-2"
        >
          <Plus size={16} />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                <td className="py-4 px-4 text-gray-300">{user.email}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
        <div className="space-y-4">
          <Input
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="User name"
          />

          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="user@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
          />

          <Select
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'instructor', label: 'Instructor' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddUser}
              isLoading={isAdding}
              className="flex-1"
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
