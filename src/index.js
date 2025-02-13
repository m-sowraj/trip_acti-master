import React, {  } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginComponent from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Home/Home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard/>,
    },
    {
        path: '/login',
        element: <LoginComponent/>,
    },
    {
        path: '/signup',
        element: <SignUp/>,
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// reportWebVitals();