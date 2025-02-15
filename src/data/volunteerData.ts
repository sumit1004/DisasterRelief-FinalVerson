// First, declare the interfaces
interface Team {
  id: string;
  name: string;
  leader: string;
  members: any[];
  specializations: Record<string, number>;
  location: string;
  status: 'Active' | 'Deployed';
}

// Declare tasks before using them
const specializationTasks: Record<string, string[]> = {
  'Disaster Management Officer': [
    'Coordinate overall disaster response',
    'Develop emergency response plans',
    'Lead team deployment strategies',
    'Conduct risk assessments'
  ],
  'Emergency Management Specialist': [
    'Monitor emergency situations',
    'Implement response protocols',
    'Coordinate with local authorities',
    'Manage resource allocation'
  ],
  'Doctor (Emergency & Trauma)': [
    'Provide emergency medical care',
    'Triage disaster victims',
    'Supervise medical team',
    'Coordinate with hospitals'
  ],
  'Paramedic': [
    'Provide first aid and life support',
    'Transport critical patients',
    'Assist in field medical procedures',
    'Document patient conditions'
  ],
  'Firefighter': [
    'Execute search and rescue operations',
    'Control and extinguish fires',
    'Perform emergency evacuations',
    'Handle hazardous materials'
  ],
  'Search and Rescue Specialist': [
    'Conduct search operations',
    'Perform technical rescues',
    'Operate specialized equipment',
    'Navigate difficult terrain'
  ],
  // Add more specialization tasks...
};

// Helper function to generate random data
const generateRandomVolunteer = (id: number) => {
  const categories = {
    'Government & Policy Roles': [
      'Disaster Management Officer',
      'Emergency Management Specialist',
      'Civil Defense Officer',
      'Urban Planner',
      'NDRF Officer',
      'RAF Officer'
    ],
    'Medical & Health Response Roles': [
      'Doctor (Emergency & Trauma)',
      'Paramedic',
      'Emergency Medical Technician',
      'Public Health Coordinator',
      'Field Nurse',
      'Mental Health Counselor'
    ],
    'First Responders & Search & Rescue Roles': [
      'Firefighter',
      'Police Officer',
      'Search and Rescue Specialist',
      'K9 Handler',
      'Swift Water Rescue Technician',
      'Urban Search and Rescue Technician'
    ],
    'Relief & Humanitarian Aid Roles': [
      'Humanitarian Aid Worker',
      'Relief Coordinator',
      'Shelter Manager',
      'Food Security Specialist',
      'Community Coordinator',
      'Crisis Communication Specialist'
    ],
    'Engineering & Technical Roles': [
      'Structural Engineer',
      'Seismologist',
      'Fire Protection Engineer',
      'GIS Specialist',
      'Environmental Scientist',
      'Remote Sensing Specialist'
    ]
  };

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const statuses = ['Active', 'Deployed'];
  const availabilities = ['Full-time', 'Part-time', 'Weekends', 'On-call'];

  const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
  const specialization = categories[category as keyof typeof categories][
    Math.floor(Math.random() * categories[category as keyof typeof categories].length)
  ];

  const firstName = [
    'Aarav', 'Arjun', 'Advait', 'Bharat', 'Chirag', 'Dev', 'Esha', 'Gaurav',
    'Hari', 'Ishaan', 'Jaya', 'Kavya', 'Lakshmi', 'Manav', 'Neha', 'Ojas',
    'Priya', 'Rahul', 'Sarika', 'Tanvi'
  ][Math.floor(Math.random() * 20)];

  const lastName = [
    'Kumar', 'Singh', 'Patel', 'Shah', 'Sharma', 'Verma', 'Gupta', 'Malhotra',
    'Reddy', 'Nair', 'Pillai', 'Desai', 'Mehta', 'Joshi', 'Kapoor'
  ][Math.floor(Math.random() * 15)];

  const assignedTasks = specializationTasks[specialization] || [
    'Support team operations',
    'Assist in general duties'
  ];

  return {
    id: `VOL${id.toString().padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`,
    phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    category,
    specialization,
    location: cities[Math.floor(Math.random() * cities.length)],
    status: Math.random() < 0.7 ? 'Active' : 'Deployed', // 70% Active, 30% Deployed
    availability: availabilities[Math.floor(Math.random() * availabilities.length)],
    joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    deployments: Math.floor(Math.random() * 20),
    rating: (Math.floor(Math.random() * 20) + 30) / 10, // Rating between 3.0 and 5.0
    assignedTasks,
    currentTask: assignedTasks[Math.floor(Math.random() * assignedTasks.length)],
    taskStatus: Math.random() > 0.3 ? 'In Progress' : 'Completed'
  };
};

// Helper function to create balanced teams
const createBalancedTeams = (volunteers: ReturnType<typeof generateRandomVolunteer>[]) => {
  // Number of teams (between 12-15 teams)
  const numberOfTeams = Math.floor(Math.random() * 4) + 12;
  
  // Sort volunteers by category to ensure even distribution
  const volunteersByCategory: Record<string, typeof volunteers> = {};
  volunteers.forEach(volunteer => {
    if (!volunteersByCategory[volunteer.category]) {
      volunteersByCategory[volunteer.category] = [];
    }
    volunteersByCategory[volunteer.category].push(volunteer);
  });

  // Initialize teams
  const teams: Team[] = Array.from({ length: numberOfTeams }, (_, index) => ({
    id: `TEAM${(index + 1).toString().padStart(2, '0')}`,
    name: `Rapid Response Team ${index + 1}`,
    leader: '',
    members: [],
    specializations: {},
    location: '',
    status: 'Active'
  }));

  // Distribute team leaders first (prefer experienced volunteers)
  const potentialLeaders = [...volunteers]
    .sort((a, b) => b.deployments - a.deployments)
    .slice(0, numberOfTeams);

  potentialLeaders.forEach((leader, index) => {
    teams[index].leader = leader.name;
    teams[index].location = leader.location;
    teams[index].members.push(leader);
    teams[index].status = leader.status;
  });

  // Helper function to find the team that needs a specific category the most
  const findTeamNeedingCategory = (category: string, location: string) => {
    return teams
      .filter(team => team.location === location || team.members.length < 3)
      .sort((a, b) => {
        const aCount = a.members.filter(m => m.category === category).length;
        const bCount = b.members.filter(m => m.category === category).length;
        if (aCount === bCount) {
          return a.members.length - b.members.length;
        }
        return aCount - bCount;
      })[0];
  };

  // Distribute remaining volunteers
  Object.entries(volunteersByCategory).forEach(([category, categoryVolunteers]) => {
    categoryVolunteers
      .filter(v => !potentialLeaders.includes(v))
      .forEach(volunteer => {
        const targetTeam = findTeamNeedingCategory(category, volunteer.location);
        if (targetTeam) {
          targetTeam.members.push(volunteer);
          targetTeam.specializations[volunteer.specialization] = 
            (targetTeam.specializations[volunteer.specialization] || 0) + 1;
        }
      });
  });

  // Calculate team statistics
  const teamStats = teams.map(team => ({
    id: team.id,
    size: team.members.length,
    categories: Object.entries(
      team.members.reduce((acc, member) => {
        acc[member.category] = (acc[member.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
  }));

  console.log('Team Statistics:', teamStats);

  return teams;
};

// Export the volunteers and teams
export const generatedVolunteers = Array.from({ length: 500 }, (_, index) => generateRandomVolunteer(index + 1));
export const generatedTeams = createBalancedTeams([...generatedVolunteers]);

// Export references to use throughout the app
export const volunteers = generatedVolunteers;
export const teams = generatedTeams;

// Update getVolunteerStats to use the exported variables
export const getVolunteerStats = () => {
  const stats = {
    total: generatedVolunteers.length,
    active: generatedVolunteers.filter(v => v.status === 'Active').length,
    deployed: generatedVolunteers.filter(v => v.status === 'Deployed').length,
    byCategory: {} as Record<string, number>,
    byLocation: {} as Record<string, number>,
    avgRating: 0,
    totalDeployments: 0,
    teams: {
      total: generatedTeams.length,
      active: generatedTeams.filter(t => t.status === 'Active').length,
      deployed: generatedTeams.filter(t => t.status === 'Deployed').length,
      averageSize: Math.round(generatedVolunteers.length / generatedTeams.length),
      distribution: generatedTeams.map(team => ({
        id: team.id,
        name: team.name,
        size: team.members.length,
        categories: Object.entries(
          team.members.reduce((acc, member) => {
            acc[member.category] = (acc[member.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
      }))
    }
  };

  generatedVolunteers.forEach(volunteer => {
    stats.byCategory[volunteer.category] = (stats.byCategory[volunteer.category] || 0) + 1;
    stats.byLocation[volunteer.location] = (stats.byLocation[volunteer.location] || 0) + 1;
    stats.avgRating += volunteer.rating;
    stats.totalDeployments += volunteer.deployments;
  });

  stats.avgRating = Number((stats.avgRating / generatedVolunteers.length).toFixed(2));

  return stats;
};

// Update filterVolunteers to use generatedVolunteers
export const filterVolunteers = (filters: {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
  availability?: string;
}) => {
  return generatedVolunteers.filter(volunteer => {
    const matchesSearch = !filters.search || 
      volunteer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      volunteer.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || volunteer.category === filters.category;
    const matchesLocation = !filters.location || volunteer.location === filters.location;
    const matchesStatus = !filters.status || volunteer.status === filters.status;
    const matchesAvailability = !filters.availability || volunteer.availability === filters.availability;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesAvailability;
  });
};

// Update filterTeams to use generatedTeams
export const filterTeams = (filters: {
  search?: string;
  location?: string;
  status?: string;
}) => {
  return generatedTeams.filter(team => {
    const matchesSearch = !filters.search || 
      team.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      team.leader.toLowerCase().includes(filters.search.toLowerCase()) ||
      team.id.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = !filters.location || team.location === filters.location;
    const matchesStatus = !filters.status || team.status === filters.status;

    return matchesSearch && matchesLocation && matchesStatus;
  });
}; 