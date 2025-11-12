# Routing Repo for Meteor
Dit is een simpele prototype tussen 2 punten. Deze punten kunnen worden aangepast in de app zelf en in de code.
In de code zoek voor "setDestination" of "setOrigin" om longlat toe te voegen voor de beginpunten.

Voeg je eigen Mapbox Key toe door het bovenaan in de RouteTest neer te zetten of door een settings.json aan te maken en dit er in toe te voegen:

{
  "public": {
    "mapbox_key": YOUR_MAPBOX_KEY,
  }
}

De zwarte instructie box staat voor nu uit door dit in client/main.css:

.mapbox-directions-instructions {
  display: none;
}

Verwijder het om het weer in te schakelen (temporary fix)
