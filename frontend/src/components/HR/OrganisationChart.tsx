import type { Employee } from '../../types/hr';
import Card from '../common/Card';

type OrganisationChartProps = {
  employees: Employee[];
};

function OrganisationChart({ employees }: OrganisationChartProps) {
  const departments = employees.reduce<Record<string, Employee[]>>((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = [];
    acc[emp.department].push(emp);
    return acc;
  }, {});

  return (
    <div className="org-chart">
      {Object.entries(departments).map(([dept, deptEmployees]) => (
        <Card key={dept} title={dept}>
          <ul className="org-chart-list">
            {deptEmployees.map((emp) => (
              <li key={emp.id} className="org-chart-item">
                <span className="org-name">{emp.fullName}</span>
                <span className="org-designation">{emp.designation}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export default OrganisationChart;
