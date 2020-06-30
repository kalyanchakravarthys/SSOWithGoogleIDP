import React from "react";
import Link from "next/link";
import Head from "next/head";
// import Nav from "next/Nav";
import { auth, firebase } from "../src/firebase";
class Home extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      currentUser: {
        profile: {
          firstName: '',
          lastName: ''
        }
      }
    }
  }
  
  handleSignIn = () => {
    var provider = new firebase.auth.SAMLAuthProvider("saml.foo-project-provider");
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // alert("You are signed In");
        console.log("setting token", result);
        this.setState({currentUser: result.additionalUserInfo, isLoggedIn: true});
        localStorage.setItem("ACCESS_TOKEN", result.credential.a);
        localStorage.setItem("FOO_USER", JSON.stringify(result.additionalUserInfo))
      })
      .catch(err => {
        alert("OOps something went wrong check your console");
        console.log(err);
      });
  };

  handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // alert("Logout successful");
        console.log("signout successful");
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("FOO_USER");
        this.setState({currentUser: {
          profile: {
            firstName: '',
            lastName: ''
          }
        }, isLoggedIn: false});
        console.log("cleared state and local storage");
      })
      .catch(function(error) {
        alert("OOps something went wrong check your console");
        console.log(error);
      });
  };

  componentDidMount() {
    const user = localStorage.getItem("FOO_USER");
    console.log("component did mout user ", user)
    if(user) {
      const parsedUser = JSON.parse(user)
      if(this.state.currentUser.providerId != parsedUser.providerId) {
        console.log("updating state at did mount", this.state.currentUser, parsedUser)
        this.setState({ currentUser: parsedUser });
      }
    }
    
  }

  componentDidUpdate() {
    const user = localStorage.getItem("FOO_USER");
    console.log("component did update user ", user)
    if(user) {
      const parsedUser = JSON.parse(user)
      if(this.state.currentUser.providerId != parsedUser.providerId) {
        console.log("updating state at did update", this.state.currentUser, parsedUser)
        this.setState({ currentUser: parsedUser });
      }
    }
    
  }
  render() {
    const { profile, providerId } = this.state.currentUser
    console.log("state at render",this.state)
    return (
      <div>
        <Head title="Home" />
        {/* <Nav /> */}
        <div className="hero">
          <h1 className="title">
            Welcome { profile && `${profile.firstName} ${profile.lastName}`}
          </h1>
          <div className="row">
            <Link href="/dashboard">
              <a className="card">
                <p>Goto Dashboard</p>
              </a>
            </Link>
            {!providerId && <button onClick={this.handleSignIn}>Sign In using google</button>}
            {providerId && <button onClick={this.handleLogout}>Logout</button>}
          </div>
        </div>
        <style jsx>{`
          .hero {
            width: 100%;
            color: #333;
          }
          .title {
            margin: 0;
            width: 100%;
            padding-top: 80px;
            line-height: 1.15;
            font-size: 48px;
          }
          .title,
          .description {
            text-align: center;
          }
          .row {
            max-width: 880px;
            margin: 80px auto 40px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }
          .card {
            padding: 18px 18px 24px;
            width: 220px;
            text-align: left;
            text-decoration: none;
            color: #434343;
            border: 1px solid #9b9b9b;
          }
          .card:hover {
            border-color: #067df7;
          }
          .card h3 {
            margin: 0;
            color: #067df7;
            font-size: 18px;
          }
          .card p {
            margin: 0;
            padding: 12px 0 0;
            font-size: 13px;
            color: #333;
          }
        `}</style>
      </div>
    );
  }
}
export default Home;
