import api from './api';

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
    const { data } = await api.get(`/parents/${parentId}/dashboard`);
    return data;
  },

  getChildrenDetails: async (parentId: string) => {
    const { data } = await api.get(`/parents/${parentId}/children`);
    return data;
  },

  getChildAttendance: async (parentId: string, childId: string) => {
    const { data } = await api.get(
      `/parents/${parentId}/children/${childId}/attendance`
    );
    return data;
  },

  getChildMarks: async (parentId: string, childId: string) => {
    const { data } = await api.get(
      `/parents/${parentId}/children/${childId}/marks`
    );
    return data;
  },

  getFeeDetails: async (parentId: string) => {
    const { data } = await api.get(`/parents/${parentId}/fees`);
    return data;
  },

  getMessages: async (parentId: string) => {
    const { data } = await api.get(`/parents/${parentId}/messages`);
    return data;
  },
};
