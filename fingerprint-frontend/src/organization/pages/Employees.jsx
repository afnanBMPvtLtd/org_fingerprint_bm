import { useState } from "react";

export default function Employees() {
  const [emp, setEmp] = useState({
    name: "",
    empId: ""
  });

  function handleChange(e) {
    setEmp({ ...emp, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    console.log("Add Employee:", emp);
  }

  return (
    <div>
      <h2>Employees</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Employee Name" onChange={handleChange} />
        <input name="empId" placeholder="Employee ID" onChange={handleChange} />
        <button>Add Employee</button>
      </form>
    </div>
  );
}
