import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  volunteers, 
  teams, 
  getVolunteerStats, 
  filterVolunteers, 
  filterTeams 
} from '../data/volunteerData';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, X, MapPin, Calendar, Star, Activity } from 'lucide-react';

// Add this interface definition at the top of the file, after the imports
interface VolunteerDetailsModalProps {
  volunteer: typeof volunteers[0];
  team?: typeof teams[0];
  onClose: () => void;
}

function ManagementDashboard() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    status: '',
    availability: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [volunteersPerPage] = useState(10);
  const [filteredVolunteers, setFilteredVolunteers] = useState(volunteers);
  const [viewMode, setViewMode] = useState<'volunteers' | 'teams'>('volunteers');
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [selectedTeam, setSelectedTeam] = useState<typeof teams[0] | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<typeof volunteers[0] | null>(null);
  const [stats, setStats] = useState(getVolunteerStats());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    try {
      setIsLoading(true);
      if (volunteers.length > 0 && teams.length > 0) {
        setFilteredVolunteers(volunteers);
        setFilteredTeams(teams);
        setStats(getVolunteerStats());
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm || Object.values(filters).some(f => f !== '')) {
      setFilteredVolunteers(filterVolunteers({
        search: searchTerm,
        ...filters
      }));
      setCurrentPage(1);
    }
  }, [searchTerm, filters]);

  if (!user || user.role !== 'management') {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const indexOfLastVolunteer = currentPage * volunteersPerPage;
  const indexOfFirstVolunteer = indexOfLastVolunteer - volunteersPerPage;
  const currentVolunteers = filteredVolunteers.slice(indexOfFirstVolunteer, indexOfLastVolunteer);
  const totalPages = Math.ceil(filteredVolunteers.length / volunteersPerPage);

  const TeamDetailsModal = ({ team, onClose }: { team: typeof teams[0]; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
                <p className="text-sm text-gray-500">Team Leader: {team.leader}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                  Team Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`${
                    activeTab === 'tasks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                  Tasks & Responsibilities
                </button>
              </nav>
            </div>

            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Team Overview</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Location:</span> {team.location}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {team.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Total Members:</span> {team.members.length}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Specialization Distribution</h3>
                  <div className="space-y-1">
                    {Object.entries(team.specializations).map(([spec, count]) => (
                      <div key={spec} className="flex justify-between text-sm">
                        <span>{spec}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-auto max-h-[60vh]">
                <div className="grid gap-6">
                  {Object.entries(team.specializations).map(([specialization, count]) => (
                    <div key={specialization} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-3">{specialization} ({count})</h3>
                      <div className="space-y-4">
                        {team.members
                          .filter(member => member.specialization === specialization)
                          .map(member => (
                            <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                                  <p className="text-sm text-gray-500">{member.id}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  member.taskStatus === 'Completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {member.taskStatus}
                                </span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Current Task:</p>
                                <p className="text-sm text-gray-600">{member.currentTask}</p>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700">Assigned Responsibilities:</p>
                                <ul className="mt-1 space-y-1">
                                  {member.assignedTasks.map((task, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-center">
                                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2"></span>
                                      {task}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const VolunteerDetailsModal = ({ volunteer, team, onClose }: VolunteerDetailsModalProps) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{volunteer.name}</h2>
                <p className="text-sm text-gray-500">{volunteer.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{volunteer.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Joined: {volunteer.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Star className="h-5 w-5" />
                  <span>Rating: {volunteer.rating}⭐</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Activity className="h-5 w-5" />
                  <span>{volunteer.deployments} Deployments</span>
                </div>
              </div>

              {/* Status and Team */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Current Status</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    volunteer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </div>
                {team && (
                  <div className="space-y-2">
                    <p><span className="font-medium">Team:</span> {team.name}</p>
                    <p><span className="font-medium">Team Leader:</span> {team.leader}</p>
                    <p><span className="font-medium">Team Location:</span> {team.location}</p>
                  </div>
                )}
              </div>

              {/* Role and Tasks */}
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Role Information</h3>
                  <p><span className="font-medium">Category:</span> {volunteer.category}</p>
                  <p><span className="font-medium">Specialization:</span> {volunteer.specialization}</p>
                  <p><span className="font-medium">Availability:</span> {volunteer.availability}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Current Task</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-blue-900">{volunteer.currentTask}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        volunteer.taskStatus === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {volunteer.taskStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Assigned Responsibilities</h3>
                  <ul className="space-y-2">
                    {volunteer.assignedTasks.map((task, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {volunteer.email}</p>
                  <p><span className="font-medium">Phone:</span> {volunteer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Management Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Volunteers</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Active Volunteers</h3>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Currently Deployed</h3>
            <p className="text-2xl font-bold">{stats.deployed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Average Rating</h3>
            <p className="text-2xl font-bold">{stats.avgRating}⭐</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('volunteers')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'volunteers'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Volunteers
            </button>
            <button
              onClick={() => setViewMode('teams')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'teams'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Teams
            </button>
          </div>
        </div>

        {/* Teams View */}
        {viewMode === 'teams' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map(team => (
              <div key={team.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{team.name}</h3>
                    <p className="text-sm text-gray-500">Leader: {team.leader}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {team.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Location:</span> {team.location}</p>
                  <p className="text-sm"><span className="font-medium">Members:</span> {team.members.length}</p>
                  
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-1">Team Composition:</p>
                    {Object.entries(team.specializations).map(([spec, count]) => (
                      <div key={spec} className="text-xs text-gray-600 flex justify-between">
                        <span>{spec}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add View Details Button */}
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Team Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="pl-10 w-full p-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  className="p-2 border rounded-lg"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {Object.keys(stats.byCategory).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded-lg"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="">All Locations</option>
                  {Object.keys(stats.byLocation).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {volunteer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        const team = teams.find(t => t.members.some(m => m.id === volunteer.id));
                        setSelectedVolunteer({ ...volunteer, team });
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {volunteer.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {volunteer.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {volunteer.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${volunteer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      volunteer.status === 'Deployed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {volunteer.rating}⭐
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstVolunteer + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastVolunteer, filteredVolunteers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredVolunteers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {selectedTeam && (
          <TeamDetailsModal
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
          />
        )}

        {selectedVolunteer && (
          <VolunteerDetailsModal
            volunteer={selectedVolunteer}
            team={teams.find(t => t.members.some(m => m.id === selectedVolunteer.id))}
            onClose={() => setSelectedVolunteer(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ManagementDashboard; 