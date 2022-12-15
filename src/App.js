import React from "react";
import Analytics from "./Components/Analytics";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import store from "./Redux/store";
import { Provider } from "react-redux";
import "./commonStyles.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Provider store={store}>
        <div className="app-layout">
          <div className="app-side-bar"></div>
          <div className="app-middle-container">
            <Switch>
              <Route
                path="/"
                exact
                component={Analytics}
              />
            </Switch>
          </div>
        </div>
      </Provider>
    </Router>
  );
}

export default App;
