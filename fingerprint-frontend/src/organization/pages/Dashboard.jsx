import { useEffect, useState } from "react";
import { getAttendance } from "../../services/org.service";

export default function Dashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance()
      .then(res => {
        setRecords(res.data || []);
      })
      .catch(() => {
        // fallback mock data
        setRecords([
          { emp: "Afnan", device: "DEV001", time: "09:01", status: "GRANTED" },
          { emp: "John", device: "DEV002", time: "09:05", status: "GRANTED" },
          { emp: "Mark", device: "DEV001", time: "09:10", status: "DENIED" }
        ]);
      });
  }, []);

  return (
    <div>
      <h2>Attendance Dashboard</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Device</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.emp}</td>
              <td>{r.device}</td>
              <td>{r.time}</td>
              <td style={{ color: r.status === "GRANTED" ? "green" : "red" }}>
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

