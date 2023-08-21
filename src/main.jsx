import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Places from "./pages/Places.jsx";
import TopList from "./pages/TopList.jsx";
import Categories from "./pages/Categories.jsx";


import 'leaflet/dist/leaflet.css';
import './style/index.css'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"  element={<Home />}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/map" element={<Places/>}/>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);