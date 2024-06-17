import { Switch, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/sign-up" component={SignupPage} />
  </Switch>
);

export default App;
