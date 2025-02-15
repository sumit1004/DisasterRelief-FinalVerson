import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Shield, Mail, Lock, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type UserType = 'volunteer' | 'victim' | 'management';
type FormType = 'login' | 'register';

interface FormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  volunteerType?: string;
  specialization?: string;
}

// Add volunteer categories and their specializations
const volunteerCategories = {
  'Government & Policy Roles': [
    'Disaster Management Officer',
    'Emergency Management Specialist',
    'Civil Defense Officer',
    'Urban Planner',
    'NDRF Officer',
    'RAF Officer',
    // ... other roles
  ],
  'Medical & Health Response Roles': [
    'Doctor (Emergency & Trauma)',
    'Disaster Medicine Specialist',
    'Paramedic',
    'Ambulance Driver',
    'Emergency Medical Technician',
    // ... other roles
  ],
  'First Responders & Search & Rescue Roles': [
    'Firefighter',
    'Police Officer',
    'Search and Rescue Specialist',
    'K9 Search and Rescue Handler',
    // ... other roles
  ],
  // ... add other categories
};

function LoginPage() {
  const [activeTab, setActiveTab] = useState<UserType>('volunteer');
  const [formType, setFormType] = useState<FormType>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'volunteer', label: 'Volunteer', icon: User },
    { id: 'victim', label: 'Victim', icon: Users },
    { id: 'management', label: 'Management', icon: Shield },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", {
      email: formData.email,
      password: formData.password,
      role: activeTab
    });
    
    if (formType === 'login') {
      try {
        const success = await login(formData.email, formData.password, activeTab);
        console.log("Login success:", success);
        if (success) {
          switch (activeTab) {
            case 'volunteer':
              navigate('/volunteer-dashboard');
              break;
            case 'victim':
              navigate('/victim-dashboard');
              break;
            case 'management':
              navigate('/management-dashboard');
              break;
          }
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    } else {
      console.log('Registration:', formData);
    }
  };

  // Update the form render to include volunteer type selection when registering as volunteer
  const renderVolunteerFields = () => {
    if (activeTab === 'volunteer' && formType === 'register') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Volunteer Category</label>
            <div className="mt-1 relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setFormData({ ...formData, volunteerType: e.target.value, specialization: '' });
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {Object.keys(volunteerCategories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <div className="mt-1 relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Specialization</option>
                  {volunteerCategories[selectedCategory as keyof typeof volunteerCategories].map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as UserType)}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 relative ${
                  activeTab === id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {activeTab === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${formType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  {formType === 'login' ? 'Sign In' : 'Create Account'} as {activeTab}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {formType === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {renderVolunteerFields()}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 relative">
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {formType === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="mt-1 relative">
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {formType === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {formType === 'login'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 