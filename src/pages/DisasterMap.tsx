import React, { useState } from 'react';
import { Map as MapIcon, Users, Filter, Search, Building2, Stethoscope, Plane, Droplet, Home, AlertTriangle, Dog } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression, CircleMarkerOptions, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Layer types and their styles
const layerTypes = {
  policeStations: {
    name: 'Police Stations',
    emoji: '👮‍♂️',
    color: '#1d4ed8',
    icon: Building2
  },
  hospitals: {
    name: 'Hospitals & Clinics',
    emoji: '🏥',
    color: '#dc2626',
    icon: Stethoscope
  },
  heliports: {
    name: 'Heliports & Evacuation Zones',
    emoji: '🚁',
    color: '#7c3aed',
    icon: Plane
  },
  supplyPoints: {
    name: 'Water & Food Supply Points',
    emoji: '🥫',
    color: '#2563eb',
    icon: Droplet
  },
  reliefCamps: {
    name: 'Relief Camps & Shelters',
    emoji: '⛺',
    color: '#059669',
    icon: Home
  },
  collapsedBuildings: {
    name: 'Collapsed Buildings',
    emoji: '🏚',
    color: '#92400e',
    icon: AlertTriangle
  },
  dangerousAreas: {
    name: 'Dangerous Animal Areas',
    emoji: '⚠️',
    color: '#b91c1c',
    icon: Dog
  }
};

// Add this after layerTypes
const disasterTypes = {
  flood: {
    name: 'Flood Zones',
    emoji: '🌊',
    color: '#ef4444'
  },
  landslide: {
    name: 'Landslide Areas',
    emoji: '⛰️',
    color: '#92400e'
  },
  earthquake: {
    name: 'Earthquake Zones',
    emoji: '🌋',
    color: '#7c3aed'
  },
  cyclone: {
    name: 'Cyclone Warning',
    emoji: '🌪️',
    color: '#2563eb'
  },
  tsunami: {
    name: 'Tsunami Alert',
    emoji: '🌊',
    color: '#0891b2'
  },
  avalanche: {
    name: 'Avalanche Risk',
    emoji: '❄️',
    color: '#1d4ed8'
  },
  drought: {
    name: 'Drought Areas',
    emoji: '☀️',
    color: '#b45309'
  },
  wildlife: {
    name: 'Wildlife Conflict',
    emoji: '🐯',
    color: '#047857'
  },
  explosion: {
    name: 'Explosion/Blast Sites',
    emoji: '💥',
    color: '#dc2626'
  },
  chemical: {
    name: 'Chemical Spills',
    emoji: '⚗️',
    color: '#7c3aed'
  },
  fire: {
    name: 'Industrial Fires',
    emoji: '🏭',
    color: '#f97316'
  },
  nuclear: {
    name: 'Nuclear Incidents',
    emoji: '☢️',
    color: '#059669'
  },
  terrorism: {
    name: 'Terror Threats',
    emoji: '🚨',
    color: '#ef4444'
  },
  riot: {
    name: 'Civil Unrest',
    emoji: '⚠️',
    color: '#eab308'
  },
  infrastructure: {
    name: 'Infrastructure Failure',
    emoji: '🏗️',
    color: '#6b7280'
  },
  pollution: {
    name: 'Severe Pollution',
    emoji: '🏭',
    color: '#475569'
  }
};

// Update the coordinates in emergencyData to spread services across cities
const emergencyData = {
  policeStations: [
    // Maharashtra
    { id: 'ps1', name: 'Mumbai Central Police', location: 'Mumbai', coordinates: { lat: 19.0760, lng: 72.8777 }, contact: '100', officers: 45, vehicles: 12, status: 'Active' },
    { id: 'ps2', name: 'Pune Police HQ', location: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 }, contact: '100', officers: 40, vehicles: 10, status: 'Active' },
    
    // Kerala
    { id: 'ps3', name: 'Kochi Police HQ', location: 'Kochi', coordinates: { lat: 9.9312, lng: 76.2673 }, contact: '100', officers: 38, vehicles: 8, status: 'Active' },
    { id: 'ps4', name: 'Wayanad Police', location: 'Wayanad', coordinates: { lat: 11.6854, lng: 76.1320 }, contact: '100', officers: 25, vehicles: 6, status: 'Active' },
    
    // Gujarat
    { id: 'ps5', name: 'Surat Police', location: 'Surat', coordinates: { lat: 21.1702, lng: 72.8311 }, contact: '100', officers: 42, vehicles: 11, status: 'Active' },
    { id: 'ps6', name: 'Kutch Police', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, contact: '100', officers: 30, vehicles: 8, status: 'Active' },
    
    // Tamil Nadu
    { id: 'ps7', name: 'Chennai Police', location: 'Chennai', coordinates: { lat: 13.0827, lng: 80.2707 }, contact: '100', officers: 50, vehicles: 15, status: 'Active' },
    { id: 'ps8', name: 'Cuddalore Police', location: 'Cuddalore', coordinates: { lat: 11.7480, lng: 79.7714 }, contact: '100', officers: 28, vehicles: 7, status: 'Active' },
    
    // Uttarakhand
    { id: 'ps9', name: 'Dehradun Police', location: 'Dehradun', coordinates: { lat: 30.3165, lng: 78.0322 }, contact: '100', officers: 35, vehicles: 9, status: 'Active' },
    { id: 'ps10', name: 'Kedarnath Police', location: 'Kedarnath', coordinates: { lat: 30.7346, lng: 79.0669 }, contact: '100', officers: 20, vehicles: 5, status: 'Active' },
    
    // Assam
    { id: 'ps11', name: 'Guwahati Police', location: 'Guwahati', coordinates: { lat: 26.1445, lng: 91.7362 }, contact: '100', officers: 40, vehicles: 10, status: 'Active' },
    
    // Bihar
    { id: 'ps12', name: 'Patna Police', location: 'Patna', coordinates: { lat: 25.5941, lng: 85.1376 }, contact: '100', officers: 45, vehicles: 12, status: 'Active' },
    
    // Odisha
    { id: 'ps13', name: 'Puri Police', location: 'Puri', coordinates: { lat: 19.8135, lng: 85.8312 }, contact: '100', officers: 35, vehicles: 9, status: 'Active' },
    
    // Rajasthan
    { id: 'ps14', name: 'Jaisalmer Police', location: 'Jaisalmer', coordinates: { lat: 26.9157, lng: 70.9083 }, contact: '100', officers: 30, vehicles: 8, status: 'Active' },
    
    // Himachal Pradesh
    { id: 'ps15', name: 'Manali Police', location: 'Manali', coordinates: { lat: 32.2432, lng: 77.1892 }, contact: '100', officers: 25, vehicles: 6, status: 'Active' }
  ],
  hospitals: [
    // Maharashtra
    { id: 'h1', name: 'Mumbai General Hospital', location: 'Mumbai', coordinates: { lat: 19.0011, lng: 72.8437 }, beds: 200, emergency: true, ambulances: 8, specialties: 'All' },
    { id: 'h2', name: 'Pune City Hospital', location: 'Pune', coordinates: { lat: 18.5089, lng: 73.8259 }, beds: 180, emergency: true, ambulances: 7, specialties: 'Trauma' },
    
    // Kerala
    { id: 'h3', name: 'Kochi Medical Center', location: 'Kochi', coordinates: { lat: 9.9698, lng: 76.3019 }, beds: 150, emergency: true, ambulances: 6, specialties: 'Emergency' },
    { id: 'h4', name: 'Wayanad District Hospital', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, beds: 120, emergency: true, ambulances: 4, specialties: 'General' },
    
    // Gujarat
    { id: 'h5', name: 'Surat Civil Hospital', location: 'Surat', coordinates: { lat: 21.1891, lng: 72.8478 }, beds: 250, emergency: true, ambulances: 10, specialties: 'All' },
    { id: 'h6', name: 'Kutch General Hospital', location: 'Bhuj', coordinates: { lat: 23.2419, lng: 69.6669 }, beds: 100, emergency: true, ambulances: 5, specialties: 'Emergency' },
    
    // Tamil Nadu
    { id: 'h7', name: 'Chennai Medical Institute', location: 'Chennai', coordinates: { lat: 13.0569, lng: 80.2425 }, beds: 300, emergency: true, ambulances: 12, specialties: 'All' },
    { id: 'h8', name: 'Cuddalore Government Hospital', location: 'Cuddalore', coordinates: { lat: 11.7460, lng: 79.7680 }, beds: 150, emergency: true, ambulances: 6, specialties: 'Trauma' },
    
    // Uttarakhand
    { id: 'h9', name: 'Dehradun Medical College', location: 'Dehradun', coordinates: { lat: 30.3346, lng: 78.0537 }, beds: 200, emergency: true, ambulances: 8, specialties: 'All' },
    { id: 'h10', name: 'Kedarnath Base Hospital', location: 'Kedarnath', coordinates: { lat: 30.7352, lng: 79.0669 }, beds: 80, emergency: true, ambulances: 4, specialties: 'Emergency' },
    
    // Assam
    { id: 'h11', name: 'Guwahati Medical Center', location: 'Guwahati', coordinates: { lat: 26.1445, lng: 91.7362 }, beds: 220, emergency: true, ambulances: 9, specialties: 'All' },
    { id: 'h12', name: 'Kaziranga Health Center', location: 'Kaziranga', coordinates: { lat: 26.5880, lng: 93.1700 }, beds: 60, emergency: true, ambulances: 3, specialties: 'Emergency' },
    
    // Bihar
    { id: 'h13', name: 'Patna Medical College', location: 'Patna', coordinates: { lat: 25.6000, lng: 85.1500 }, beds: 250, emergency: true, ambulances: 10, specialties: 'All' },
    
    // Odisha
    { id: 'h14', name: 'Puri District Hospital', location: 'Puri', coordinates: { lat: 19.8135, lng: 85.8312 }, beds: 150, emergency: true, ambulances: 6, specialties: 'General' },
    
    // Rajasthan
    { id: 'h15', name: 'Jaisalmer Desert Hospital', location: 'Jaisalmer', coordinates: { lat: 26.9157, lng: 70.9083 }, beds: 100, emergency: true, ambulances: 5, specialties: 'Emergency' },
    
    // Himachal Pradesh
    { id: 'h16', name: 'Manali Health Institute', location: 'Manali', coordinates: { lat: 32.2432, lng: 77.1892 }, beds: 120, emergency: true, ambulances: 5, specialties: 'Emergency' }
  ],
  heliports: [
    // Maharashtra
    { id: 'hp1', name: 'Mumbai Emergency Heliport', location: 'Mumbai', coordinates: { lat: 19.1147, lng: 72.8735 }, status: 'Active', capacity: 3, lighting: true },
    { id: 'hp2', name: 'Pune Military Helipad', location: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 }, status: 'Active', capacity: 4, lighting: true },
    
    // Kerala
    { id: 'hp3', name: 'Kochi Naval Base', location: 'Kochi', coordinates: { lat: 10.0023, lng: 76.3088 }, status: 'Active', capacity: 2, lighting: true },
    { id: 'hp4', name: 'Wayanad Rescue Helipad', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, status: 'Standby', capacity: 1, lighting: true },
    
    // Gujarat
    { id: 'hp5', name: 'Surat Emergency Landing', location: 'Surat', coordinates: { lat: 21.2087, lng: 72.8398 }, status: 'Active', capacity: 2, lighting: true },
    { id: 'hp6', name: 'Kutch Border Heliport', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, status: 'Active', capacity: 2, lighting: true },
    
    // Tamil Nadu
    { id: 'hp7', name: 'Chennai Coast Guard Base', location: 'Chennai', coordinates: { lat: 13.1067, lng: 80.2985 }, status: 'Active', capacity: 4, lighting: true },
    { id: 'hp8', name: 'Cuddalore Emergency Pad', location: 'Cuddalore', coordinates: { lat: 11.7480, lng: 79.7714 }, status: 'Standby', capacity: 1, lighting: true },
    
    // Uttarakhand
    { id: 'hp9', name: 'Dehradun Mountain Rescue', location: 'Dehradun', coordinates: { lat: 30.3198, lng: 78.0592 }, status: 'Active', capacity: 2, lighting: true },
    { id: 'hp10', name: 'Kedarnath Temple Helipad', location: 'Kedarnath', coordinates: { lat: 30.7346, lng: 79.0669 }, status: 'Active', capacity: 1, lighting: true }
  ],
  supplyPoints: [
    // Maharashtra
    { id: 'sp1', name: 'Mumbai Central Supply', location: 'Mumbai', coordinates: { lat: 19.0359, lng: 72.8493 }, type: 'Water & Food', capacity: '1000 people', stock: 'Full' },
    { id: 'sp2', name: 'Pune Distribution Hub', location: 'Pune', coordinates: { lat: 18.5089, lng: 73.8259 }, type: 'Water & Food', capacity: '800 people', stock: 'Medium' },
    
    // Kerala
    { id: 'sp3', name: 'Kochi Relief Hub', location: 'Kochi', coordinates: { lat: 9.9894, lng: 76.2956 }, type: 'Water & Food', capacity: '800 people', stock: 'Full' },
    { id: 'sp4', name: 'Wayanad Supply Center', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, type: 'Food', capacity: '400 people', stock: 'Medium' },
    
    // Gujarat
    { id: 'sp5', name: 'Surat Distribution', location: 'Surat', coordinates: { lat: 21.1794, lng: 72.8203 }, type: 'Water & Food', capacity: '600 people', stock: 'Medium' },
    { id: 'sp6', name: 'Kutch Emergency Supplies', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, type: 'Water', capacity: '300 people', stock: 'Low' },
    
    // Tamil Nadu
    { id: 'sp7', name: 'Chennai Supply Point', location: 'Chennai', coordinates: { lat: 13.0732, lng: 80.2526 }, type: 'Water & Food', capacity: '1200 people', stock: 'Full' },
    { id: 'sp8', name: 'Cuddalore Relief Center', location: 'Cuddalore', coordinates: { lat: 11.7460, lng: 79.7680 }, type: 'Food', capacity: '500 people', stock: 'Medium' }
  ],
  reliefCamps: [
    // Maharashtra
    { id: 'rc1', name: 'Mumbai Stadium Camp', location: 'Mumbai', coordinates: { lat: 19.0234, lng: 72.8567 }, capacity: 500, occupancy: 320, facilities: 'Full' },
    { id: 'rc2', name: 'Pune Exhibition Center', location: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 }, capacity: 400, occupancy: 250, facilities: 'Full' },
    
    // Kerala
    { id: 'rc3', name: 'Kochi Safe Zone', location: 'Kochi', coordinates: { lat: 9.9547, lng: 76.2837 }, capacity: 400, occupancy: 250, facilities: 'Full' },
    { id: 'rc4', name: 'Wayanad School Camp', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, capacity: 200, occupancy: 150, facilities: 'Basic' },
    
    // Gujarat
    { id: 'rc5', name: 'Surat Relief Camp', location: 'Surat', coordinates: { lat: 21.1638, lng: 72.8422 }, capacity: 300, occupancy: 180, facilities: 'Basic' },
    { id: 'rc6', name: 'Kutch Desert Camp', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, capacity: 150, occupancy: 100, facilities: 'Basic' }
  ],
  collapsedBuildings: [
    // Maharashtra
    { id: 'cb1', name: 'Mumbai Market Complex', location: 'Mumbai', coordinates: { lat: 19.0123, lng: 72.8456 }, risk: 'High', trapped: 'Possible', status: 'Under Assessment' },
    { id: 'cb2', name: 'Pune Old Town Building', location: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 }, risk: 'Medium', trapped: 'None', status: 'Cordoned' },
    
    // Kerala
    { id: 'cb3', name: 'Kochi Heritage Site', location: 'Kochi', coordinates: { lat: 9.9765, lng: 76.2744 }, risk: 'High', trapped: 'Confirmed', status: 'Rescue Ongoing' },
    { id: 'cb4', name: 'Wayanad Hill Structure', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, risk: 'Medium', trapped: 'Unknown', status: 'Assessment Needed' },
    
    // Gujarat
    { id: 'cb5', name: 'Surat Textile Mill', location: 'Surat', coordinates: { lat: 21.1852, lng: 72.8311 }, risk: 'High', trapped: 'Possible', status: 'Rescue Ongoing' },
    { id: 'cb6', name: 'Kutch Ancient Fort', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, risk: 'Medium', trapped: 'None', status: 'Cordoned' }
  ],
  dangerousAreas: [
    // Maharashtra
    { id: 'da1', name: 'Mumbai Leopard Zone', location: 'Mumbai', coordinates: { lat: 19.0897, lng: 72.8656 }, threat: 'Wildlife', severity: 'High', lastSeen: 'Current' },
    { id: 'da2', name: 'Pune Snake Area', location: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 }, threat: 'Wildlife', severity: 'Medium', lastSeen: '2 hours ago' },
    
    // Kerala
    { id: 'da3', name: 'Kochi Crocodile Zone', location: 'Kochi', coordinates: { lat: 9.9456, lng: 76.2589 }, threat: 'Wildlife', severity: 'High', lastSeen: 'Current' },
    { id: 'da4', name: 'Wayanad Tiger Reserve', location: 'Wayanad', coordinates: { lat: 11.7180, lng: 76.0730 }, threat: 'Wildlife', severity: 'Critical', lastSeen: 'Current' },
    
    // Gujarat
    { id: 'da5', name: 'Surat Industrial Hazard', location: 'Surat', coordinates: { lat: 21.1945, lng: 72.8245 }, threat: 'Chemical', severity: 'High', lastSeen: 'Current' },
    { id: 'da6', name: 'Kutch Lion Territory', location: 'Kutch', coordinates: { lat: 23.2420, lng: 69.6669 }, threat: 'Wildlife', severity: 'High', lastSeen: '1 hour ago' },
    
    // Tamil Nadu
    { id: 'da7', name: 'Chennai Coastal Hazard', location: 'Chennai', coordinates: { lat: 13.1045, lng: 80.2833 }, threat: 'Environmental', severity: 'High', lastSeen: 'Current' },
    { id: 'da8', name: 'Cuddalore Chemical Plant', location: 'Cuddalore', coordinates: { lat: 11.7460, lng: 79.7680 }, threat: 'Chemical', severity: 'High', lastSeen: 'Current' }
  ]
};

// Add interfaces for type safety
interface Location {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  [key: string]: any;
}

interface DisasterZone {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number;
  severity: 'critical' | 'moderate' | 'low';
  type: string;
  state: string;
}

// Create custom icon function
const createCustomIcon = (layerType: keyof typeof layerTypes): DivIcon => {
  const { emoji } = layerTypes[layerType];
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-pin">
        <span class="marker-content">${emoji}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Update the getFilteredEmergencyServices function
const getFilteredEmergencyServices = (serviceLocations: Location[], activeDisasterTypes: Record<string, boolean>, filteredZones: DisasterZone[]) => {
  // If no disaster type is selected, return all services
  if (Object.keys(activeDisasterTypes).length === 0) {
    return serviceLocations;
  }

  // Get active zones
  const activeZones = filteredZones.filter(zone => 
    activeDisasterTypes[zone.type.toLowerCase()]
  );

  if (activeZones.length === 0) return [];

  // Filter services within range of any active zone
  return serviceLocations.filter(service => {
    return activeZones.some(zone => {
      const distance = calculateDistance(
        service.coordinates.lat,
        service.coordinates.lng,
        zone.coordinates.lat,
        zone.coordinates.lng
      );
      // Increase the range to check for nearby services (50km radius)
      return distance <= 50;
    });
  });
};

// Update the Circle components props
const circleOptions: CircleMarkerOptions = {
  color: '#ef4444',
  fillColor: '#ef4444',
  fillOpacity: 0.15,
  weight: 2,
  dashArray: '5, 5'
};

// Add this helper function to calculate distance between coordinates
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Add type for disaster types
type DisasterType = keyof typeof disasterTypes;

// Add type guard for disaster types
const isValidDisasterType = (type: string): type is DisasterType => {
  return type.toLowerCase() in disasterTypes;
};

// Add this after the emergencyData object
const disasterZones: DisasterZone[] = [
  // Flood Zones
  {
    id: 'fz1',
    name: 'Mumbai Coastal Flood',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    radius: 5000,
    severity: 'critical',
    type: 'flood',
    state: 'Maharashtra'
  },
  {
    id: 'fz2',
    name: 'Kerala Flood Zone',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    radius: 8000,
    severity: 'critical',
    type: 'flood',
    state: 'Kerala'
  },

  // Chemical Disasters
  {
    id: 'ch1',
    name: 'Bhopal Gas Leak Zone',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    radius: 6000,
    severity: 'critical',
    type: 'chemical',
    state: 'Madhya Pradesh'
  },
  {
    id: 'ch2',
    name: 'Vizag Chemical Plant',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    radius: 4000,
    severity: 'critical',
    type: 'chemical',
    state: 'Andhra Pradesh'
  },

  // Fire Incidents
  {
    id: 'fr1',
    name: 'Delhi Industrial Fire',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    radius: 3000,
    severity: 'critical',
    type: 'fire',
    state: 'Delhi'
  },
  {
    id: 'fr2',
    name: 'Surat Textile Fire',
    coordinates: { lat: 21.1702, lng: 72.8311 },
    radius: 2500,
    severity: 'moderate',
    type: 'fire',
    state: 'Gujarat'
  },

  // Earthquake Zones
  {
    id: 'eq1',
    name: 'Kutch Seismic Zone',
    coordinates: { lat: 23.2420, lng: 69.6669 },
    radius: 10000,
    severity: 'critical',
    type: 'earthquake',
    state: 'Gujarat'
  },
  {
    id: 'eq2',
    name: 'Uttarakhand Earthquake Zone',
    coordinates: { lat: 30.3165, lng: 78.0322 },
    radius: 7000,
    severity: 'moderate',
    type: 'earthquake',
    state: 'Uttarakhand'
  },

  // Cyclone Warnings
  {
    id: 'cy1',
    name: 'Odisha Cyclone Alert',
    coordinates: { lat: 19.8135, lng: 85.8312 },
    radius: 15000,
    severity: 'critical',
    type: 'cyclone',
    state: 'Odisha'
  },
  {
    id: 'cy2',
    name: 'Chennai Storm Warning',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    radius: 12000,
    severity: 'moderate',
    type: 'cyclone',
    state: 'Tamil Nadu'
  },

  // Nuclear Incidents
  {
    id: 'nu1',
    name: 'Kudankulam Alert Zone',
    coordinates: { lat: 8.1689, lng: 77.7141 },
    radius: 10000,
    severity: 'critical',
    type: 'nuclear',
    state: 'Tamil Nadu'
  },

  // Landslide Areas
  {
    id: 'ls1',
    name: 'Munnar Landslide Risk',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    radius: 3000,
    severity: 'critical',
    type: 'landslide',
    state: 'Kerala'
  },
  {
    id: 'ls2',
    name: 'Darjeeling Landslide Zone',
    coordinates: { lat: 27.0410, lng: 88.2663 },
    radius: 4000,
    severity: 'moderate',
    type: 'landslide',
    state: 'West Bengal'
  },

  // Riot Zones
  {
    id: 'rt1',
    name: 'Urban Unrest Area',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    radius: 2000,
    severity: 'critical',
    type: 'riot',
    state: 'West Bengal'
  },

  // Infrastructure Failures
  {
    id: 'if1',
    name: 'Bridge Collapse Zone',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    radius: 1000,
    severity: 'critical',
    type: 'infrastructure',
    state: 'Delhi'
  },
  {
    id: 'if2',
    name: 'Dam Breach Warning',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    radius: 6000,
    severity: 'critical',
    type: 'infrastructure',
    state: 'Telangana'
  },

  // Pollution Hotspots
  {
    id: 'po1',
    name: 'Severe Air Quality Zone',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    radius: 15000,
    severity: 'critical',
    type: 'pollution',
    state: 'Delhi'
  },
  {
    id: 'po2',
    name: 'Industrial Pollution Area',
    coordinates: { lat: 26.4499, lng: 80.3319 },
    radius: 8000,
    severity: 'critical',
    type: 'pollution',
    state: 'Uttar Pradesh'
  }
];

function DisasterMap() {
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});
  const [activeDisasterTypes, setActiveDisasterTypes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showZones, setShowZones] = useState(true);

  // Add zoneStyles constant
  const zoneStyles = {
    critical: { 
      color: '#dc2626',
      fillColor: '#dc2626', 
      fillOpacity: 0.2,
      weight: 2 
    },
    moderate: { 
      color: '#f97316', 
      fillColor: '#f97316', 
      fillOpacity: 0.15, 
      weight: 1.5 
    },
    low: { 
      color: '#eab308', 
      fillColor: '#eab308', 
      fillOpacity: 0.1, 
      weight: 1 
    }
  };

  // Add filteredZones computation
  const filteredZones = disasterZones.filter((zone: DisasterZone) => {
    const matchesSearch = 
      zone.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = 
      Object.keys(activeDisasterTypes).length === 0 || 
      activeDisasterTypes[zone.type.toLowerCase()];

    return matchesSearch && matchesType;
  });

  // Update the MapContainer props
  const center: LatLngExpression = [20.5937, 78.9629]; // Center of India
  const defaultZoom = 5; // Zoom level to show all of India

  // Add these toggle functions
  const toggleLayer = (layerKey: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const toggleDisasterType = (disasterType: string) => {
    setActiveDisasterTypes(prev => ({
      ...prev,
      [disasterType.toLowerCase()]: !prev[disasterType.toLowerCase()]
    }));
  };

  const renderDangerZones = () => {
    return (
      <LayerGroup>
        {filteredZones
          .filter(zone => zone.severity === 'critical')
          .map((zone) => (
            <Circle
              key={`danger-${zone.id}`}
              center={[zone.coordinates.lat, zone.coordinates.lng]}
              radius={zone.radius * 1.2} // Slightly larger radius for danger zone
              pathOptions={circleOptions}
            />
          ))}
      </LayerGroup>
    );
  };

  // Add this helper function to generate multiple emojis
  const getMultipleEmojis = (type: string, count: number = 3) => {
    const emoji = disasterTypes[type.toLowerCase() as keyof typeof disasterTypes]?.emoji || '⚠️';
    return Array(count).fill(emoji).join(' ');
  };

  // Add this helper function to generate random offset coordinates
  const getRandomOffset = (base: number, range: number = 0.01) => {
    return base + (Math.random() - 0.5) * range;
  };

  // Update the createEmergencyMarkers function
  const createEmergencyMarkers = (location: Location, layerKey: string) => {
    const markers = [];
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 markers per service

    // Add main marker
    markers.push(
      <Marker
        key={location.id}
        position={[location.coordinates.lat, location.coordinates.lng]}
        icon={L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="marker-pin">
              <span class="marker-content">${layerTypes[layerKey as keyof typeof layerTypes].emoji}</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        })}
      >
        <Popup>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{layerTypes[layerKey as keyof typeof layerTypes].emoji}</span>
              <h3 className="font-semibold">{location.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{location.location}</p>
            {Object.entries(location).map(([key, value]) => {
              if (['id', 'name', 'location', 'coordinates'].includes(key)) return null;
              return (
                <p key={key} className="text-sm text-gray-500">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toString()}
                </p>
              );
            })}
          </div>
        </Popup>
      </Marker>
    );

    // Add additional markers with smaller spread
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count;
      const radius = 0.01 + Math.random() * 0.02; // Smaller radius (1-3km)
      
      const lat = location.coordinates.lat + radius * Math.cos(angle);
      const lng = location.coordinates.lng + radius * Math.sin(angle);

      markers.push(
        <Marker
          key={`${location.id}-${i}`}
          position={[lat, lng]}
          icon={L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="marker-pin">
                <span class="marker-content">${layerTypes[layerKey as keyof typeof layerTypes].emoji}</span>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          })}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{layerTypes[layerKey as keyof typeof layerTypes].emoji}</span>
                <h3 className="font-semibold">Mobile {layerTypes[layerKey as keyof typeof layerTypes].name}</h3>
              </div>
              <p className="text-sm text-gray-600">Supporting {location.name}</p>
            </div>
          </Popup>
        </Marker>
      );
    }

    return markers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Controls */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold flex items-center">
              <MapIcon className="h-6 w-6 text-red-600 mr-2" />
              Emergency Services Map
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setShowZones(!showZones)}
            >
              <AlertTriangle className="h-5 w-5 text-gray-600" />
              <span>{showZones ? 'Hide Zones' : 'Show Zones'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-[calc(100vh-12rem)]">
        {/* Layer Controls Sidebar */}
        <div className="w-64 bg-white shadow-lg p-4">
          <div className="space-y-6">
            {/* Emergency Services Layers */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Emergency Services</h2>
              <div className="space-y-3">
                {Object.entries(layerTypes).map(([key, layer]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={activeLayers[key] || false}
                      onChange={() => toggleLayer(key)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={key} className="flex items-center text-sm">
                      <span className="mr-2 text-xl">{layer.emoji}</span>
                      {layer.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Disaster Zones */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Natural Disasters</h2>
              <div className="space-y-3">
                {Object.entries(disasterTypes)
                  .filter(([key]) => !['explosion', 'chemical', 'fire', 'nuclear', 'terrorism', 'riot', 'infrastructure', 'pollution'].includes(key))
                  .map(([key, type]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`disaster-${key}`}
                        checked={activeDisasterTypes[key] || false}
                        onChange={() => toggleDisasterType(key)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`disaster-${key}`} className="flex items-center text-sm">
                        <span className="mr-2 text-xl">{type.emoji}</span>
                        {type.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            {/* Man-made Disaster Zones */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Man-made Disasters</h2>
              <div className="space-y-3">
                {Object.entries(disasterTypes)
                  .filter(([key]) => ['explosion', 'chemical', 'fire', 'nuclear', 'terrorism', 'riot', 'infrastructure', 'pollution'].includes(key))
                  .map(([key, type]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`disaster-${key}`}
                        checked={activeDisasterTypes[key] || false}
                        onChange={() => toggleDisasterType(key)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`disaster-${key}`} className="flex items-center text-sm">
                        <span className="mr-2 text-xl">{type.emoji}</span>
                        {type.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapContainer 
            center={center}
            zoom={defaultZoom} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", position: "absolute" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Danger Zone Layer */}
            {showZones && renderDangerZones()}

            {/* Existing Disaster Zones Layer */}
            {showZones && (
              <LayerGroup>
                {filteredZones.map((zone) => (
                  <React.Fragment key={zone.id}>
                    <Circle
                      center={[zone.coordinates.lat, zone.coordinates.lng]}
                      radius={zone.radius}
                      pathOptions={{
                        ...zoneStyles[zone.severity as keyof typeof zoneStyles],
                        dashArray: zone.severity === 'critical' ? '5, 5' : 'none'
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">
                              {disasterTypes[isValidDisasterType(zone.type.toLowerCase()) ? zone.type.toLowerCase() : 'flood']?.emoji}
                            </span>
                            <h3 className="font-semibold">{zone.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{zone.type}</p>
                          <p className="text-sm text-gray-500">State: {zone.state}</p>
                          <p className="text-sm text-gray-500">
                            Severity: <span className="capitalize">{zone.severity}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Radius: {(zone.radius / 1000).toFixed(1)} km
                          </p>
                        </div>
                      </Popup>
                    </Circle>

                    {/* Multiple markers for each zone */}
                    {(Object.keys(activeDisasterTypes).length === 0 || 
                      activeDisasterTypes[zone.type.toLowerCase()]) && (
                      <>
                        {/* Center marker */}
                        <Marker
                          position={[zone.coordinates.lat, zone.coordinates.lng]}
                          icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `
                              <div class="marker-pin">
                                <span class="marker-content">
                                  ${getMultipleEmojis(zone.type, 2)}
                                </span>
                              </div>
                            `,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -40]
                          })}
                        >
                          <Popup>
                            <div className="p-2">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">
                                  {disasterTypes[isValidDisasterType(zone.type.toLowerCase()) ? zone.type.toLowerCase() : 'flood']?.emoji}
                                </span>
                                <h3 className="font-semibold">{zone.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600">{zone.type}</p>
                              <p className="text-sm text-gray-500">State: {zone.state}</p>
                              <p className="text-sm text-gray-500">
                                Severity: <span className="capitalize">{zone.severity}</span>
                              </p>
                            </div>
                          </Popup>
                        </Marker>

                        {/* Additional markers around the center */}
                        <Marker
                          position={[
                            zone.coordinates.lat + 0.02, 
                            zone.coordinates.lng + 0.02
                          ]}
                          icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `
                              <div class="marker-pin">
                                <span class="marker-content">
                                  ${getMultipleEmojis(zone.type, 1)}
                                </span>
                              </div>
                            `,
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            popupAnchor: [0, -30]
                          })}
                        />
                        <Marker
                          position={[
                            zone.coordinates.lat - 0.015, 
                            zone.coordinates.lng + 0.01
                          ]}
                          icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `
                              <div class="marker-pin">
                                <span class="marker-content">
                                  ${getMultipleEmojis(zone.type, 1)}
                                </span>
                              </div>
                            `,
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            popupAnchor: [0, -30]
                          })}
                        />
                        <Marker
                          position={[
                            zone.coordinates.lat + 0.01, 
                            zone.coordinates.lng - 0.02
                          ]}
                          icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `
                              <div class="marker-pin">
                                <span class="marker-content">
                                  ${getMultipleEmojis(zone.type, 1)}
                                </span>
                              </div>
                            `,
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            popupAnchor: [0, -30]
                          })}
                        />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </LayerGroup>
            )}

            {/* Update the emergency services rendering */}
            {Object.entries(emergencyData).map(([layerKey, locations]) => {
              if (!activeLayers[layerKey]) return null;
              
              const filteredLocations = getFilteredEmergencyServices(locations, activeDisasterTypes, filteredZones);
              
              if (filteredLocations.length === 0) return null;
              
              return (
                <LayerGroup key={layerKey}>
                  {filteredLocations.map((location) => (
                    <React.Fragment key={location.id}>
                      {createEmergencyMarkers(location, layerKey)}
                    </React.Fragment>
                  ))}
                </LayerGroup>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default DisasterMap;