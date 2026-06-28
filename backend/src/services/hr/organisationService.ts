import Employee from "../../models/hr/Employee";

// Designation seniority keywords ordered highest → lowest.
// Used to sort employees within a department by rank.
const SENIORITY_KEYWORDS = [
  "chief", "president", "vp", "vice president",
  "director", "head",
  "manager", "lead", "principal", "architect",
  "senior", "sr.",
  "engineer", "developer", "analyst", "accountant", "recruiter",
  "associate", "junior", "jr.",
];

const designationRank = (designation: string): number => {
  const lower = designation.toLowerCase();
  for (let i = 0; i < SENIORITY_KEYWORDS.length; i++) {
    if (lower.includes(SENIORITY_KEYWORDS[i])) return i;
  }
  return SENIORITY_KEYWORDS.length;
};

export const getOrganisationHierarchy = async () => {
  const employees = await Employee.find().sort({ department: 1 });

  const deptMap: Record<string, typeof employees[number][]> = {};
  for (const emp of employees) {
    if (!deptMap[emp.department]) deptMap[emp.department] = [];
    deptMap[emp.department].push(emp);
  }

  return Object.entries(deptMap).map(([name, emps]) => ({
    name,
    employeeCount: emps.length,
    employees: [...emps]
      .sort((a, b) => designationRank(a.designation) - designationRank(b.designation))
      .map(({ employeeId, fullName, designation, department, status }) => ({
        employeeId,
        fullName,
        designation,
        department,
        status,
      })),
  }));
};
