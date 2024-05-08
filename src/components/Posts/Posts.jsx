import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Posts = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [artId, setArtId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { route, setLoader } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");
 
  const [image, setImage] = useState(null);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     console.log(reader.result);
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  const deleteButton = (id) => {
    setShowConfirm(true);
    setArtId(id);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("content", userName);
  
    setLoader(true);
    try {
      const response = await fetch(`${route}/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          
        },
      }).then((res) => res.json());
      setLoader(false);
      console.log(response);
      if (response.success) {
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

  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/posts/${artId}`, {
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
    fetch(`${route}/posts/public`, {
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
      <div className="container">
        <div className="add">
          <h1>Add Post</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Content
             
              <textarea name=""   onChange={(e) => setUsername(e.target.value)} id="" cols="70" rows="5"></textarea>
            </label>
      
         
            
           
       

            <button type="submit">add</button>
          </form>
        </div>
        <div className="all-art">
          <h1>Posts</h1>
          <div className="arts">
            {users.map((user, index) => {
              return (
                <div className="user-card" key={index}>
                  <div className="name"> {user.content}</div>
                 
                  <button onClick={() => deleteButton(user._id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
