import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "./requests.css";
import { Link } from "react-router-dom";
import RequestItem from "./RequestItem";
import ContentTop from "../ContentTop/ContentTop";

const Requests = () => {
  const { route, setLoader } = useContext(AppContext);
  const [master, setMaster] = useState([]);
  const [phd, setPhd] = useState([]);
  const [bechlor, setBechlor] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [requestId, setRequestId] = useState("");
  const [userId, setUserId] = useState("");
  const [empId, setEmpId] = useState("");
  const [showEmp, setShowEmp] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const clickAssign = (req, user, emp) => {
    setRequestId(req);
    setUserId(user);
    setShowEmp(true);
    if (emp) {
      setEmpId(emp);
    }
  };
  const assignEmp = (id) => {
    setEmpId(id);
  };
  const assign = () => {
    setLoader(true);
    setShowEmp(false);
    fetch(`${route}/crm/assign`, {
      method: "PUT",
      body: JSON.stringify({
        requestId: requestId,
        employeeId: empId,
        userId: userId,
      }),
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setEmpId("");
        setLoader(false);
        if (data.status === "success") {
          toast.success("Assigned Successfully");
          setRefresh(!refresh);
        }
      });
  };
  const acceptRequest = (type, id) => {
    setLoader(true);
    fetch(`${route}/${type}/${id}/eligibility`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Eligibility: "eligible",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoader(false);
        console.log(data);
        if (data.status === "fail") {
          toast.error(data.message);
        } else if (data.message === "Request status updated successfully") {
          toast.success("Request status updated successfully");
          setRefresh(!refresh);
        }
      });
  };

  useEffect(() => {
    fetch(`${route}/bachelor`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setBechlor(data.data);
        }
      });
    fetch(`${route}/master`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setMaster(data.data);
        }
      });
    fetch(`${route}/phd`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setPhd(data.data);
        }
      });
  }, [refresh]);
  useEffect(() => {
    fetch(`${route}/users/employees`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setEmployees(data.data);
        }
      });
  }, []);
  return (
    <div className="requests">
      <ContentTop headTitle="Employer Requests" />

      {showEmp ? (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("emps-container")) {
              setShowEmp(false);
            }
          }}
          className="emps-container"
        >
          <div className="emps">
            <h2>Choose Employee</h2>
            {employees.map((item, index) => {
              return (
                <div
                  className={item.id === empId ? "emp emp-active" : "emp"}
                  onClick={() => assignEmp(item.id)}
                  key={index}
                >
                  <div>{item.username}</div>
                  <div>{item.email}</div>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button onClick={assign} style={{ margin: "0" }}>
                Assign
              </button>
              <button
                style={{ margin: "0" }}
                onClick={() => {
                  setShowEmp(false);
                }}
              >
                Close
              </button>
            </div>{" "}
          </div>
        </div>
      ) : null}
      <h1>All Requests</h1>
      <div className="bachelor">
        <h2>bachelor</h2>
        <div className="req-container">
          {bechlor.map((item, index) => {
            return (
              <RequestItem
                key={index}
                item={item}
                index={index}
                clickAssign={clickAssign}
                acceptRequest={acceptRequest}
              />
            );
          })}
        </div>
      </div>
      <div className="master">
        <h2>master</h2>
        <div className="req-container">
          {master.map((item, index) => {
            return (
              <RequestItem
                key={index}
                item={item}
                index={index}
                clickAssign={clickAssign}
                acceptRequest={acceptRequest}
              />
            );
          })}
        </div>
      </div>
      <div className="phd">
        <h2>phd</h2>
        <div className="req-container">
          {phd.map((item, index) => {
            return (
              <RequestItem
                key={index}
                item={item}
                index={index}
                clickAssign={clickAssign}
                acceptRequest={acceptRequest}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
