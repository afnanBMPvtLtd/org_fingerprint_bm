import { useState } from "react";

export default function CreateOrganization() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    adminEmail: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Create Organization:", form);
  }

  return (
    <div>
      <h2>Create Organization</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Organization Name" onChange={handleChange} />
        <input name="code" placeholder="Organization Code" onChange={handleChange} />
        <input name="adminEmail" placeholder="Admin Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
