import { useState } from "react";

export default function EnrollEmployee() {
  const [location, setLocation] = useState("");
  const [device, setDevice] = useState("");
  const [employee, setEmployee] = useState("");
  const [status, setStatus] = useState("IDLE");

  function startEnroll() {
    if (!location || !device || !employee) {
      alert("Select all fields");
      return;
    }

    setStatus("WAITING");

    // simulate device response
    setTimeout(() => {
      setStatus("SUCCESS");
    }, 3000);
  }

  return (
    <div>
      <h2>Fingerprint Enrollment</h2>

      <div>
        <label>Location</label><br />
        <select onChange={e => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          <option value="LOC1">Office</option>
          <option value="LOC2">Factory</option>
        </select>
      </div>

      <br />

      <div>
        <label>Device</label><br />
        <select onChange={e => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="DEV001">Device 001</option>
          <option value="DEV002">Device 002</option>
        </select>
      </div>

      <br />

      <div>
        <label>Employee</label><br />
        <select onChange={e => setEmployee(e.target.value)}>
          <option value="">Select Employee</option>
          <option value="EMP001">John</option>
          <option value="EMP002">Afnan</option>
        </select>
      </div>

      <br />

      <button onClick={startEnroll}>
        Start Enrollment
      </button>

      <br /><br />

      {status === "WAITING" && <p>Waiting for fingerprint...</p>}
      {status === "SUCCESS" && <p style={{ color: "green" }}>Enrollment Successful</p>}
      {status === "FAILED" && <p style={{ color: "red" }}>Enrollment Failed</p>}
    </div>
  );
}
