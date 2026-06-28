import Payroll from "../../models/hr/Payroll";

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
  deductions?: number;
  netSalary: number;
}) => {
  return await Payroll.create(data);
};

export const updatePayroll = async (
  id: string,
  data: Partial<{
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
  }>
) => {
  const payroll = await Payroll.findByIdAndUpdate(id, data, { new: true });
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};

export const deletePayroll = async (id: string) => {
  const payroll = await Payroll.findByIdAndDelete(id);
  if (!payroll) throw new Error("Payroll record not found");
  return payroll;
};
