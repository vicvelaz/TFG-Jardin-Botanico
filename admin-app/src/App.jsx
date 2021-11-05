import React from 'react';
import Header from './components/Header';
import './App.css';
import Background from './components/Background';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Events from './components/Events';
import Itineraries from './components/Itineraries';
import Plants from './components/Plants';

function App() {
  return (
    <Router>
      <div className="contenido">
        <Header />
        <Switch>
          <Route path="/plants">
            <Plants />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/itineraries">
            <Itineraries />
          </Route>
          <Route path="/">
            <Background />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
