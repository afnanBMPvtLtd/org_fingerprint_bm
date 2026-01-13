import { useState, useEffect } from "react";

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Simulated device status (later from MQTT / API)
    setDevices([
      { id: "DEV001", location: "Office", status: "ONLINE", lastSeen: "Just now" },
      { id: "DEV002", location: "Factory", status: "OFFLINE", lastSeen: "5 min ago" },
      { id: "DEV003", location: "Warehouse", status: "ONLINE", lastSeen: "1 min ago" }
    ]);
  }, []);

  return (
    <div>
      <h2>Device Status</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.location}</td>
              <td style={{ color: d.status === "ONLINE" ? "green" : "red" }}>
                {d.status}
              </td>
              <td>{d.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
