import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "../../redux/actions/employeeActions";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import { InteractionType } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";
import * as GLOBAL_CONST from "../../common/constants";
import { msalConfig } from "../../auth/authConfig";

const SSOLOGIN = ({ allowNavigation = false }) => {
  useMsalAuthentication(InteractionType.Redirect);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { accounts } = useMsal();
  const msalInstance = new PublicClientApplication(msalConfig);
  const [isFirstSSOLogin, setIsFirstSSOLogin] = useState(true);
  const [hasSSOLoginAttempted, setHasSSOLoginAttempted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accounts.length > 0 && isFirstSSOLogin && !hasSSOLoginAttempted) {
        // Ensure accessToken is acquired after authentication
        await accessToken();
        const username = accounts[0].username;
        const response = await dispatch(
          authenticateUser(username, true, username)
        );
        if (response) {
          // TODO: Comment this on PRODUCTION
          // if (location?.pathname !== "/login" || allowNavigation) {
          //   if (
          //     user && user.role === GLOBAL_CONST.EMPLOYEE)
          //   {
          //     navigate("/home");
          //   } else if (user && user.role === GLOBAL_CONST.Manager) {
          //     navigate("/m-reviewapplications");
          //   }
          //   else if (user && user.role === GLOBAL_CONST.WFMTeam) {             
          //     navigate("/dashboard");
          //   }
          // }
        // TODO: Uncomment this on PRODUCTION
            if (user && user.role === GLOBAL_CONST.EMPLOYEE) {
                navigate("/home");
            } else if (user && user.role === GLOBAL_CONST.Manager) {
                navigate("/m-reviewapplications");
            }
            else if (user && user.role === GLOBAL_CONST.WFMTeam) {
             navigate("/dashboard");
            }
          setIsFirstSSOLogin(false);
          setHasSSOLoginAttempted(true);
        }       
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    navigate,
    accounts,
    user,
    isFirstSSOLogin,
    hasSSOLoginAttempted,
  ]);

  const accessToken = async () => {
    try {
      await msalInstance.initialize();
      const accessTokenResponse = await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: ["https://graph.microsoft.com/.default"],
      });
      const token = accessTokenResponse.accessToken;
      localStorage.setItem("accessToken", token);
    } catch (error) {
      // Handle any errors related to accessToken acquisition
      console.error("Error acquiring access token:", error);
    }
  };
};

export default SSOLOGIN;
