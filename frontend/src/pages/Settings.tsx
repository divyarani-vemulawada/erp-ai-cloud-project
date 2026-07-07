import { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import { toast } from 'sonner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import api from '../services/api';

type SettingsForm = {
  companyName: string;
  tenantCode: string;
  baseCurrency: string;
  timezone: string;
  approvalLimit: string;
  mfaRequired: boolean;
  emailNotifications: boolean;
};

const defaultSettings: SettingsForm = {
  companyName: 'Amdox Technologies',
  tenantCode: 'AMX-ERP',
  baseCurrency: 'INR',
  timezone: 'Asia/Kolkata',
  approvalLimit: '100000',
  mfaRequired: false,
  emailNotifications: true,
};

function Settings() {
  const [formData, setFormData] = useState(defaultSettings);
  const [message, setMessage] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    const response = await api.get('/settings');
    setFormData({
      companyName: response.data.companyName,
      tenantCode: response.data.tenantCode,
      baseCurrency: response.data.baseCurrency,
      timezone: response.data.timezone,
      approvalLimit: String(response.data.approvalLimit),
      mfaRequired: Boolean(response.data.mfaRequired),
      emailNotifications: Boolean(response.data.emailNotifications),
    });
  }, []);

  useEffect(() => {
    loadSettings().catch(() => setMessage('Unable to load tenant settings.'));
  }, [loadSettings]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.put('/settings', {
        ...formData,
        approvalLimit: Number(formData.approvalLimit),
      });
      setMessage('Settings saved successfully.');
      toast.success("Tenant settings updated successfully!");
    } catch {
      setMessage('Failed to save settings.');
      toast.error("Failed to save settings.");
    }
  };

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header"><h1>Tenant Settings</h1></div>
        {message && <div className="page-error settings-message">{message}</div>}
        <div className="module-form">
          <Card title="Company Configuration" />
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Company Name</label><Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company" /></div>
              <div className="form-group"><label>Tenant Code</label><Input name="tenantCode" value={formData.tenantCode} onChange={handleChange} placeholder="Tenant" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Base Currency</label><Input name="baseCurrency" value={formData.baseCurrency} onChange={handleChange} placeholder="INR" /></div>
              <div className="form-group"><label>Timezone</label><Input name="timezone" value={formData.timezone} onChange={handleChange} placeholder="Asia/Kolkata" /></div>
              <div className="form-group"><label>Approval Limit</label><Input type="number" name="approvalLimit" value={formData.approvalLimit} onChange={handleChange} placeholder="100000" /></div>
            </div>
            <div className="settings-toggles">
              <label><input type="checkbox" name="mfaRequired" checked={formData.mfaRequired} onChange={handleChange} /> MFA required</label>
              <label><input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} /> Email notifications</label>
            </div>
            <div className="form-actions"><Button text="Save Settings" type="submit" /></div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings;
