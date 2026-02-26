import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { menuConfig } from "./menu.config";

const Sidebar = ({ open, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname.includes(path) ? "active" : "";

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <Nav className="flex-column">
        {menuConfig.map((group) => (
          <div key={group.section}>
            {open && <p className="sidebar-section">{group.section}</p>}

            {group.items.map(({ label, path, icon: Icon }) => (
              <Nav.Link
                key={path}
                className={`sidebar-link ${isActive(path)}`}
                onClick={() => {
                  navigate(path);
                  onNavigate();
                }}
              >
                <Icon />
                {open && <span>{label}</span>}
              </Nav.Link>
            ))}
          </div>
        ))}
      </Nav>
    </aside>
  );
};

export default Sidebar;
