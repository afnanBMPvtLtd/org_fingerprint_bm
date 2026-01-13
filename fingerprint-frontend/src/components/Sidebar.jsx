import { Link } from "react-router-dom";

export default function Sidebar({ links }) {
  return (
    <div style={{ width: "200px", padding: "10px", borderRight: "1px solid #ccc" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {links.map(link => (
          <li key={link.to} style={{ marginBottom: "10px" }}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
