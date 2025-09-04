// userActions.js

// Action types
export const AUTHENTICATE_USER = "AUTHENTICATE_USER";
export const LOGOUT_USER = "LOGOUT_USER";

// Action creators
export const authenticateUser = (user) => ({
  type: AUTHENTICATE_USER,
  payload: user,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
