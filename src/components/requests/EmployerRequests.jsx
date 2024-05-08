import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "./requests.css";
import { Link, useParams } from "react-router-dom";
import RequestItem from "./RequestItem";
import ContentTop from "../ContentTop/ContentTop";

const EmployerRequests = ({ notMine }) => {
  const { route, setLoader } = useContext(AppContext);
  const [master, setMaster] = useState([]);
  const [phd, setPhd] = useState([]);
  const [requests, setrRquests] = useState([]);

  const [refresh, setRefresh] = useState(false);
  const id = useParams();
  useEffect(() => {
    fetch(`${route}${notMine ? `/crm/${id.id}/requests` : `/crm/myRequests`}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.data) {
          setrRquests(data.data);
        }
      });
  }, [refresh]);
  return (
    <div className="requests">
      <ContentTop headTitle="Employer Requests" />

      <h1>All Requests</h1>
      <div className="bachelor">
        <div className="req-container">
          {requests.map((item, index) => {
            return (
              <RequestItem
                key={index}
                item={item}
                index={index}
                isEmployerView={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerRequests;
