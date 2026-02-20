import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import CryptoJS from "crypto-js";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";

// AG Grid Styles
import "ag-grid-community/styles/ag-theme-quartz.css";

// AG Grid Modules
import {
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CellStyleModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";

import "./App.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CellStyleModule,
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessages, setPopupMessages] = useState([]);

  const ENCRYPTION_KEY = "Form1234";

  // ---------------- PASSWORD ENCRYPTION ---------------------

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
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

  const formatDisplayDOB = (dob) => {
    if (!dob) return "DD-MMM-YYYY";
    const [y, m, d] = dob.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${d}-${months[parseInt(m) - 1]}-${y}`;
  };

  // ---------------- AG GRID COLUMNS ---------------------

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 70,
      cellClass: "ag-center",
      headerClass: "ag-center",
      sortable: false,
      filter: false,
    },
    {
      headerName: "Name",
      field: "name",
      width: 160,
      cellClass: "ag-left",
      headerClass: "ag-left",
    },
    {
      headerName: "Email",
      field: "email",
      width: 260,
      cellClass: "ag-left",
      headerClass: "ag-left",
    },
    {
      headerName: "Gender",
      field: "gender",
      width: 110,
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
    {
      headerName: "City",
      field: "city",
      width: 130,
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
    {
      headerName: "Date of Birth",
      field: "dob",
      width: 130,
      valueFormatter: (params) => formatDOB(params.value),
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
    {
      headerName: "Created Date & Time",
      field: "createdAt",
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
    {
      headerName: "Updated Date & Time",
      field: "updatedAt",
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
    {
      headerName: "Options",
      width: 140,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <div className="icon-btn edit-btn" onClick={() => handleEdit(params.data)}>
            <FaEdit size={14} />
          </div>
          <div
            className="icon-btn delete-btn"
            onClick={() => handleDelete(params.data.id)}
          >
            <FaTrash size={14} />
          </div>
        </div>
      ),
      cellClass: "ag-center",
      headerClass: "ag-center",
    },
  ];

  const defaultColDef = {
    minWidth: 140,
    sortable: true,
    filter: true,
  };

  // ---------------- EXPORT TO EXCEL ---------------------

  const exportToExcel = () => {
    if (!rowData || rowData.length === 0) {
      alert("No data to export!");
      return;
    }

    const formattedData = rowData.map((row, index) => ({
      "S.No": index + 1,
      Name: row.name,
      Email: row.email,
      Gender: row.gender,
      City: row.city,
      "Date of Birth": formatDOB(row.dob),
      "Created Date & Time": formatDate(row.createdAt),
      "Updated Date & Time": formatDate(row.updatedAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  // ---------------- FORM HANDLERS ---------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData };

    if (formData.password && formData.password.trim() !== "") {
      dataToSend.password = encryptPassword(formData.password);
    } else if (editingId === null) {
      setPopupMessages(["Password is required for new users"]);
      setShowPopup(true);
      return;
    } else {
      delete dataToSend.password;
    }

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

      const data = await response.json();

      if (!response.ok) {
        console.log("Error response:", data);
        if (data.messages && Array.isArray(data.messages)) {
          setPopupMessages(data.messages);
        } else if (data.message) {
          setPopupMessages([data.message]);
        } else {
          setPopupMessages(["Validation error occurred"]);
        }
        setShowPopup(true);
        return;
      }

      if (editingId === null) {
        setRowData((prev) => [...prev, data]);
      } else {
        setRowData((prev) =>
          prev.map((row) => (row.id === editingId ? data : row))
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
      console.error("Network Error:", error);
      setPopupMessages(["Server error occurred."]);
      setShowPopup(true);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "",
      city: user.city || "",
      password: "",
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

  // ---------------- FETCH USERS ---------------------

  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRowData(data);
        } else {
          console.error("Invalid data:", data);
          setRowData([]);
        }
      })
      .catch((error) => console.error("API error:", error));
  }, []);

  return (
    <div className="container">
      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <h2>{editingId === null ? "Add User" : "Edit User"}</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={editingId === null ? "Password" : "New Password (leave empty to keep current)"}
        />

        {/* CUSTOM DATE FIELD */}
        <div
          className="date-wrapper"
          onClick={() => document.getElementById("dobPicker").showPicker()}
        >
          <span className={formData.dob ? "date-value" : "date-placeholder"}>
            {formatDisplayDOB(formData.dob)}
          </span>
          <span className="date-icon">📅</span>
          <input
            id="dobPicker"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="date-input-hidden"
          />
        </div>

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

      {/* EXPORT BUTTON */}
      <div className="export-btn-wrapper">
        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

      {/* AG GRID */}
      <div className="ag-theme-quartz-dark ag-grid-wrapper">
        <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Validation Error</h3>
            {popupMessages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;