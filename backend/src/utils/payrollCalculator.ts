export interface IPayrollCalculation {
  basicSalary: number;
  allowances: number;
  epfDeduction: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netSalary: number;
}

export const calculatePayroll = (basicSalary: number, allowances: number = 0): IPayrollCalculation => {
  const monthlyGross = basicSalary + allowances;
  const annualGross = monthlyGross * 12;
  
  // 1. Standard Deduction (New Regime: ₹75,000)
  const standardDeduction = 75000;
  const taxableAnnual = Math.max(0, annualGross - standardDeduction);

  // 2. Income Tax under New Tax Slabs (FY 2025-26 / 2026-27 rules)
  let annualTax = 0;

  // Under Section 87A rebate: if net taxable income is <= ₹7,00,000, tax is zero
  if (taxableAnnual > 700000) {
    let tempIncome = taxableAnnual;

    // Slab 1: Up to 3 Lakhs -> 0%
    tempIncome = Math.max(0, tempIncome - 300000);

    // Slab 2: 3L to 6L -> 5%
    const slab2Taxable = Math.min(tempIncome, 300000);
    annualTax += slab2Taxable * 0.05;
    tempIncome = Math.max(0, tempIncome - 300000);

    // Slab 3: 6L to 9L -> 10%
    const slab3Taxable = Math.min(tempIncome, 300000);
    annualTax += slab3Taxable * 0.10;
    tempIncome = Math.max(0, tempIncome - 300000);

    // Slab 4: 9L to 12L -> 15%
    const slab4Taxable = Math.min(tempIncome, 300000);
    annualTax += slab4Taxable * 0.15;
    tempIncome = Math.max(0, tempIncome - 300000);

    // Slab 5: 12L to 15L -> 20%
    const slab5Taxable = Math.min(tempIncome, 300000);
    annualTax += slab5Taxable * 0.20;
    tempIncome = Math.max(0, tempIncome - 300000);

    // Slab 6: Above 15L -> 30%
    if (tempIncome > 0) {
      annualTax += tempIncome * 0.30;
    }
  }

  const monthlyIncomeTax = Math.round(annualTax / 12);

  // 3. EPF Deduction (12% of basic salary)
  const monthlyEPF = Math.round(basicSalary * 0.12);

  // 4. Professional Tax (Standard flat rate of ₹200 for gross > ₹15,000, else 0)
  const monthlyPT = monthlyGross > 15000 ? 200 : 0;

  // 5. Aggregates
  const totalDeductions = monthlyEPF + monthlyPT + monthlyIncomeTax;
  const netSalary = Math.max(0, monthlyGross - totalDeductions);

  return {
    basicSalary,
    allowances,
    epfDeduction: monthlyEPF,
    professionalTax: monthlyPT,
    incomeTax: monthlyIncomeTax,
    totalDeductions,
    netSalary,
  };
};
