import Sidebar from './Sidebar';
import Navbar from './Navbar';
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
    </SidebarProvider>
  );
}

export default MainLayout;