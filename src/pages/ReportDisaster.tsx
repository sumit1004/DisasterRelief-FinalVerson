import React, { useState } from 'react';
import { Camera, MapPin, AlertTriangle } from 'lucide-react';

// Add interface for form data
interface FormData {
  location: string;
  description: string;
  severity: 'critical' | 'moderate' | 'low';
  shareLocation: boolean;
}

function ReportDisaster() {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    description: '',
    severity: 'moderate',
    shareLocation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Report an Emergency</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter location or use GPS"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                  onClick={() => {/* Implement GPS location */}}
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description of Situation
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Describe the emergency situation..."
              />
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'critical' | 'moderate' | 'low' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="critical">Critical - Immediate assistance needed</option>
                <option value="moderate">Moderate - Urgent but not life-threatening</option>
                <option value="low">Low - Situation is under control</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images/Videos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  id="file-upload"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="mt-4 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  Select Files
                </button>
              </div>
            </div>

            {/* Location Sharing Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="shareLocation"
                checked={formData.shareLocation}
                onChange={(e) => setFormData({ ...formData, shareLocation: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="shareLocation" className="text-sm text-gray-700">
                Share my live location for faster assistance
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Submit Emergency Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportDisaster;