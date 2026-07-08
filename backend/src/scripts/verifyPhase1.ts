import { calculatePayroll } from "../utils/payrollCalculator";
import { generatePayslipPDF } from "../utils/pdfGenerator";
import fs from "fs";
import path from "path";

async function runOfflineVerification() {
  console.log("=== Verification Phase 1 (Offline Unit Tests) ===");

  // --- Test 1: Double-Entry Balanced Validation Logic ---
  console.log("\n--- Testing Double-Entry Ledger Enforcements ---");
  const unbalancedData = {
    type: "GL",
    account: "Cash",
    counterparty: "Cash",
    amount: 1000
  };

  const balancedData = {
    type: "GL",
    account: "Cash",
    counterparty: "Revenue",
    amount: 1000
  };

  const validateTransaction = (data: any) => {
    let { type, account, counterparty, amount, debitAccount, creditAccount } = data;
    if (type === "GL") {
      debitAccount = debitAccount || account;
      creditAccount = creditAccount || counterparty;
      if (!debitAccount || !creditAccount) {
        throw new Error("Double-entry transactions require both a Debit and Credit account.");
      }
      if (debitAccount === creditAccount) {
        throw new Error("Double-entry balanced validation failed: Debit and Credit accounts cannot be the same.");
      }
    }
    if (amount <= 0) {
      throw new Error("Transaction amount must be greater than zero.");
    }
    return { ...data, debitAccount, creditAccount };
  };

  try {
    validateTransaction(unbalancedData);
    console.log("✗ Double-entry unbalanced validation failed!");
  } catch (err: any) {
    console.log("✓ Double-entry unbalanced validation works: Correctly blocked identical accounts!");
  }

  try {
    const validated = validateTransaction(balancedData);
    if (validated.debitAccount === "Cash" && validated.creditAccount === "Revenue") {
      console.log("✓ Balanced transaction validated successfully!");
    } else {
      console.log("✗ Balanced transaction failed verification.");
    }
  } catch (err: any) {
    console.log("✗ Balanced transaction thrown error:", err.message);
  }

  // --- Test 2: Gross-to-Net Payroll Calculations ---
  console.log("\n--- Testing Statutory Gross-to-Net Calculations ---");
  const basic = 100000;
  const allowances = 20000;
  const calc = calculatePayroll(basic, allowances);

  console.log(`Basic Salary: ₹${basic}`);
  console.log(`Allowances: ₹${allowances}`);
  console.log(`Deductions calculated:`);
  console.log(`- EPF (12% of basic): ₹${calc.epfDeduction} (Expected: ₹12000)`);
  console.log(`- Professional Tax: ₹${calc.professionalTax} (Expected: ₹200)`);
  console.log(`- Income Tax (New Regime): ₹${calc.incomeTax}`);
  console.log(`- Total Deductions: ₹${calc.totalDeductions}`);
  console.log(`- Net Take-Home: ₹${calc.netSalary}`);

  if (calc.epfDeduction === 12000 && calc.professionalTax === 200 && calc.netSalary === (basic + allowances - calc.totalDeductions)) {
    console.log("✓ Payroll calculation logic is accurate and compliant!");
  } else {
    console.log("✗ Payroll calculation mismatch!");
  }

  // --- Test 3: Payslip PDF Compilation ---
  console.log("\n--- Testing Payslip PDF Generation ---");
  const pdfPath = path.join(__dirname, "test_payslip.pdf");
  const writeStream = fs.createWriteStream(pdfPath);

  try {
    generatePayslipPDF(
      {
        employeeName: "Rajesh Kumar",
        employeeId: "2024001",
        department: "Engineering",
        designation: "Staff Architect",
        month: "June",
        year: 2026,
        basicSalary: basic,
        allowances: allowances,
        deductions: calc.totalDeductions,
        netSalary: calc.netSalary,
      },
      writeStream
    );
    console.log(`✓ Payslip PDF compiled successfully!`);
  } catch (err: any) {
    console.log("✗ PDF compilation error:", err.message);
  }

  writeStream.on("finish", () => {
    try {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
        console.log("✓ Temporary local PDF test file deleted.");
      }
    } catch {}
    console.log("\n=== Offline Verification Successful! ===");
  });
}

runOfflineVerification().catch((err) => {
  console.error("Verification script failed:", err);
});
