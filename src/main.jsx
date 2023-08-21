import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {QueryClient, QueryClientProvider, } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "./pages/Home.jsx";
import Places from "./pages/Places.jsx";
import TopList from "./pages/TopList.jsx";
import Categories from "./pages/Categories.jsx";


import 'leaflet/dist/leaflet.css';
import './style/index.css'



export default function App() {

    const queryClient = new QueryClient(
        {defaultOptions:
                {queries:
                        {staleTime: Infinity} // set caching time to 24hours.
                }}
    )

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/"  element={<Home />}/>
                    <Route path="/categories" element={<Categories/>}/>
                    <Route path="/map" element={<Places/>}/>
                </Routes>
                <ReactQueryDevtools/>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);