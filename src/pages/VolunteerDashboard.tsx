import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { X, MapPin, Calendar, Star, Activity, Bell, BellRing, AlertCircle, MessageSquare } from 'lucide-react';

// Add interface for team member
interface TeamMember {
  id: string;
  name: string;
  specialization: string;
  taskStatus: string;
  currentTask: string;
  assignedTasks: string[];
}

// Add interface for team details modal props
interface TeamDetailsModalProps {
  team: {
    name: string;
    leader: string;
    location: string;
    status: string;
    members: TeamMember[];
    specializations: Record<string, number>;
  };
  onClose: () => void;
}

// Add this interface after the existing interfaces
interface ContactModalProps {
  member: {
    id: number;
    name: string;
    role: string;
    specialization: string;
    email?: string;
    phone?: string;
    currentWork?: string;
  };
  onClose: () => void;
}

// Add these interfaces after the existing interfaces
interface TaskDetailsModalProps {
  task: {
    id: number;
    title: string;
    status: string;
    deadline: string;
    assignedTo: string[];
    description?: string;
    progress?: number;
    priority?: string;
    location?: string;
    milestones?: { title: string; status: string; date: string }[];
    recentUpdates?: { date: string; user: string; message: string; status: string }[];
  };
  onClose: () => void;
}

interface UpdateStatusModalProps {
  task: {
    id: number;
    title: string;
    status: string;
    deadline: string;
  };
  onClose: () => void;
  onUpdateStatus: (taskId: number, newStatus: string, comment: string) => void;
}

// Add this interface after the existing interfaces
interface DisasterResponseModalProps {
  disaster: {
    id: number;
    title: string;
    location: string;
    status: string;
    severity: string;
    description: string;
    requiredSkills: string[];
    currentResponders: number;
    requiredResponders: number;
    startDate: string;
    estimatedDuration: string;
    contactPerson: {
      name: string;
      role: string;
      phone: string;
    };
  };
  onClose: () => void;
  onRespond: (disasterId: number) => void;
}

// Add these new interfaces after the existing interfaces
interface SupplyRequest {
  id: number;
  type: 'Medical' | 'Food' | 'Equipment' | 'Other';
  itemName: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Delivered' | 'Rejected';
  requestDate: string;
  description?: string;
  location: string;
}

interface SupplyRequestModalProps {
  onClose: () => void;
  onSubmit: (request: Omit<SupplyRequest, 'id' | 'status' | 'requestDate'>) => void;
}

// Add these new interfaces after the existing interfaces
interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  isUrgent?: boolean;
}

interface TeamChatModalProps {
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string, isUrgent: boolean) => void;
  teamMembers: typeof teamData.members;
}

// Add these new interfaces after the existing interfaces
interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'update' | 'task' | 'chat';
  timestamp: string;
  isRead: boolean;
}

function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

  if (!user || user.role !== 'volunteer') {
    return <Navigate to="/login" />;
  }

  // Update the team data with more members
  const teamData = {
    teamName: "Emergency Response Team Alpha",
    teamLead: "John Doe",
    members: [
      { 
        id: 1, 
        name: "Sarah Wilson", 
        role: "Medical Expert", 
        specialization: "Emergency Medicine",
        phone: "+91 98765 43210",
        email: "sarah.wilson@response.org",
        currentWork: "Managing field hospital setup"
      },
      { 
        id: 2, 
        name: "Mike Chen", 
        role: "Logistics Coordinator", 
        specialization: "Supply Chain",
        phone: "+91 98765 43211",
        email: "mike.chen@response.org",
        currentWork: "Coordinating relief material distribution"
      },
      { 
        id: 3, 
        name: "Emma Rodriguez", 
        role: "Communications", 
        specialization: "Crisis Communication",
        phone: "+91 98765 43212",
        email: "emma.rodriguez@response.org",
        currentWork: "Managing public relations and updates"
      },
      { 
        id: 4, 
        name: "Dr. Raj Patel", 
        role: "Medical Specialist", 
        specialization: "Trauma Care",
        phone: "+91 98765 43213",
        email: "raj.patel@response.org",
        currentWork: "Trauma care coordination"
      },
      { 
        id: 5, 
        name: "Lisa Wong", 
        role: "Mental Health Expert", 
        specialization: "Psychological Support",
        phone: "+91 98765 43214",
        email: "lisa.wong@response.org",
        currentWork: "Providing psychological first aid"
      },
      { 
        id: 6, 
        name: "Alex Thompson", 
        role: "Technical Specialist", 
        specialization: "Infrastructure",
        phone: "+91 98765 43215",
        email: "alex.thompson@response.org",
        currentWork: "Assessing structural damage"
      },
      { 
        id: 7, 
        name: "Maria Garcia", 
        role: "Field Coordinator", 
        specialization: "Operations",
        phone: "+91 98765 43216",
        email: "maria.garcia@response.org",
        currentWork: "Coordinating ground operations"
      },
      { 
        id: 8, 
        name: "James Wilson", 
        role: "Safety Officer", 
        specialization: "Risk Management",
        phone: "+91 98765 43217",
        email: "james.wilson@response.org",
        currentWork: "Ensuring team safety protocols"
      },
      { 
        id: 9, 
        name: "Priya Sharma", 
        role: "Community Liaison", 
        specialization: "Local Coordination",
        phone: "+91 98765 43218",
        email: "priya.sharma@response.org",
        currentWork: "Coordinating with local authorities"
      },
      { 
        id: 10, 
        name: "David Kim", 
        role: "Resource Manager", 
        specialization: "Asset Management",
        phone: "+91 98765 43219",
        email: "david.kim@response.org",
        currentWork: "Managing equipment and resources"
      }
    ],
    currentTasks: [
      { 
        id: 1, 
        title: "Set up medical camp", 
        status: "In Progress", 
        deadline: "2024-03-25",
        assignedTo: ["Sarah Wilson", "Dr. Raj Patel"],
        description: "Establish a fully functional medical camp in the affected area with necessary equipment and supplies",
        progress: 65,
        priority: "High",
        location: "Dharavi, Mumbai",
        milestones: [
          { title: "Site selection", status: "Completed", date: "2024-03-20" },
          { title: "Equipment setup", status: "In Progress", date: "2024-03-22" },
          { title: "Staff deployment", status: "In Progress", date: "2024-03-23" },
          { title: "Supply chain setup", status: "Pending", date: "2024-03-24" }
        ],
        recentUpdates: [
          { 
            date: "2024-03-22 14:30",
            user: "Sarah Wilson",
            message: "Medical equipment installation in progress",
            status: "In Progress"
          },
          { 
            date: "2024-03-21 09:15",
            user: "Dr. Raj Patel",
            message: "Site preparation completed",
            status: "Completed"
          }
        ]
      },
      { 
        id: 2, 
        title: "Coordinate supply distribution", 
        status: "Pending", 
        deadline: "2024-03-26",
        assignedTo: ["Mike Chen", "David Kim"]
      },
      { 
        id: 3, 
        title: "Mental health support program", 
        status: "In Progress", 
        deadline: "2024-03-27",
        assignedTo: ["Lisa Wong", "Emma Rodriguez"]
      },
      { 
        id: 4, 
        title: "Infrastructure assessment", 
        status: "Pending", 
        deadline: "2024-03-28",
        assignedTo: ["Alex Thompson", "James Wilson"]
      },
      { 
        id: 5, 
        title: "Community outreach", 
        status: "In Progress", 
        deadline: "2024-03-29",
        assignedTo: ["Priya Sharma", "Maria Garcia"]
      }
    ]
  };

  const TeamDetailsModal = ({ team, onClose }: TeamDetailsModalProps) => {
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

  // Add state for showing/hiding team details modal
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  // Add this new modal component
  const ContactModal = ({ member, onClose }: ContactModalProps) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-sm text-gray-500">Team Member Details</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-500">{member.specialization}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                    <p className="text-sm text-gray-600">{member.phone || '+91 98765 43210'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                    <p className="text-sm text-gray-600">{member.email || `${member.name.toLowerCase().replace(' ', '.')}@example.com`}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Work</p>
                    <p className="text-sm text-gray-600">{member.currentWork || 'Coordinating relief efforts'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => window.location.href = `tel:${member.phone || '+919876543210'}`}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </button>
                <button 
                  onClick={() => window.location.href = `mailto:${member.email || `${member.name.toLowerCase().replace(' ', '.')}@example.com`}`}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add state for managing contact modal
  const [selectedContact, setSelectedContact] = useState<typeof teamData.members[0] | null>(null);

  // Add these new modal components
  const TaskDetailsModal = ({ task, onClose }: TaskDetailsModalProps) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'progress'>('overview');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                <p className="text-sm text-gray-500">Task Details</p>
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
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`${
                    activeTab === 'progress'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                  Progress & Updates
                </button>
              </nav>
            </div>

            {activeTab === 'overview' ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.status === 'In Progress' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-600">Due: {task.deadline}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {task.description || 'Detailed task description will be displayed here.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Assigned Team Members</h3>
                    <div className="mt-2 space-y-2">
                      {task.assignedTo.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {member.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Priority Level</h3>
                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded ${
                      task.priority === 'High' 
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.priority || 'Medium'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Location</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {task.location || 'Task location will be displayed here'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Overall Progress</h3>
                    <span className="text-sm font-medium text-blue-600">{task.progress}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${task.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Milestones</h3>
                  <div className="space-y-4">
                    {task.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.status === 'Completed' 
                            ? 'bg-green-100' 
                            : milestone.status === 'In Progress'
                            ? 'bg-yellow-100'
                            : 'bg-gray-100'
                        }`}>
                          <span className={`text-sm ${
                            milestone.status === 'Completed'
                              ? 'text-green-600'
                              : milestone.status === 'In Progress'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                          <p className="text-xs text-gray-500">{milestone.date}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          milestone.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : milestone.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Updates</h3>
                  <div className="space-y-4">
                    {task.recentUpdates?.map((update, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{update.user}</p>
                            <p className="text-xs text-gray-500">{update.date}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            update.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {update.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UpdateStatusModal = ({ task, onClose, onUpdateStatus }: UpdateStatusModalProps) => {
    const [newStatus, setNewStatus] = useState(task.status);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateStatus(task.id, newStatus, comment);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Update Task Status</h2>
                <p className="text-sm text-gray-500">{task.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Update Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a comment about this status update..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add these state variables
  const [selectedTask, setSelectedTask] = useState<typeof teamData.currentTasks[0] | null>(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  // Add this function to handle status updates
  const handleUpdateStatus = (taskId: number, newStatus: string, comment: string) => {
    // Here you would typically make an API call to update the task status
    console.log(`Updating task ${taskId} to ${newStatus} with comment: ${comment}`);
    // For now, we'll just update the local state
    const updatedTasks = teamData.currentTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    // You would need to implement the actual state update logic
  };

  // Add this new state
  const [selectedDisaster, setSelectedDisaster] = useState<{
    id: number;
    title: string;
    location: string;
    status: string;
    severity: string;
    description: string;
    requiredSkills: string[];
    currentResponders: number;
    requiredResponders: number;
    startDate: string;
    estimatedDuration: string;
    contactPerson: {
      name: string;
      role: string;
      phone: string;
    };
  } | null>(null);

  // Add this new modal component
  const DisasterResponseModal = ({ disaster, onClose, onRespond }: DisasterResponseModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleRespond = async () => {
      setIsSubmitting(true);
      try {
        await onRespond(disaster.id);
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error responding to disaster:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{disaster.title}</h2>
                <p className="text-sm text-gray-500">Disaster Response Details</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status and Severity */}
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`mt-1 inline-block px-2 py-1 text-sm font-medium rounded-full ${
                    disaster.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {disaster.status}
                  </span>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Severity</p>
                  <span className={`mt-1 inline-block px-2 py-1 text-sm font-medium rounded-full ${
                    disaster.severity === 'High' ? 'bg-red-100 text-red-800' 
                    : disaster.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}>
                    {disaster.severity}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600">{disaster.description}</p>
              </div>

              {/* Location and Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                  <p className="text-sm text-gray-600">{disaster.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Timeline</h3>
                  <p className="text-sm text-gray-600">Start: {disaster.startDate}</p>
                  <p className="text-sm text-gray-600">Duration: {disaster.estimatedDuration}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {disaster.requiredSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responders Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Responders</h3>
                  <span className="text-sm text-gray-600">
                    {disaster.currentResponders} / {disaster.requiredResponders}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${(disaster.currentResponders / disaster.requiredResponders) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Contact Person</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">{disaster.contactPerson.name}</p>
                  <p className="text-sm text-gray-600">{disaster.contactPerson.role}</p>
                  <p className="text-sm text-gray-600">{disaster.contactPerson.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleRespond}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 ${
                    isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Confirm Response'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Response Submitted</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your response has been recorded. The disaster response team will contact you shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add this function to handle disaster response
  const handleDisasterResponse = async (disasterId: number) => {
    // Here you would typically make an API call to register the volunteer's response
    console.log(`Volunteer responding to disaster ${disasterId}`);
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  // Add this new modal component before the return statement
  const SupplyRequestModal = ({ onClose, onSubmit }: SupplyRequestModalProps) => {
    const [formData, setFormData] = useState({
      type: 'Medical' as SupplyRequest['type'],
      itemName: '',
      quantity: 1,
      urgency: 'Medium' as SupplyRequest['urgency'],
      description: '',
      location: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Request Supplies</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as SupplyRequest['type'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Medical">Medical Supplies</option>
                  <option value="Food">Food & Water</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as SupplyRequest['urgency'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Additional details about the request..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add these state variables in the VolunteerDashboard component
  const [showSupplyRequestModal, setShowSupplyRequestModal] = useState(false);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>([
    {
      id: 1,
      type: 'Medical',
      itemName: 'First Aid Kits',
      quantity: 50,
      urgency: 'High',
      status: 'Pending',
      requestDate: '2024-03-22',
      description: 'Basic first aid kits for emergency response',
      location: 'Dharavi, Mumbai'
    },
    {
      id: 2,
      type: 'Food',
      itemName: 'Drinking Water',
      quantity: 1000,
      urgency: 'High',
      status: 'Approved',
      requestDate: '2024-03-22',
      description: '1L water bottles for displaced residents',
      location: 'Dharavi, Mumbai'
    }
  ]);

  // Add this function in the VolunteerDashboard component
  const handleSupplyRequest = (request: Omit<SupplyRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: SupplyRequest = {
      ...request,
      id: supplyRequests.length + 1,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setSupplyRequests([...supplyRequests, newRequest]);
  };

  // Add these state variables in the VolunteerDashboard component
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      senderId: 1,
      senderName: "Sarah Wilson",
      message: "Medical supplies have arrived at the base camp",
      timestamp: "2024-03-22 10:30",
      isUrgent: false
    },
    {
      id: 2,
      senderId: 2,
      senderName: "Mike Chen",
      message: "URGENT: Need additional volunteers at sector B for evacuation",
      timestamp: "2024-03-22 10:45",
      isUrgent: true
    }
  ]);

  // Add this new modal component before the return statement
  const TeamChatModal = ({ onClose, messages, onSendMessage, teamMembers }: TeamChatModalProps) => {
    const [newMessage, setNewMessage] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newMessage.trim()) {
        onSendMessage(newMessage, isUrgent);
        setNewMessage('');
        setIsUrgent(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Team Chat</h2>
              <p className="text-sm text-gray-500">{teamMembers.length} team members</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.isUrgent ? 'bg-red-50' : 'bg-gray-50'
                } rounded-lg p-3`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {msg.senderName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{msg.senderName}</p>
                      <p className="text-xs text-gray-500">{msg.timestamp}</p>
                    </div>
                  </div>
                  {msg.isUrgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-gray-700 ml-10">{msg.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                />
                <span className="text-sm text-gray-700">Mark as Urgent</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add these state variables in the VolunteerDashboard component
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Emergency Alert",
      message: "Flood warning issued for Dharavi area",
      type: "alert",
      timestamp: "2024-03-22 10:30",
      isRead: false
    },
    {
      id: 2,
      title: "Task Update",
      message: "Medical supplies delivery completed",
      type: "task",
      timestamp: "2024-03-22 11:15",
      isRead: false
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Add these functions in the VolunteerDashboard component
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Notifications Enabled', {
          body: 'You will now receive updates about emergencies and team activities',
          icon: '/notification-icon.png' // Add your notification icon
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const showNotification = (title: string, message: string) => {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/notification-icon.png' // Add your notification icon
      });
    }
  };

  // Add this component before the return statement
  const NotificationsPanel = ({ onClose }: { onClose: () => void }) => {
    const markAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const clearNotifications = () => {
      setNotifications([]);
    };

    return (
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
              <button
                onClick={clearNotifications}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${
                    notification.type === 'alert' ? 'bg-red-100' :
                    notification.type === 'task' ? 'bg-green-100' :
                    notification.type === 'chat' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {notification.type === 'alert' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : notification.type === 'task' ? (
                      <Activity className="h-4 w-4 text-green-600" />
                    ) : notification.type === 'chat' ? (
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Update the handleSendMessage function to show notifications for urgent messages
  const handleSendMessage = (message: string, isUrgent: boolean) => {
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      senderId: user.id,
      senderName: user.name,
      message,
      timestamp: new Date().toLocaleString(),
      isUrgent
    };
    setChatMessages([...chatMessages, newMessage]);

    // Show notification for urgent messages
    if (isUrgent) {
      showNotification('Urgent Team Message', `${user.name}: ${message}`);
      // Add to notifications panel
      const notification: Notification = {
        id: notifications.length + 1,
        title: 'Urgent Team Message',
        message: `${user.name}: ${message}`,
        type: 'chat',
        timestamp: new Date().toLocaleString(),
        isRead: false
      };
      setNotifications([notification, ...notifications]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-800 relative"
                >
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationsPanel onClose={() => setShowNotifications(false)} />
                )}
              </div>
              {notificationPermission === 'default' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <BellRing className="h-5 w-5" />
                  Enable Notifications
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Category:</span> {user.volunteerType}</p>
              <p><span className="font-medium">Specialization:</span> {user.specialization}</p>
            </div>

            {/* Team Information Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Team Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-lg mb-2">{teamData.teamName}</p>
                <p className="text-gray-600">Team Lead: {teamData.teamLead}</p>
                <button
                  onClick={() => setShowTeamDetails(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Team Details
                </button>
                <button
                  onClick={() => setShowTeamChat(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Team Chat
                </button>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <div className="grid gap-4">
                {teamData.members.map((member) => (
                  <div key={member.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.specialization}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedContact(member)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Tasks Section */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Team Tasks</h2>
              <div className="grid gap-4">
                {teamData.currentTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">Deadline: {task.deadline}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedTask(task);
                          setShowUpdateStatus(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Update Status
                      </button>
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Disasters Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Disasters</h2>
              <div className="grid gap-4">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Flood Relief - Mumbai</h3>
                  <p className="text-sm text-gray-600">Status: Active</p>
                  <button 
                    onClick={() => setSelectedDisaster({
                      id: 1,
                      title: "Flood Relief - Mumbai",
                      location: "Dharavi, Mumbai",
                      status: "Active",
                      severity: "High",
                      description: "Severe flooding in low-lying areas of Mumbai requiring immediate emergency response and evacuation assistance.",
                      requiredSkills: ["Water Rescue", "First Aid", "Emergency Response", "Medical Support"],
                      currentResponders: 15,
                      requiredResponders: 30,
                      startDate: "2024-03-22",
                      estimatedDuration: "2 weeks",
                      contactPerson: {
                        name: "Dr. Rajesh Kumar",
                        role: "Emergency Response Coordinator",
                        phone: "+91 98765 43210"
                      }
                    })}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Respond
                  </button>
                </div>
              </div>
            </div>

            {/* Supply Requests Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Supply Requests</h2>
                <button
                  onClick={() => setShowSupplyRequestModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Request
                </button>
              </div>

              <div className="grid gap-4">
                {supplyRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{request.itemName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.type === 'Medical' ? 'bg-red-100 text-red-800' :
                            request.type === 'Food' ? 'bg-green-100 text-green-800' :
                            request.type === 'Equipment' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                        <p className="text-sm text-gray-600">Location: {request.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <span className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          request.urgency === 'High' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency} Priority
                        </span>
                      </div>
                    </div>
                    {request.description && (
                      <p className="mt-2 text-sm text-gray-600">{request.description}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">Requested on: {request.requestDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Details Modal */}
      {showTeamDetails && (
        <TeamDetailsModal
          team={{
            name: teamData.teamName,
            leader: teamData.teamLead,
            location: "Team Location", // Add actual location
            status: "Active", // Add actual status
            members: teamData.members.map(m => ({
              id: m.id.toString(),
              name: m.name,
              specialization: m.specialization,
              taskStatus: "In Progress", // Add actual status
              currentTask: "Current task description", // Add actual task
              assignedTasks: ["Task 1", "Task 2"] // Add actual tasks
            })),
            specializations: Object.entries(
              teamData.members.reduce((acc, member) => {
                acc[member.specialization] = (acc[member.specialization] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {} as Record<string, number>)
          }}
          onClose={() => setShowTeamDetails(false)}
        />
      )}

      {/* Add Contact Modal */}
      {selectedContact && (
        <ContactModal
          member={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}

      {/* Add these modal components */}
      {selectedTask && !showUpdateStatus && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {selectedTask && showUpdateStatus && (
        <UpdateStatusModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setShowUpdateStatus(false);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Add Disaster Response Modal */}
      {selectedDisaster && (
        <DisasterResponseModal
          disaster={selectedDisaster}
          onClose={() => setSelectedDisaster(null)}
          onRespond={handleDisasterResponse}
        />
      )}

      {/* Add Supply Request Modal */}
      {showSupplyRequestModal && (
        <SupplyRequestModal
          onClose={() => setShowSupplyRequestModal(false)}
          onSubmit={handleSupplyRequest}
        />
      )}

      {/* Add Team Chat Modal */}
      {showTeamChat && (
        <TeamChatModal
          onClose={() => setShowTeamChat(false)}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          teamMembers={teamData.members}
        />
      )}
    </div>
  );
}

export default VolunteerDashboard; 