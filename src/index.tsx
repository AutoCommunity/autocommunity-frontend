import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter, useNavigate } from 'react-router-dom';
import MapMainScreen from './components/MapMainScreen';
import { Login } from './components/Login';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path = "/" element = {<MapMainScreen/>} />
          <Route path = "/login" element = {<Login/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
