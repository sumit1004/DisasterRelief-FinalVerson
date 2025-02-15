import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function VictimDashboard() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'victim') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Victim Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Your Information</h2>
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Help Requests</h2>
              <div className="grid gap-4">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Medical Assistance</h3>
                  <p className="text-sm text-gray-600">Status: In Progress</p>
                  <p className="text-sm text-gray-600">Assigned Helper: Dr. John</p>
                </div>
                {/* Add more help requests */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VictimDashboard; 