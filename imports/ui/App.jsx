import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteTest from "./RouteTest/RouteTest";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="" Component={RouteTest}/>
            </Routes>
        </Router>

    );
}

