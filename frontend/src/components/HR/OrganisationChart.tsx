import type { OrgDepartment } from '../../types/hr';
import Card from '../common/Card';

type OrganisationChartProps = {
  departments: OrgDepartment[];
};

function OrganisationChart({ departments }: OrganisationChartProps) {
  return (
    <div className="org-chart">
      {departments.map((dept) => (
        <Card key={dept.name} title={dept.name}>
          <ul className="org-chart-list">
            {dept.employees.map((emp) => (
              <li key={emp.employeeId} className="org-chart-item">
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
