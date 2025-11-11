import React from 'react';
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { HashRouter } from "react-router-dom";

Meteor.startup(() => {
    const root = document.getElementById("react-target");
    ReactDOM.createRoot(root).render(
            <App />
    );
});