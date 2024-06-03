import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./lessons.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";
import { json } from "react-router-dom";

const Lessons = () => {
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
const [secId,setSecId]=useState("")
const [image, setImage] = useState(null);
const [title,setTitle]=useState("")
const [url,setUrl]=useState("")
const [lessons,setLessons]=useState([])
const [showLess,setShowLess]=useState(false)
const [lessonId,setLessonId]=useState("")

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setImage(null);
    }
  };


 

 

  const showLessons = (id) => {
    setLoader(true)
    fetch(`${route}/lessons/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        }
    })   
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    
        if(data.data.length===0){
            toast.error("no lessons found")
        }
        else if(data.data.length > 0){
            setLessons(data.data)
            setShowLess(true)
            setShow(false)

        }
        setLoader(false)
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    formData.append("section",secId);
    formData.append("title", title);
    formData.append("videoUrl", url);
    formData.append("type", "recorded");
    formData.append("image", image);
  
    setLoader(true);
    try {
      const response = await fetch(`${route}lessons`, {
        method: "POST",
        body:formData, // Sending as FormData
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
    
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
  

  const deleteLesson = async () => {
    setShowLess(false);
    setShowConfirm(false);
    setLoader(true);
    

    try {
      const response = await fetch(`${route}/lessons/${lessonId}`, {
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
  const getSec = async (id) => {
  
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
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
  
    if (role && token) {
      const endpoint = role === "instructor" ? `${route}/courses/MyCourses` : `${route}/courses`;
  
      fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.data) {
            setUsers(data.data);
            console.log(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [refresh]);
  const deleteLesson1 = (id) => {
    setShowConfirm(true);
    setLessonId(id);
   
  };


  return (
    <div className="articles">
      <ContentTop headTitle="Users" />

      {showConfirm ? (
        <div className="confirm">
          <div>are yoy sure ?</div>
          <div className="btns">
            <button onClick={deleteLesson} className="yes">
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
             
              <button onClick={() =>showLessons(sec._id)}>Show Lessons</button>
            </div>
          );

        })
        }
      </div>
       : null}
      {showLess ? <div className="scts">
        <div className="close" onClick={()=>setShowLess(false)}>x</div>
        {lessons.map((sec, index) => {
          return (
            <div className="sct" key={index}>
              <div className="name">{sec.title}</div>
              <img src={sec.image} alt="" />
              
             
              <button onClick={()=>deleteLesson1(sec._id)}>Delete</button>
            </div>
          );

        })
        }
      </div>
       : null}
      <div className="container">
        <div className="add">
          <h1>Add Lessons</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              title
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
              />
            </label>
         
            <label htmlFor="">
              Course
              <select name="" id="" onChange={(e)=>getSec(e.target.value)}>
                <option value="">select Course</option>
                {users.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.title}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              Section
              <select name="" id="" onChange={(e)=>setSecId(e.target.value)}>
                <option value="">select Section</option>
                {sections.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.title}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="">
              URL
              <input
                onChange={(e) => setUrl(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Image
              <input
                 onChange={handleImageChange}
                type="file"
              />
            </label>
        
           
            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>Lessons</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">title: {user.title}</div>
                <img src={user.image} alt="" />
                <button onClick={() => showSec(user._id)}>Show sections</button>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
