import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import { json } from "react-router-dom";

const Sections = () => {
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
  // const handleSubmit = async (event) => {
 
  //   event.preventDefault();
  //   const formData = new FormData();

  //   formData.append("course", catId);
  //   formData.append("title", userName);
  //   formData.append("description", description);
  
  
  //   setLoader(true);
  //   try {
  //     const response = await fetch(`${route}sections`, {
  //       method: "POST",
  //       body: json.stringify({
  //         title:userName,
  //         course:catId,
  //         description:description
  //       }),
  //       headers: {
  //         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
          
  //       },
  //     }).then((res) => res.json());
  //     setLoader(false);
  //     console.log(response);
  //     if (response.data) {
  //       toast.success("Added Successfully");
  //       setRefresh(!refresh);
  //     } else if (response.errors) {
  //       toast.error(response.errors[0].msg);
  //     } else {
  //       console.log(response);
  //       toast.error("هناك خطأ");
  //     }
  //   } catch (error) {}
  // };
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
    fetch(`${route}/courses`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.data) {
          setUsers(data.data);
          console.log(data.data);
        }
      });
  }, [refresh]);
  // useEffect(() => {
  //   fetch(`${route}/sections`, {
  //     headers: {
  //       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.data) {
  //         setSections(data.data);
  //         console.log(data.data);
  //       }
  //     });
  // }, [refresh]);
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
        <div className="add">
          <h1>Add Section</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Name
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
              />
            </label>
         
            <label htmlFor="">
              Course
              <select name="" id="" onChange={(e)=>setCatId(e.target.value)}>
                <option value="">select Course</option>
                {users.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.title}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              description
              <input
                onChange={(e) => setDescription(e.target.value)}
                type="text"
              />
            </label>
        
           
      
            
           
       

            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>Courses</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">title: {user.title}</div>
                <img src={user.image} alt="" />
                <button onClick={() => showSec(user._id)}>Show sections</button>
                  {/* <button onClick={() => deleteButton(user._id)}>Delete</button> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
