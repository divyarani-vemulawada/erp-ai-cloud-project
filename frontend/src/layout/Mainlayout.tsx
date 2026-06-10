import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          <h1>Dashboard Content</h1>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;