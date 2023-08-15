import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import TopList from "./pages/TopList.jsx";


import './index.css'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"  element={<Home />}/>
                <Route path="/list" element={<TopList/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);