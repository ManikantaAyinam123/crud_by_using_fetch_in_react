import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Table from "./components/Table";
import { Icon } from "@iconify/react";
function App() {
  const [studentsData, setStudentsData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    ListOfStudents();
  }, []);

  const ListOfStudents = () => {
    fetch("http://localhost:3001/studenData")
      .then((response) => response.json())
      .then((data) => {
        setStudentsData(data);
      })
      .catch((error) => {
        alert("url Error");
      });
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/studenData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowAddForm(false);
        setFormData({ name: "" });
        ListOfStudents();
      })
      .catch((error) => {
        console.error("Error adding student:", error);
        alert("Error adding student. Please try again.");
      });
  };

  const handleDelete = (studentId) => {
    fetch(`http://localhost:3001/studenData/${studentId}`, {
      method: "DELETE",
    })
      .then(() => {
        ListOfStudents();
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
        alert("Error deleting student. Please try again.");
      });
  };

  const handleUpdate = (studentId, studentName) => {
    setShowUpdate(true);
    setFormData({ id: studentId, name: studentName });
  };

  const submitUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/studenData/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(() => {
        setShowUpdate(false);
        setFormData({ name: "" });
        ListOfStudents();
      })
      .catch((error) => {
        console.error("Error updating student:", error);
        alert("Error updating student. Please try again.");
      });
  };
  const handleCancelUpdate = () => {
    setShowUpdate(false);
    setShowAddForm(false);
    setFormData({ name: "" });
  };

  return (
    <div className="container  justify-content-center mt-5 ">
      <div className="row row-cols-md-2  mt-5 mx-auto justify-content-center">
        <div className="col">
          <h2 className="justify-content-center d-flex">
            <b>Student's Data</b>
          </h2>
          <button
            type="button"
            className="btn btn-primary ms-auto d-flex "
            onClick={toggleAddForm}
          >
            ADD +
          </button>
          {showAddForm && (
            <div className="overlay">
              <div className="form-container">
                <form onSubmit={handleAdd}>
                  <button
                    type="button"
                    className="btn btn-icon btn-cancel position-absolute top-0 end-0 m-1"
                  >
                    <Icon onClick={handleCancelUpdate} icon="iconoir:cancel" />
                  </button>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {showUpdate && (
            <div className="overlay">
              <div className="form-container">
                <button
                  type="button"
                  className="btn btn-icon btn-cancel position-absolute top-0 end-0 m-1"
                  onClick={handleCancelUpdate}
                >
                  <Icon icon="iconoir:cancel" />
                </button>

                <form onSubmit={submitUpdate}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </form>
              </div>
            </div>
          )}
          <Table
            studentsData={studentsData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
