import { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import type { Notification } from '../types/notification';
import {
  createNotification,
  getNotifications,
  markNotificationRead,
} from '../services/notificationService';

const emptyNotification = {
  title: '',
  message: '',
  channel: 'In-App',
  severity: 'Info',
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [formData, setFormData] = useState(emptyNotification);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setError(null);
      setNotifications(await getNotifications());
    } catch {
      setError('Failed to load notifications.');
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createNotification({
      ...formData,
      channel: formData.channel as Notification['channel'],
      severity: formData.severity as Notification['severity'],
    });
    setFormData(emptyNotification);
    setShowForm(false);
    await loadNotifications();
  };

  const handleRead = async (id: string) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Notification Engine</h1>
          {!showForm && <Button text="Create Alert" onClick={() => setShowForm(true)} />}
        </div>
        {error && <div className="page-error">{error}</div>}
        {showForm && (
          <div className="form-section module-form">
            <Card title="New Notification" />
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Title</label><Input name="title" value={formData.title} onChange={handleChange} placeholder="Approval required" /></div>
                <div className="form-group"><label>Channel</label><select className="form-select" name="channel" value={formData.channel} onChange={handleChange}><option>In-App</option><option>Email</option><option>SMS</option><option>Webhook</option></select></div>
                <div className="form-group"><label>Severity</label><select className="form-select" name="severity" value={formData.severity} onChange={handleChange}><option>Info</option><option>Warning</option><option>Critical</option></select></div>
              </div>
              <div className="form-row"><div className="form-group"><label>Message</label><Input name="message" value={formData.message} onChange={handleChange} placeholder="Alert message" /></div></div>
              <div className="form-actions"><Button text="Cancel" onClick={() => setShowForm(false)} /><Button text="Send Alert" type="submit" /></div>
            </form>
          </div>
        )}
        <div className="module-table">
          <Card title="Event Notifications" />
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Title</th><th>Message</th><th>Channel</th><th>Severity</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td><td>{item.message}</td><td>{item.channel}</td><td>{item.severity}</td><td><span className="status-pill">{item.status}</span></td>
                    <td>{item.status === 'Unread' && <Button text="Mark Read" onClick={() => handleRead(item.id)} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Notifications;
