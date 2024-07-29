import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { ChakraProvider } from '@chakra-ui/react';
import Header from "./components/header";
import Home from "./components/home";
import Kanban from "./components/kanban/kanban.jsx";
import { AuthProvider } from "./contexts/authContext";
import { generateDate } from "./util/calendar.js";
import './App.css';
function App() {
  console.log(generateDate());
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/kanban",
      element: <Kanban />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
