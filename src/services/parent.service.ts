import { apiServices } from '../lib/api';
const api = apiServices;

export interface ParentDashboardStats {
  parentName: string;
  childrenStats: Array<{
    id: string;
    name: string;
    grade: string;
    attendance: number;
    currentAverage: number;
    upcomingTests: number;
    pendingAssignments: number;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: 'meeting' | 'exam' | 'event';
    childName?: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: 'grade' | 'attendance' | 'behavior' | 'message';
    description: string;
    date: string;
    childName: string;
  }>;
  financialSummary: {
    nextPaymentDue: string;
    amountDue: number;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    recentPayments: Array<{
      id: string;
      date: string;
      amount: number;
      description: string;
    }>;
  };
  academicCalendar: Array<{
    id: string;
    date: string;
    event: string;
    type: 'holiday' | 'exam' | 'activity';
  }>;
}

export const parentService = {
  getDashboardStats: async (
    parentId: string
  ): Promise<ParentDashboardStats> => {
    // Parent dashboard would need specific endpoint
    // For now, return mock structure or combine from multiple endpoints
    const response = await apiServices.students.getAll();
    return {
      parentName: 'Parent',
      childrenStats: (response.data || []).slice(0, 2).map((child: any, idx: number) => ({
        id: child.id || `c${idx}`,
        name: child.name || 'Child',
        grade: child.grade || 'N/A',
        attendance: 95,
        currentAverage: 85,
        upcomingTests: 2,
        pendingAssignments: 1
      })),
      recentActivities: [],
      financialSummary: {
        nextPaymentDue: '2024-02-01',
        amountDue: 5000,
        paymentStatus: 'pending' as const,
        recentPayments: []
      },
      academicCalendar: [],
      upcomingEvents: []
    };
  },

  getChildrenDetails: async (parentId: string) => {
    const response = await apiServices.students.getAll();
    // Filter students that belong to this parent
    return response.data || [];
  },

  getChildAttendance: async (parentId: string, childId: string) => {
    // Get attendance from students API
    const response = await apiServices.students.getById(childId);
    return response.data || {};
  },

  getChildMarks: async (parentId: string, childId: string) => {
    const response = await apiServices.marks.getById(childId);
    return response.data || {};
  },

  getFeeDetails: async (parentId: string) => {
    const response = await apiServices.fees.getAll();
    return response.data || [];
  },

  getMessages: async (parentId: string) => {
    // Messages would need specific endpoint
    // For now, return empty array
    return [];
  },
};
