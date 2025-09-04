import axios from "axios";
import * as ApiEndpoint from "../../config";
import { getAuthToken, getUserName } from "../../common/commonMethods";

export const GetViewLaunchPadResourceAnalysis = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(ApiEndpoint.VIEWLAUNCHPADRESOURCEANALYSIS, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
    
      });
       
       dispatch({
         type: "FETCH_VIEWLAUNCHPAD_RESOURCE_ANALYSIS",
         payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ALL_JOBS_FAILURE",
        payload: error.message,
      });
    }
  };
};
