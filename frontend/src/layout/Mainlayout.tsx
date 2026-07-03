import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProfileDrawer from './ProfileDrawer';
import { SidebarProvider } from '../context/SidebarContext';

type Props = { children: React.ReactNode };

function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
      <ProfileDrawer />
    </SidebarProvider>
  );
}

export default MainLayout;