export type ReportSummary = {
  employees: number;
  presentAttendanceRecords: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  financeByType: Array<{ _id: string; total: number }>;
  lowStockItems: number;
  openPurchaseOrders: number;
  atRiskProjects: number;
  unreadNotifications: number;
};
