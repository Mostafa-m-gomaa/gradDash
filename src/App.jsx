import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Sidebar from "./layout/Sidebar/Sidebar";
import ContentTop from "./components/ContentTop/ContentTop";
import { createContext, useEffect, useState } from "react";
import Login from "./components/login/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Requests from "./components/requests/Requests";
import RequestCard from "./components/request-card/RequestCard";
import Users from "./components/users/Users";
import Employers from "./components/users/Employers";
import EmployerRequests from "./components/requests/EmployerRequests";
import RequestProgress from "./components/request-card/RequestProgress";
import Orders from "./components/orders/Orders";
import Categories from "./components/categories/Categories";
import Courses from "./components/Courses/Courses";
import Sections from "./components/Sections/Sections";
import Posts from "./components/Posts/Posts";
import InstRequests from "./components/InstructorsRequests/InstructorReq";
import Lives from "./components/lives/Lives";
import Lessons from "./components/lessons/Lessons";

export const AppContext = createContext();

function App() {
  const [headTitle, setHeadTitle] = useState("تسجيل الدخول");
  const [login, setLogin] = useState(false);
  // const [route, setRoute] = useState("http://20.199.94.164:8000/api/v1");
  // const [route, setRoute] = useState("https://api.softwave-dev.com/api/v1/");
  const [route, setRoute] = useState("https://gp.softwave-dev.com/api/v1/");
  const [employee, setEmployee] = useState(false);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLogin(sessionStorage.getItem("login"));
    if (sessionStorage.getItem("role") === "employee") {
      setEmployee(true);
    } else {
      setEmployee(false);
    }
  }, [login]);
  return (
    <AppContext.Provider
      value={{
        headTitle,
        setHeadTitle,
        route,
        login,
        setLogin,
        setLoader,
        employee,
        setEmployee,
      }}
    >
      <>
        <div className="app">
          <ToastContainer />
          {loader ? (
            <div className="loader-cont">
              <div className="banter-loader">
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
              </div>
            </div>
          ) : null}
          <Sidebar />
          <div className="the-content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/users" element={<Users />} />
              <Route path="/categories" element={<Categories/>} />
              <Route path="/Courses" element={<Courses/>} />
              <Route path="/Sections" element={<Sections/>} />
              <Route path="/Lives" element={<Lives/>} />
              <Route path="/employers" element={<Employers />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/Instructors pending Requests" element={<InstRequests />} />
              <Route path="/employer-requests" element={<EmployerRequests />} />
              <Route path="/Lessons" element={<Lessons />} />
              <Route
                path="/employer-requests/:id"
                element={<EmployerRequests notMine={true} />}
              />
              <Route path="/requests" element={<Requests />} />
              <Route path="/request/:type/:id" element={<RequestCard />} />
              <Route
                path="/request-progress/:type/:id"
                element={<RequestProgress />}
              />
            </Routes>
          </div>
        </div>
      </>
    </AppContext.Provider>
  );
}

export default App;
