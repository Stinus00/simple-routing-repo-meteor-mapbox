# Routing Repo for Meteor

Add your own Mapbox Key to the application in RouteTest or create a settings.json shown like below

{
  "public": {
    "mapbox_key": YOUR_MAPBOX_KEY,
  }
}

This is a simple prototype to show a route between 2 points given like the example in Mapbox

Currently the instructions are hidden, to show these remove:

.mapbox-directions-instructions {
  display: none;
}

from client/main.css
