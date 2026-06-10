function Sidebar(){
    return(
        <div className="sidebar">
            <h2 className="csn">ERP SYSTEM</h2>
            <nav>
                <ul>
                    <li>
                        <a href="/">Dashboard</a>
                    </li>
                    <li>
                        <a href="/hr">HR Module</a>
                    </li>
                    <li>
                        <a href="/finance">Finance</a>
                    </li>

                    <li>
                        <a href="/supply-chain">Supply Chain</a>
                    </li>

                    <li>
                        <a href="/reports">Reports</a>
                    </li>

                    <li>
                        <a href="/settings">Settings</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
export default Sidebar