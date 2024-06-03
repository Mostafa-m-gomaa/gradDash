import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./lives.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Lives = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const {route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [categories,setCategories] = useState([]);
  const [userName, setUsername] = useState("");
  const [catId, setCatId] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [priceAfterDiscount, setPriceAfterDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [hour,setHour]=useState("")
    const [duration,setDuration]=useState("")
 const [meetingDate,setMeetingDate]=useState()
 const [title,setTitle]=useState("")
 const [courses,setCourses]=useState([])
 const [showAddLink,setShowAddLink]=useState(false)
 const [meetingLink,setMeetingLink]=useState("")
 const [liveId,setLiveId]=useState("")


const addLink =(id)=>{
    setLiveId(id)
    setShowAddLink(true)

}
 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      setImage(null);
    }
  };
  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("course", catId);
    formData.append("date", meetingDate);
    formData.append("hour", hour);
    formData.append("duration", duration);
  
    setLoader(true);
    try {
      const response = await fetch(`${route}/lives`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries())),
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
    } catch (error) {}
  };
  
  const handleSubmitUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("link", meetingLink);
    
  
    setLoader(true);
    try {
      const response = await fetch(`${route}/lives/${liveId}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(formData.entries())),
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
        setShowAddLink(false)
      } else if (response.errors) {
        toast.error(response.errors[0].msg);
      } else {
        console.log(response);
        toast.error("هناك خطأ");
      }
    } catch (error) {}
  };
  

  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/lives/${artId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      console.log(response);
      if (response.ok) {
        toast.success("Deleted Successfully");
        setRefresh(!refresh);
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

  useEffect(() => {
    fetch(`${route}/categories`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCategories(data.data);
          console.log(data.data);
        }
      });
  }, [refresh]);



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
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const endpoint = `${route}/lives` 
  
    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.data) {
          setCourses(data.data);
          console.log(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
  {showAddLink ?    <div className="add-link">
        <div className="close" onClick={()=>setShowAddLink(false)}>x</div>
      
          <h1>Add Meeting Link</h1>
          <form action="" onSubmit={handleSubmitUpdate}>
            <label htmlFor="">
             Url
              <input
                onChange={(e) => setMeetingLink(e.target.value)}
                type="text"
              />
            </label>
            <button type="submit">add</button>
          </form>
      </div> : null}
      <div className="container">
      <div className="add">
          <h1>Add Lives</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
             Title
              <input
                onChange={(e) => setTitle(e.target.value)}
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
             date
              <input
                onChange={(e) => setMeetingDate(e.target.value)}
                type="date"
              />
            </label>
        
            <label htmlFor="">
            hour
              <input
                onChange={(e) => setHour(e.target.value)}
                type="time"
              />
            </label>
            <label htmlFor="">
              duration by hour
              <input
                onChange={(e) => setDuration(e.target.value)}
                type="text"
              />
            </label>
         
            
           
       

            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>All lives</h1>
          <div className="arts">
            {courses.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name">title: {user.title}</div>
                 
                  <button onClick={() => deleteButton(user._id)}>Delete</button>
                  <button onClick={() => addLink(user._id)}>Add Meeting Link</button>
                  {user.link ? <a target="_blank" href={user.link}>Meeting</a>: null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lives;
