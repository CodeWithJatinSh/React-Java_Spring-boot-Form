import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import CryptoJS from "crypto-js";

// AG Grid Styles
import "ag-grid-community/styles/ag-theme-quartz.css";

// AG Grid Modules
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";

import "./App.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
]);

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    city: "",
    password: "",
    dob: "",
  });

  const [rowData, setRowData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Encryption key - Change this to your own secret key
  const ENCRYPTION_KEY = "Form1234";

  // ---------------- ENCRYPTION FUNCTIONS ---------------------

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  const decryptPassword = (encryptedPassword) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return encryptedPassword; // Return as-is if decryption fails
    }
  };

  // ---------------- DATE FORMATTERS ---------------------

  const formatDOB = (value) => {
    if (!value) return "";
    const date = new Date(value);

    return `${date.getDate()} ${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  // ---------------- AG GRID COLUMNS ---------------------

  const columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Gender", field: "gender" },
    { headerName: "City", field: "city" },
    { 
      headerName: "Password", 
      field: "password",
      // Show encrypted password as dots/asterisks
      valueFormatter: (params) => params.value.substring(0, 10) + "..."
    },

    {
      headerName: "Date of Birth",
      field: "dob",
      valueFormatter: (params) => formatDOB(params.value),
    },
    {
      headerName: "Created At",
      field: "createdAt",
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: "Edit",
      width: 120,
      cellRenderer: (params) => (
        <button className="action-btn edit-btn" onClick={() => handleEdit(params.data)}>
          Edit
        </button>
      ),
    },
    {
      headerName: "Delete",
      width: 120,
      cellRenderer: (params) => (
        <button className="action-btn delete-btn" onClick={() => handleDelete(params.data.id)}>
          Delete
        </button>
      ),
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 140,
    sortable: true,
    filter: true,
  };

  // ---------------- FORM HANDLERS ---------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Encrypt the password before sending to backend
    const dataToSend = {
      ...formData,
      password: encryptPassword(formData.password)
    };

    const url =
      editingId === null
        ? "http://localhost:8080/users"
        : `http://localhost:8080/users/${editingId}`;

    const method = editingId === null ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (editingId === null) {
        setRowData((prev) => [...prev, result]);
      } else {
        setRowData((prev) =>
          prev.map((row) => (row.id === editingId ? result : row))
        );
        setEditingId(null);
      }

      setFormData({
        name: "",
        email: "",
        gender: "",
        city: "",
        password: "",
        dob: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      city: user.city || "",
      // Decrypt password for editing
      password: decryptPassword(user.password) || "",
      dob: user.dob || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" });
      setRowData((prev) => prev.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // FETCH ALL USERS
  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setRowData(data))
      .catch((error) => console.error("API error:", error));
  }, []);

  return (
    <div className="container">
      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <h2>{editingId === null ? "Add User" : "Edit User"}</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />

        <button type="submit">
          {editingId === null ? "Submit" : "Update"}
        </button>
      </form>

      {/* AG GRID FULL SCREEN WIDTH */}
      <div className="ag-theme-quartz-dark ag-grid-wrapper">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
}

export default App;
