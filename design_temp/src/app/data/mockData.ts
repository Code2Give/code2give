// Mock data for Lemontree food resource dashboard

export interface CommunityReport {
  id: string;
  resourceId: string;
  timestamp: string;
  photoUrl: string;
  waitTime: number; // in minutes
  foodAvailability: {
    produce: boolean;
    meat: boolean;
    pantryStaples: boolean;
  };
  comments: string;
  issues?: string;
  reporterLocation: string;
}

export interface FoodResource {
  id: string;
  name: string;
  type: 'pantry' | 'fridge' | 'meal-program';
  neighborhood: string;
  district: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'stable' | 'moderate' | 'high-demand';
  avgWaitTime: number;
  reportsCount: number;
  lastReportDate: string;
  operatingHours: string;
  issues: number;
}

export const foodResources: FoodResource[] = [
  {
    id: 'r1',
    name: 'Downtown Community Pantry',
    type: 'pantry',
    neighborhood: 'Downtown',
    district: 'District A',
    location: { lat: 40.7580, lng: -73.9855 },
    status: 'stable',
    avgWaitTime: 15,
    reportsCount: 18,
    lastReportDate: '2026-03-13T10:30:00',
    operatingHours: 'Mon-Fri 9AM-5PM',
    issues: 0,
  },
  {
    id: 'r2',
    name: 'Westside Community Fridge',
    type: 'fridge',
    neighborhood: 'West End',
    district: 'District B',
    location: { lat: 40.7614, lng: -73.9776 },
    status: 'high-demand',
    avgWaitTime: 45,
    reportsCount: 24,
    lastReportDate: '2026-03-13T14:00:00',
    operatingHours: '24/7 Access',
    issues: 3,
  },
  {
    id: 'r3',
    name: 'North End Meal Program',
    type: 'meal-program',
    neighborhood: 'North End',
    district: 'District C',
    location: { lat: 40.7489, lng: -73.9680 },
    status: 'moderate',
    avgWaitTime: 30,
    reportsCount: 15,
    lastReportDate: '2026-03-12T18:45:00',
    operatingHours: 'Daily 5PM-7PM',
    issues: 1,
  },
  {
    id: 'r4',
    name: 'Eastside Food Bank',
    type: 'pantry',
    neighborhood: 'East Village',
    district: 'District A',
    location: { lat: 40.7265, lng: -73.9815 },
    status: 'stable',
    avgWaitTime: 20,
    reportsCount: 22,
    lastReportDate: '2026-03-13T11:15:00',
    operatingHours: 'Tue-Sat 10AM-6PM',
    issues: 0,
  },
  {
    id: 'r5',
    name: 'South Community Kitchen',
    type: 'meal-program',
    neighborhood: 'South Side',
    district: 'District D',
    location: { lat: 40.7128, lng: -74.0060 },
    status: 'moderate',
    avgWaitTime: 35,
    reportsCount: 19,
    lastReportDate: '2026-03-13T13:30:00',
    operatingHours: 'Daily 12PM-2PM, 6PM-8PM',
    issues: 2,
  },
  {
    id: 'r6',
    name: 'Central Park Pantry',
    type: 'pantry',
    neighborhood: 'Midtown',
    district: 'District B',
    location: { lat: 40.7829, lng: -73.9654 },
    status: 'high-demand',
    avgWaitTime: 50,
    reportsCount: 28,
    lastReportDate: '2026-03-13T15:00:00',
    operatingHours: 'Mon-Fri 8AM-4PM',
    issues: 4,
  },
];

export const communityReports: CommunityReport[] = [
  {
    id: 'rep1',
    resourceId: 'r1',
    timestamp: '2026-03-13T10:30:00',
    photoUrl: 'https://images.unsplash.com/photo-1756158452957-cb6807d37d27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGFudHJ5JTIwc2hlbHZlcyUyMGRvbmF0aW9uc3xlbnwxfHx8fDE3NzMzNjU1NDh8MA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 12,
    foodAvailability: {
      produce: true,
      meat: true,
      pantryStaples: true,
    },
    comments: 'Well stocked today, great variety of fresh vegetables.',
    reporterLocation: 'Downtown',
  },
  {
    id: 'rep2',
    resourceId: 'r2',
    timestamp: '2026-03-13T14:00:00',
    photoUrl: 'https://images.unsplash.com/photo-1758940886543-c8146b0377fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBmcmlkZ2UlMjBzdHJlZXR8ZW58MXx8fHwxNzczMzY1NTQ5fDA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 45,
    foodAvailability: {
      produce: false,
      meat: false,
      pantryStaples: true,
    },
    comments: 'Long line today, mostly pantry staples available.',
    issues: 'Low on fresh produce',
    reporterLocation: 'West End',
  },
  {
    id: 'rep3',
    resourceId: 'r3',
    timestamp: '2026-03-12T18:45:00',
    photoUrl: 'https://images.unsplash.com/photo-1764015939108-7963106fa73b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwa2l0Y2hlbiUyMG1lYWx8ZW58MXx8fHwxNzczMzY1NTUwfDA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 28,
    foodAvailability: {
      produce: true,
      meat: true,
      pantryStaples: true,
    },
    comments: 'Hot meals served, friendly staff.',
    reporterLocation: 'North End',
  },
  {
    id: 'rep4',
    resourceId: 'r4',
    timestamp: '2026-03-13T11:15:00',
    photoUrl: 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHByb2R1Y2UlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3MzM2NTU0OXww&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 18,
    foodAvailability: {
      produce: true,
      meat: false,
      pantryStaples: true,
    },
    comments: 'Excellent selection of fresh produce.',
    reporterLocation: 'East Village',
  },
  {
    id: 'rep5',
    resourceId: 'r5',
    timestamp: '2026-03-13T13:30:00',
    photoUrl: 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzMzNjU1NDl8MA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 32,
    foodAvailability: {
      produce: true,
      meat: true,
      pantryStaples: true,
    },
    comments: 'Community volunteers doing great work.',
    reporterLocation: 'South Side',
  },
  {
    id: 'rep6',
    resourceId: 'r6',
    timestamp: '2026-03-13T15:00:00',
    photoUrl: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwYmFncyUyMGZvb2R8ZW58MXx8fHwxNzczMzY1NTUwfDA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 55,
    foodAvailability: {
      produce: false,
      meat: true,
      pantryStaples: true,
    },
    comments: 'Very busy, running low on produce.',
    issues: 'High demand, long wait times',
    reporterLocation: 'Midtown',
  },
  {
    id: 'rep7',
    resourceId: 'r1',
    timestamp: '2026-03-11T09:15:00',
    photoUrl: 'https://images.unsplash.com/photo-1767214223592-f8d280efa7cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uZWQlMjBmb29kJTIwcGFudHJ5fGVufDF8fHx8MTc3MzM2NTU1MHww&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 15,
    foodAvailability: {
      produce: true,
      meat: false,
      pantryStaples: true,
    },
    comments: 'Good stock of canned goods and staples.',
    reporterLocation: 'Downtown',
  },
  {
    id: 'rep8',
    resourceId: 'r2',
    timestamp: '2026-03-10T16:20:00',
    photoUrl: 'https://images.unsplash.com/photo-1631403633660-0b756efc3851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0JTIwcHJvZHVjZXxlbnwxfHx8fDE3NzMzMzAyMjN8MA&ixlib=rb-4.1.0&q=80&w=400',
    waitTime: 40,
    foodAvailability: {
      produce: true,
      meat: false,
      pantryStaples: false,
    },
    comments: 'Fresh market produce delivered.',
    reporterLocation: 'West End',
  },
];

// Trend data for charts
export const waitTimeTrends = [
  { date: 'Mar 6', avgWait: 25, reports: 45 },
  { date: 'Mar 7', avgWait: 28, reports: 52 },
  { date: 'Mar 8', avgWait: 22, reports: 48 },
  { date: 'Mar 9', avgWait: 30, reports: 55 },
  { date: 'Mar 10', avgWait: 27, reports: 50 },
  { date: 'Mar 11', avgWait: 32, reports: 58 },
  { date: 'Mar 12', avgWait: 29, reports: 54 },
  { date: 'Mar 13', avgWait: 31, reports: 60 },
];

export const demandByDistrict = [
  { district: 'District A', demand: 85, population: 45000 },
  { district: 'District B', demand: 120, population: 38000 },
  { district: 'District C', demand: 65, population: 52000 },
  { district: 'District D', demand: 95, population: 41000 },
];

export const foodAvailabilityTrends = [
  { week: 'Week 1', produce: 85, meat: 70, staples: 95 },
  { week: 'Week 2', produce: 78, meat: 65, staples: 92 },
  { week: 'Week 3', produce: 82, meat: 72, staples: 90 },
  { week: 'Week 4', produce: 75, meat: 68, staples: 88 },
];

export const serviceDisruptions = [
  {
    id: 'd1',
    resourceId: 'r2',
    resourceName: 'Westside Community Fridge',
    issue: 'High demand, low inventory',
    severity: 'high',
    reportedDate: '2026-03-13',
    status: 'active',
  },
  {
    id: 'd2',
    resourceId: 'r6',
    resourceName: 'Central Park Pantry',
    issue: 'Long wait times',
    severity: 'high',
    reportedDate: '2026-03-13',
    status: 'active',
  },
  {
    id: 'd3',
    resourceId: 'r5',
    resourceName: 'South Community Kitchen',
    issue: 'Staff shortage',
    severity: 'medium',
    reportedDate: '2026-03-12',
    status: 'monitoring',
  },
  {
    id: 'd4',
    resourceId: 'r3',
    resourceName: 'North End Meal Program',
    issue: 'Equipment maintenance',
    severity: 'low',
    reportedDate: '2026-03-11',
    status: 'resolved',
  },
];

export const impactMetrics = {
  totalReports: 1247,
  activeResources: 6,
  avgWaitTime: 31,
  resourcesWithIssues: 3,
  communitiesServed: 12,
  demandGrowth: 18, // percentage
  reportGrowth: 24, // percentage
  satisfactionRate: 87, // percentage
};
