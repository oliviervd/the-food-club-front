import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Venues from "./pages/Venues.jsx";
import Venue from "./pages/Venue.jsx";
import Search from "./pages/Search.jsx"
import {BackgroundColorProvider} from "./utils/BackgroundColorContext.jsx";

import "../src/style/fonts.css"
import "../src/style/media.css"
import "../src/style/home.css"
import "../src/style/categories.css"
import "../src/style/venue.css"
import "../src/style/main.css"

//todo: add language provider (API Context)

import Home from "./pages/Home.jsx";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity }, // set caching time to 24hours.
    },
  });

  // make sure each time a new page loads the user starts from the top of the page
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <BackgroundColorProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />}/>
            <Route path="/:lang" element={<Home />} />
            <Route path="/categories/:category" element={<Venues />}/>
            <Route path="/venue/:venue" element={<Venue />}/>
            <Route path="/venues/" element={<Search />}/>
          </Routes>
        </BackgroundColorProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

