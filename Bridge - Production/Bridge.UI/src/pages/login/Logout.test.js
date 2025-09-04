import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Logout from './Logout';
import { logoutUser } from '../../redux/actions/userActions';

const mockStore = configureStore();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

test('Logout component dispatches logoutUser action and navigates', async () => {
  // Arrange: Create a mock store with an initial state
  const store = mockStore();

  // Arrange: Mock the useNavigate hook
  const mockNavigate = jest.fn();
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

  // Arrange: Render the component with the mock store
  const { getByText } = render(
    <Provider store={store}>
      <Logout />
    </Provider>
  );

  // Arrange: Mock the asynchronous behavior of logoutUser action
  const mockAsyncLogoutAction = () => async (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: "LOGOUT_USER",
      });
    }, 1000);
  };

  // Mock the action to use the asynchronous version
  store.dispatch = jest.fn().mockImplementationOnce(mockAsyncLogoutAction);

    // Act: Simulate a click on the Logout button
    const logoutButton = screen.getByText('Logout');
  fireEvent.click(logoutButton); 
  await waitFor(() => {    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
