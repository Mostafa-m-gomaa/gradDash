import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../Sections/article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import { json } from "react-router-dom";

const InstRequests = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const {route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [categories,setCategories] = useState([]);
  const [userName, setUsername] = useState("");
  const [catId, setCatId] = useState("");
 const [show,setShow]=useState(false)
  const [description, setDescription] = useState("");
const [sections,setSections]=useState([]);
const [type,setType]=useState("")


 

 
  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
    setType("courses")
   
  };
  const deleteSect = (id) => {
    setShowConfirm(true);
    setArtId(id);
    setType("sections")
   
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    formData.append("course", catId);
    formData.append("title", userName);
    formData.append("description", description);
  
    setLoader(true);
    try {
      const response = await fetch(`${route}sections`, {
        method: "POST",
        body:JSON.stringify({
          title:userName,
          course:catId,
          description:description
        }), // Sending as FormData
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
    
        },
      }).then((res) => res.json());
  
      setLoader(false);
      console.log(response);
  
      if (response.data) {
        toast.success("Added Successfully");
        setRefresh(!refresh);
      } else if (response.errors) {
        toast.error(response.errors[0].msg);
      } else {
        console.log(response);
        toast.error("هناك خطأ");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      setLoader(false);
    }
  };
  

  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);
    

    try {
      const response = await fetch(`${route}/${type}/${artId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      console.log(response);
      if (response.ok) {
        toast.success("Deleted Successfully");
        setRefresh(!refresh);
        setShow(false)
      } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Only try to parse JSON if the response has content
      const data = response.status !== 204 ? await response.json() : null;

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };
  const handleState = async (state , id) => {

    setLoader(true);
    fetch(`${route}/instructorsReqs/${state}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setLoader(false);
      console.log(data);
      if (data.status === "status updated successfully") {
        toast.success("status updated successfully");
        setRefresh(!refresh);
      }
     else if (data.status === "status was rejected successfully") {
        toast.success("status updated successfully");
        setRefresh(!refresh);
      }
    });
  };

  const showSec = async (id) => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/sections/course/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }) .then((res) => res.json());
      console.log(response);
      if (response.data) {
        setSections(response.data);
        setShow(true)
       
      }
      else{
        toast.error("no sections found")
      }
      setLoader(false)
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetch(`${route}/instructorsReqs`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.data) {
          setUsers(data.data);
          console.log( "reqs" ,data.data);
        }
      });
  }, [refresh]);

  return (
    <div className="articles">
      <ContentTop headTitle="Users" />

      {showConfirm ? (
        <div className="confirm">
          <div>are yoy sure ?</div>
          <div className="btns">
            <button onClick={deleteArt} className="yes">
              Yes
            </button>
            <button onClick={() => setShowConfirm(false)} className="no">
              No
            </button>
          </div>
        </div>
      ) : null}
      {show ? <div className="scts">
        <div className="close" onClick={()=>setShow(false)}>x</div>
        {sections.map((sec, index) => {
          return (
            <div className="sct" key={index}>
              <div className="name">{sec.title}</div>
              <div className="name"> {sec.description}</div>
             
              <button onClick={() => deleteSect(sec._id)}>Delete</button>
            </div>
          );

        })
        }
      </div>
       : null}
      <div className="container">
    
        <div className="all-art">
          <h1>All Pending requests</h1>
          <div className="arts">

          {users.map((user, index) => {
  const dateChange = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return formattedDate;
  };

  return (
    <div className="user-card" key={index}>
      <div className="name">Full name: {user.fullName}</div>
      <div>brief about : {user.ansOfQuestion}</div>
      <div>birthday : {dateChange(user.birthDate)}</div>
      <div> city : {user.city}</div>
      <div>country : {user.country}</div>
      <a href={user.sampleOfWork}> sample of work</a>
      <a href={user.cv}>cv</a>
      <div> email : {user.user.email}</div>
      {user.status === "pending" ? (
        <div className="btns">
          <button onClick={() => handleState("accept", user._id)}>Accept</button>
          <button onClick={() => handleState("reject", user._id)}>Reject</button>
        </div>
      ) : null}
    </div>
  );
})}


          </div>
        </div>
      </div>
    </div>
  );
};

export default InstRequests;
