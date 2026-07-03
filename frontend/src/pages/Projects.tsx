import { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import type { Project } from '../types/project';
import { createProject, getProjects } from '../services/projectService';

const emptyProject = {
  projectCode: '',
  name: '',
  owner: '',
  startDate: '',
  dueDate: '',
  budget: '',
  actualSpend: '',
  progress: '',
  status: 'Planning',
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyProject);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProjects(await getProjects());
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createProject({
        ...formData,
        status: formData.status as Project['status'],
        budget: Number(formData.budget),
        actualSpend: Number(formData.actualSpend),
        progress: Number(formData.progress),
      });
      setFormData(emptyProject);
      setShowForm(false);
      await loadProjects();
    } catch {
      setError('Failed to save project.');
    }
  };

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Project Management</h1>
          {!showForm && <Button text="Add Project" onClick={() => setShowForm(true)} />}
        </div>
        {error && <div className="page-error">{error}</div>}

        {showForm && (
          <div className="form-section module-form">
            <Card title="New Project" />
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Project Code</label><Input name="projectCode" value={formData.projectCode} onChange={handleChange} placeholder="PRJ-001" /></div>
                <div className="form-group"><label>Name</label><Input name="name" value={formData.name} onChange={handleChange} placeholder="ERP Rollout" /></div>
                <div className="form-group"><label>Owner</label><Input name="owner" value={formData.owner} onChange={handleChange} placeholder="Project owner" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label><Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Start" /></div>
                <div className="form-group"><label>Due Date</label><Input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} placeholder="Due" /></div>
                <div className="form-group"><label>Status</label><select className="form-select" name="status" value={formData.status} onChange={handleChange}><option>Planning</option><option>Active</option><option>At Risk</option><option>Completed</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Budget</label><Input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="200000" /></div>
                <div className="form-group"><label>Actual Spend</label><Input type="number" name="actualSpend" value={formData.actualSpend} onChange={handleChange} placeholder="50000" /></div>
                <div className="form-group"><label>Progress %</label><Input type="number" name="progress" value={formData.progress} onChange={handleChange} placeholder="35" /></div>
              </div>
              <div className="form-actions"><Button text="Cancel" onClick={() => setShowForm(false)} /><Button text="Save Project" type="submit" /></div>
            </form>
          </div>
        )}

        <div className="module-table">
          <Card title="Project Portfolio" />
          {loading ? <p className="loading-text">Loading projects...</p> : (
            <>
              <div className="table-wrapper">
                <table className="table">
                  <thead><tr><th>Code</th><th>Name</th><th>Owner</th><th>Timeline</th><th>Budget</th><th>Progress</th><th>Status</th></tr></thead>
                  <tbody>
                    {projects.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((project) => (
                      <tr key={project.id}>
                        <td>{project.projectCode}</td><td>{project.name}</td><td>{project.owner}</td><td>{project.startDate} to {project.dueDate}</td>
                        <td>{project.actualSpend.toLocaleString()} / {project.budget.toLocaleString()}</td>
                        <td><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div></td>
                        <td>
                          <span className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Math.ceil(projects.length / rowsPerPage) > 1 && (
                <div className="pagination-wrapper">
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      type="button"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: Math.ceil(projects.length / rowsPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                        type="button"
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      disabled={currentPage === Math.ceil(projects.length / rowsPerPage)}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(projects.length / rowsPerPage)))}
                      type="button"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Projects;
