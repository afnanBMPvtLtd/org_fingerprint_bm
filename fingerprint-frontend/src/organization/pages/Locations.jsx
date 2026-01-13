import { useState } from "react";

export default function Locations() {
  const [location, setLocation] = useState("");

  function submit(e) {
    e.preventDefault();
    console.log("New Location:", location);
  }

  return (
    <div>
      <h2>Locations</h2>
      <form onSubmit={submit}>
        <input placeholder="Location Name" onChange={e => setLocation(e.target.value)} />
        <button>Add Location</button>
      </form>
    </div>
  );
}
