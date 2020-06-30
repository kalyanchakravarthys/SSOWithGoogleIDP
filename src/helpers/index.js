import React from "react";
import router from "next/router";
import cookie from 'js-cookie';
import { auth } from "../firebase";
const withAuth = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: "LOADING"
      };
    }
    componentDidMount() {
      auth.onAuthStateChanged(async authUser => {
        console.log("auth state changed helper", authUser);
        const tokenName = "AUTH_TOKEN"
        if (authUser) {
          this.setState({
            status: "SIGNED_IN",
            authUser
          });
          const token = await authUser.getIdToken()
          cookie.set(tokenName, token, { expires: 1 });
        } else {
          cookie.remove(tokenName);
          this.setState({ authUser: null });
          // router.push("/");
        }
      });
    }
    renderContent() {
      const { status } = this.state;
      if (status == "LOADING") {
        return <h1>Loading ......</h1>;
      } else if (status == "SIGNED_IN") {
        return <Component {...this.props} />;
      }
    }
    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};
export default withAuth;
