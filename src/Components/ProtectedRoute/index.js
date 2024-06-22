import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = (props) => {
  const myToken = Cookies.get("jwt_token");
  if (myToken === undefined) {
    return <Redirect to="/note-locker/login" />;
  } else {
    return <Route {...props} />;
  }
};

export default ProtectedRoute;
