const initialState = {
    AllViewLaunchPadResourceAnalysis: {},
    error: null,
    
  };
  
  const analysisReducer = (state = initialState, action) => {
    switch (action.type) {
        
      case "FETCH_VIEWLAUNCHPAD_RESOURCE_ANALYSIS":
        return {
          ...state,
          AllViewLaunchPadResourceAnalysis: action.payload,
          error: null,
        };
        case "FETCH_VIEWLAUNCHPAD_RESOURCE_ANALYSIS_FAILURE":
            return {
              ...state,
              error: action.payload,
            };
      default:
        return state;
    }
  };
  
  export default analysisReducer;
  