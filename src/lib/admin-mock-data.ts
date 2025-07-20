// Mock data for admin panel development
// This should be replaced with real API calls in production

export const mockUsers = [
  {
    id: '1',
    email: 'sarah.mitchell@example.com',
    first_name: 'Sarah',
    last_name: 'Mitchell',
    role: 'playwright' as const,
    is_verified: true,
    status: 'active' as const,
    created_at: '2024-01-01T10:00:00Z',
    last_login: '2024-01-20T15:30:00Z',
    scripts_count: 12,
    purchases_count: 3,
  },
  {
    id: '2',
    email: 'info@broadwaytheater.com',
    first_name: 'Broadway',
    last_name: 'Theater',
    role: 'theater_company' as const,
    is_verified: true,
    status: 'active' as const,
    created_at: '2024-01-02T11:00:00Z',
    last_login: '2024-01-20T14:00:00Z',
    scripts_count: 0,
    purchases_count: 25,
  },
  {
    id: '3',
    email: 'john.writer@example.com',
    first_name: 'John',
    last_name: 'Writer',
    role: 'playwright' as const,
    is_verified: true,
    status: 'suspended' as const,
    created_at: '2024-01-03T09:00:00Z',
    last_login: '2024-01-15T10:00:00Z',
    scripts_count: 5,
    purchases_count: 0,
  },
];

export const mockScripts = [
  {
    id: '1',
    title: 'A Midsummer Night\'s Dream - Modern Adaptation',
    author: {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@example.com',
    },
    genre: 'Comedy',
    cast_size: 12,
    duration_minutes: 120,
    synopsis: 'A contemporary retelling of Shakespeare\'s classic comedy, set in a modern city where technology and magic collide.',
    submitted_at: '2024-01-15T10:00:00Z',
    status: 'pending' as const,
    file_url: '/scripts/midsummer-modern.pdf',
  },
  {
    id: '2',
    title: 'The Last Station',
    author: {
      id: '4',
      name: 'Michael Chen',
      email: 'mchen@example.com',
    },
    genre: 'Drama',
    cast_size: 6,
    duration_minutes: 90,
    synopsis: 'A poignant drama about the final days of a small town train station and the lives it has touched over generations.',
    submitted_at: '2024-01-14T14:30:00Z',
    status: 'under_review' as const,
    review_notes: 'Currently reviewing for historical accuracy and copyright clearances.',
    file_url: '/scripts/last-station.pdf',
  },
  {
    id: '3',
    title: 'Cyber Dreams',
    author: {
      id: '5',
      name: 'Emily Rodriguez',
      email: 'erodriguez@example.com',
    },
    genre: 'Sci-Fi',
    cast_size: 8,
    duration_minutes: 110,
    synopsis: 'In a future where dreams can be recorded and shared, a group of hackers discovers a conspiracy that threatens humanity.',
    submitted_at: '2024-01-13T16:00:00Z',
    status: 'pending' as const,
    flags: {
      copyright: true,
    },
    file_url: '/scripts/cyber-dreams.pdf',
  },
];

export const mockDashboardStats = {
  users: {
    total: 2847,
    active: 2341,
    new_this_month: 156,
    growth_percentage: 12,
  },
  scripts: {
    total: 1429,
    pending_review: 23,
    approved_this_month: 89,
    rejection_rate: 8,
  },
  revenue: {
    total_this_month: 45230,
    total_last_month: 36784,
    growth_percentage: 23,
    pending_payouts: 8420,
  },
  platform: {
    uptime_percentage: 99.9,
    active_sessions: 342,
    api_response_time: 124,
    storage_used_gb: 847,
  },
};

// Mock API responses
export const mockApiResponses = {
  admin: {
    getUsers: async () => ({
      users: mockUsers,
      total: mockUsers.length,
      limit: 10,
      offset: 0,
    }),
    
    getScripts: async () => ({
      scripts: mockScripts,
      total: mockScripts.length,
      limit: 10,
      offset: 0,
    }),
    
    getDashboardStats: async () => ({
      stats: mockDashboardStats,
    }),
    
    updateUserStatus: async (userId: string, action: string) => {
      console.log(`Mock: ${action} user ${userId}`);
      return { success: true };
    },
    
    reviewScript: async (scriptId: string, data: any) => {
      console.log(`Mock: ${data.action} script ${scriptId}`, data);
      return { success: true };
    },
  },
};