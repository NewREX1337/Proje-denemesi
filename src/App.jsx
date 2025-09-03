import './App.css';
import { Routes, Route } from 'react-router-dom'
import CustomAppBar from "./MuiTheme";
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3005";

function App() {

  const getAllusers = async () => {
    const response = await axios.get(BASE_URL + "/users");
    console.log(response.data)

  }

  const getUserById = async (userId) => {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    console.log(response.data)
  }

  const createUser = async (newUser) => {
    //POST VERI EKLEMEK İÇİN KULLANILIR
    const response = await axios.post(`${BASE_URL}/users`, newUser);
    console.log("response", response.data);
  }


  //useEffect(() => {
  // getAllUsers().
  //getUserById(2)
  //const newUser = {
  //"username": "MMHVH",
  //"password": "1337",
  //}
  //createUser(newUser)
  //}, [])  //İLK RENDERLAMADA F5 ATINCA KULLANICIYI EKLER KENARDA DURSUN 

  return (
    <div>
      <CustomAppBar />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/home' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/dashboard' element={<Dashboard />} />

      </Routes>
    </div>
  );
}

export default App;