import Payslip from "../../models/hr/Payslip";

export const getAllPayslips = async () => {
  return await Payslip.find().sort({ year: -1, month: 1 });
};

export const getPayslipById = async (id: string) => {
  const payslip = await Payslip.findById(id);
  if (!payslip) throw new Error("Payslip not found");
  return payslip;
};

export const getPayslipsByEmployee = async (employeeId: string) => {
  return await Payslip.find({ employeeId }).sort({ year: -1, month: 1 });
};

export const createPayslip = async (data: {
  employeeId: string;
  payrollId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}) => {
  const existing = await Payslip.findOne({
    employeeId: data.employeeId,
    month: data.month,
    year: data.year,
  });
  if (existing) throw new Error("Payslip already exists for this employee and period");

  return await Payslip.create({ ...data, generatedAt: new Date() });
};

export const deletePayslip = async (id: string) => {
  const payslip = await Payslip.findByIdAndDelete(id);
  if (!payslip) throw new Error("Payslip not found");
  return payslip;
};
