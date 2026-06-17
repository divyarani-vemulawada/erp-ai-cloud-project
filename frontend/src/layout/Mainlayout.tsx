import Sidebar from './Sidebar';
import Navbar from './Navbar';
type Props = {children: React.ReactNode;};
function MainLayout({children}: Props) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
export default MainLayout;