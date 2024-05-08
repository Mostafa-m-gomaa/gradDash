import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "./article.css";
import { AppContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentTop from "../ContentTop/ContentTop";

const Courses = () => {
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
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");



 

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

    formData.append("title", userName);
    formData.append("image", image);
    formData.append("category", catId);
    formData.append("description", description);
    formData.append("instructor", "6581f750337a196fe4f58d30");
    formData.append("price", price);
    formData.append("priceAfterDiscount", priceAfterDiscount);
  
    setLoader(true);
    try {
      const response = await fetch(`${route}/courses`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          
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

  const deleteArt = async () => {
    setShowConfirm(false);
    setLoader(true);

    try {
      const response = await fetch(`${route}/courses/${artId}`, {
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
          <h1>Add Course</h1>
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">
              Name
              <input
                onChange={(e) => setUsername(e.target.value)}
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
            <label htmlFor="">
              Category
              <select name="" id="" onChange={(e)=>setCatId(e.target.value)}>
                <option value="">select Category</option>
                {categories.map((cate) => (
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
            <label htmlFor="">
              Instructor
              <input
                onChange={(e) => setInstructor(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              price
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="text"
              />
            </label>
            <label htmlFor="">
              Price Fter Discount
              <input
                onChange={(e) => setPriceAfterDiscount(e.target.value)}
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

export default Courses;
