import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Places from "./pages/Places.jsx";
import TopList from "./pages/TopList.jsx";
import Categories from "./pages/Categories.jsx";
import Venue from "./pages/Venue.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.tsx";
import FilteredView from "./pages/FilteredView.tsx";

import "leaflet/dist/leaflet.css";
import "./style/index.css";

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
        <Routes>
          <Route path="/:lang" element={<Home />} />
          <Route path="/:lang/toplist/:id" element={<TopList />} />
          <Route path="/:lang/venue/:id" element={<Venue />} />
          <Route path="/:lang/categories" element={<Categories />} />
          <Route path="/:lang/map" element={<Places />} />
          <Route path="/:lang/about" element={<About />} />
          <Route path="/:lang/open-now" element={<FilteredView/>} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

