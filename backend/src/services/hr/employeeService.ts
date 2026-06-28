import Employee from "../../models/hr/Employee";

export const getAllEmployees = async () => {
  return await Employee.find();
};

export const getEmployeeById = async (id: string) => {
  const employee = await Employee.findById(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const createEmployee = async (data: {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status?: "Active" | "Inactive";
}) => {
  const existingId = await Employee.findOne({ employeeId: data.employeeId });
  if (existingId) throw new Error("Employee ID already exists");

  const existingEmail = await Employee.findOne({ email: data.email });
  if (existingEmail) throw new Error("Email already exists");

  return await Employee.create(data);
};

export const updateEmployee = async (
  id: string,
  data: Partial<{
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    joiningDate: string;
    status: "Active" | "Inactive";
  }>
) => {
  const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const deleteEmployee = async (id: string) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw new Error("Employee not found");
  return employee;
};
