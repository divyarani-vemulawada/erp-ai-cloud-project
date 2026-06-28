// Employee type definition
export type Employee = {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: "Active" | "Inactive";
};

// Leave Request type definition
export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

// Attendance type definition
export type Attendance = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent";
};

// Payroll type definition
export type Payroll = {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
};

// Payslip type definition
export type Payslip = {
  id: string;
  employeeId: string;
  payrollId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  generatedAt: string;
  status: "Draft" | "Issued" | "Cancelled";
};

// Organisation hierarchy type definition
export type OrgDepartment = {
  name: string;
  employeeCount: number;
  employees: Pick<Employee, "employeeId" | "fullName" | "designation" | "department" | "status">[];
};
