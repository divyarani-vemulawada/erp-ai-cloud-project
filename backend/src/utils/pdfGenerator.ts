import PDFDocument from "pdfkit";
import { Writable } from "stream";

interface IPayslipData {
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

export const generatePayslipPDF = (data: IPayslipData, stream: Writable): void => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.pipe(stream);

  // --- HEADER SECTION ---
  // Draw premium brand accent band
  doc
    .rect(0, 0, doc.page.width, 15)
    .fill("#4f46e5");

  // Logo Grid Accent (3 Indigo dots + 1 Cyan dot representation in PDF)
  doc.rect(50, 40, 10, 10).fill("#4f46e5");
  doc.rect(63, 40, 10, 10).fill("#06b6d4");
  doc.rect(50, 53, 10, 10).fill("#8b5cf6");
  doc.rect(63, 53, 10, 10).fill("#6366f1");

  // Title & Subtitle
  doc
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Amdox ERP", 85, 38);

  doc
    .fillColor("#64748b")
    .font("Helvetica-Oblique")
    .fontSize(9)
    .text("Smart Enterprise Suite | Payroll Division", 85, 60);

  doc
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("SALARY PAYSLIP", 400, 43, { align: "right" });

  doc
    .fillColor("#4f46e5")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`Statement Period: ${data.month} ${data.year}`, 400, 62, { align: "right" });

  // Divider Line
  doc
    .moveTo(50, 85)
    .lineTo(550, 85)
    .strokeColor("#cbd5e1")
    .lineWidth(1)
    .stroke();

  // --- EMPLOYEE INFORMATION SECTION ---
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(11).text("EMPLOYEE INFORMATION", 50, 105);

  const startY = 125;
  const col1X = 50;
  const col2X = 300;

  // Left Column
  doc.font("Helvetica-Bold").fontSize(9).text("Employee Name:", col1X, startY);
  doc.font("Helvetica").text(data.employeeName, col1X + 90, startY);

  doc.font("Helvetica-Bold").text("Employee ID:", col1X, startY + 18);
  doc.font("Helvetica").text(data.employeeId, col1X + 90, startY + 18);

  doc.font("Helvetica-Bold").text("Department:", col1X, startY + 36);
  doc.font("Helvetica").text(data.department, col1X + 90, startY + 36);

  // Right Column
  doc.font("Helvetica-Bold").text("Designation:", col2X, startY);
  doc.font("Helvetica").text(data.designation, col2X + 90, startY);

  doc.font("Helvetica-Bold").text("Currency:", col2X, startY + 18);
  doc.font("Helvetica").text("INR (Indian Rupee)", col2X + 90, startY + 18);

  doc.font("Helvetica-Bold").text("Payment Mode:", col2X, startY + 36);
  doc.font("Helvetica").text("Bank Transfer", col2X + 90, startY + 36);

  // Divider Line
  doc
    .moveTo(50, 195)
    .lineTo(550, 195)
    .strokeColor("#cbd5e1")
    .lineWidth(1)
    .stroke();

  // --- SALARY BREAKDOWN TABLE SECTION ---
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(11).text("SALARY BREAKDOWN", 50, 215);

  // Table Headers
  const tableY = 240;
  doc.rect(50, tableY, 245, 20).fill("#f8fafc");
  doc.rect(305, tableY, 245, 20).fill("#f8fafc");

  doc.fillColor("#334155").font("Helvetica-Bold").fontSize(9).text("EARNINGS", 60, tableY + 6);
  doc.text("Amount (INR)", 220, tableY + 6, { align: "right" });

  doc.text("DEDUCTIONS", 315, tableY + 6);
  doc.text("Amount (INR)", 475, tableY + 6, { align: "right" });

  // Table Body Rows
  const rowY = tableY + 25;

  // Row 1: Basic vs EPF
  doc.fillColor("#0f172a").font("Helvetica").text("Basic Salary", 60, rowY);
  doc.text(`₹${data.basicSalary.toLocaleString()}`, 220, rowY, { align: "right" });

  const epf = Math.round(data.basicSalary * 0.12);
  doc.text("Provident Fund (EPF - 12%)", 315, rowY);
  doc.text(`₹${epf.toLocaleString()}`, 475, rowY, { align: "right" });

  // Row 2: Allowances vs Professional Tax
  doc.text("Allowances", 60, rowY + 18);
  doc.text(`₹${data.allowances.toLocaleString()}`, 220, rowY + 18, { align: "right" });

  const pt = data.basicSalary + data.allowances > 15000 ? 200 : 0;
  doc.text("Professional Tax (PT)", 315, rowY + 18);
  doc.text(`₹${pt.toLocaleString()}`, 475, rowY + 18, { align: "right" });

  // Row 3: Empty vs Income Tax
  const it = Math.max(0, data.deductions - epf - pt);
  doc.text("Income Tax (TDS)", 315, rowY + 36);
  doc.text(`₹${it.toLocaleString()}`, 475, rowY + 36, { align: "right" });

  // Table Totals
  const totalY = rowY + 70;
  doc.rect(50, totalY, 245, 20).fill("#f1f5f9");
  doc.rect(305, totalY, 245, 20).fill("#f1f5f9");

  const totalEarnings = data.basicSalary + data.allowances;
  doc.fillColor("#0f172a").font("Helvetica-Bold").text("Total Earnings (Gross)", 60, totalY + 6);
  doc.text(`₹${totalEarnings.toLocaleString()}`, 220, totalY + 6, { align: "right" });

  doc.text("Total Deductions", 315, totalY + 6);
  doc.text(`₹${data.deductions.toLocaleString()}`, 475, totalY + 6, { align: "right" });

  // --- SUMMARY PAYABLE SECTION ---
  const summaryY = totalY + 45;
  doc.rect(50, summaryY, 500, 45).fill("#4f46e5");

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("NET SALARY PAYABLE (NET TAKE-HOME)", 65, summaryY + 16);

  doc
    .fontSize(16)
    .text(`₹${data.netSalary.toLocaleString()}`, 350, summaryY + 14, { align: "right", width: 185 });

  // Footer notes
  doc
    .fillColor("#94a3b8")
    .font("Helvetica")
    .fontSize(8)
    .text("This is an electronically generated statement and does not require a physical signature.", 50, 450, { align: "center" });

  doc.end();
};
