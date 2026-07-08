import Payroll from "../../models/hr/Payroll";
import { calculatePayroll } from "../../utils/payrollCalculator";

export const getAllPayroll = async () => {
  return await Payroll.find();
};

export const getPayrollById = async (id: string) => {
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};

export const createPayroll = async (data: {
  employeeId: string;
  basicSalary: number;
  allowances?: number;
}) => {
  const allowances = data.allowances || 0;
  const calc = calculatePayroll(data.basicSalary, allowances);
  
  return await Payroll.create({
    employeeId: data.employeeId,
    basicSalary: data.basicSalary,
    allowances,
    deductions: calc.totalDeductions,
    netSalary: calc.netSalary,
  });
};

export const updatePayroll = async (
  id: string,
  data: Partial<{
    basicSalary: number;
    allowances: number;
  }>
) => {
  const existing = await Payroll.findById(id);
  if (!existing) throw new Error("Payroll record not found");

  const basic = data.basicSalary !== undefined ? data.basicSalary : existing.basicSalary;
  const allow = data.allowances !== undefined ? data.allowances : existing.allowances;
  
  const calc = calculatePayroll(basic, allow);

  const payroll = await Payroll.findByIdAndUpdate(
    id,
    {
      basicSalary: basic,
      allowances: allow,
      deductions: calc.totalDeductions,
      netSalary: calc.netSalary,
    },
    { returnDocument: 'after' }
  );
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};

export const deletePayroll = async (id: string) => {
  const payroll = await Payroll.findByIdAndDelete(id);
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};
