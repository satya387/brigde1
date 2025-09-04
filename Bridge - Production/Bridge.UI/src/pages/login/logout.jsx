import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions"; // Import your logoutUser action
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser());  
    navigate("/");  
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
