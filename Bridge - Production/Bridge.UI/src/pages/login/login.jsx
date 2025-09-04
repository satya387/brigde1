import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "../../redux/actions/employeeActions";
import { getUserName } from "../../common/commonMethods";
import { useNavigate } from "react-router-dom";
import * as GLOBAL_CONST from "../../common/constants";
import "./index.scss";
import SSOLOGIN from "./ssoLogin";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ssoLogin, setSSOLogin] = useState(false);

  // Use useEffect to handle navigation and local storage based on user data
  useEffect(() => {
    if (submitted) {
      if (
        user && user.role === GLOBAL_CONST.EMPLOYEE 
      ) {
        dispatch({
          type: "MANUAL_LOGIN_SUCCESS",
          payload: true,
        });
        navigate("/home");
      } else if (user && user.role === GLOBAL_CONST.Manager) {
        navigate("/m-reviewapplications");
      }
      else if (user && user.role === GLOBAL_CONST.WFMTeam) {
        dispatch({
          type: "MANUAL_LOGIN_SUCCESS",
          payload: true,
        });
        navigate("/dashboard");
      }
    }
  }, [submitted, user, navigate]);

  const handleLogin = async () => {
    try {
      const userName = getUserName();
      if (userName) {
        await dispatch(authenticateUser(userName, false, username));
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleSSOLogin = () => {
    setSSOLogin(true);
  };

  return (
    <>
      <div className="login-wrap">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="login-button-wrap">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSSOLogin}>SSO Login</button>
        </div>
      </div>
      {ssoLogin && <SSOLOGIN allowNavigation={true} />}
    </>
  );
};

export default Login;
