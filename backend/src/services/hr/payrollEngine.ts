export interface SalaryComponents {
  basicSalary: number;
  allowances: number;
  deductions: number;
}

export interface SalaryBreakdown {
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

export const computeNetSalary = (components: SalaryComponents): SalaryBreakdown => {
  const grossSalary = components.basicSalary + components.allowances;
  const netSalary   = grossSalary - components.deductions;
  return {
    basicSalary:  components.basicSalary,
    allowances:   components.allowances,
    grossSalary,
    deductions:   components.deductions,
    netSalary,
  };
};

export const validateSalaryComponents = (components: SalaryComponents): string | null => {
  if (components.basicSalary <= 0) return "Basic salary must be greater than zero";
  if (components.allowances < 0)   return "Allowances cannot be negative";
  if (components.deductions < 0)   return "Deductions cannot be negative";
  const gross = components.basicSalary + components.allowances;
  if (components.deductions > gross) return "Deductions cannot exceed gross salary";
  return null;
};
