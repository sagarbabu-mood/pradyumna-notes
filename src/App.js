import { Switch, Route, Redirect } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import Home from "./Components/Home";
import ForgetPasswordPage from "./Components/ForgetPasswordPage";
import Notes from "./Components/Notes";
import NoteEditPage from "./Components/NoteEditPage";
import NewNote from "./Components/NewNote";
import PasswordsPage from "./Components/PasswordsPage";
import PasswordEditPage from "./Components/PasswordEditPage";
import NotFound from "./Components/NotFound";

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/note-locker/" component={Home} />
    <Route
      exact
      path="/note-locker/forget-password"
      component={ForgetPasswordPage}
    />
    <Route exact path="/note-locker/login" component={LoginPage} />
    <Route exact path="/note-locker/sign-up" component={SignupPage} />
    <ProtectedRoute exact path="/note-locker/notes" component={Notes} />
    <ProtectedRoute
      exact
      path="/note-locker/notes/:noteId"
      component={NoteEditPage}
    />
    <ProtectedRoute
      exact
      path="/note-locker/new-note/:userId"
      component={NewNote}
    />
    <ProtectedRoute
      exact
      path="/note-locker/passwords"
      component={PasswordsPage}
    />
    <ProtectedRoute
      exact
      path="/note-locker/password/:passwordId"
      component={PasswordEditPage}
    />
    <Route exact path="/note-locker/bad-path" component={NotFound} />
    <Redirect to="/note-locker/bad-path" />
  </Switch>
);

export default App;
