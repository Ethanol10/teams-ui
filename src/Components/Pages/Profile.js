import React, { Component } from "react";
import "./Profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "react-native";

import { db } from "../../services/firebase";
import { auth } from "../../services/firebase";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

class TextField extends Component {
  render() {
    var text = this.props.text || "";
    return <div>{text}</div>;
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      email: null,
      username: null,
      readError: null,
      writeError: null,
      usernameEditable: false,
      emailEditable: false,
      passwordEditable: false,
      error: null,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUsernameCancel = this.handleUsernameCancel.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailCancel = this.handleEmailCancel.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordCancel = this.handlePasswordCancel.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  writeUserData(userId, name, email) {
    db.ref("users/" + userId)
      .set({
        email: email,
        name: name,
      })
      .then(function () {
        console.log("Data successfully written to db");
      });
    this.refreshUserDetails();
  }

  //Username Callback
  handleUsernameCancel(e) {
    e.preventDefault();
    this.setState({
      usernameTemp: "",
      usernameEditable: !this.state.usernameEditable,
    });
  }
  handleUsernameChange(e) {
    e.preventDefault();
    if (this.state.usernameEditable) {
      if (
        typeof this.state.usernameTemp !== "undefined" &&
        this.state.emailTemp !== ""
      ) {
        this.writeUserData(
          this.state.user.uid,
          this.state.usernameTemp,
          this.state.email
        );
        this.setState({ usernameTemp: "" });
      }
    }
    this.setState({
      usernameEditable: !this.state.usernameEditable,
    });
  }

  //Email Callback
  handleEmailCancel(e) {
    e.preventDefault();
    this.setState({
      emailTemp: "",
      emailEditable: !this.state.emailEditable,
    });
  }
  handleEmailChange(e) {
    e.preventDefault();
    if (this.state.emailEditable) {
      if (
        typeof this.state.emailTemp !== "undefined" &&
        this.state.emailTemp !== ""
      ) {
        var self = this;
        var emailTemporary = this.state.emailTemp;
        this.state.user
          .updateEmail(this.state.emailTemp)
          .then(function () {
            self.writeUserData(
              self.state.user.uid,
              self.state.username,
              emailTemporary
            );
            console.log("Email changed successfully");
          })
          .catch(function (error) {
            console.log(error);
          });

        this.setState({ emailTemp: "" });
      }
    }
    this.setState({
      emailEditable: !this.state.emailEditable,
    });
  }

  handleProfileChange(e) {
    e.preventDefault();
    console.log("The profile was clicked.");
  }

  //Password Callback
  handlePasswordCancel(e) {
    e.preventDefault();
    this.setState({
      passwordEditable: !this.state.passwordEditable,
    });
  }
  handlePasswordChange(e) {
    e.preventDefault();
    var errorMes;
    if (this.state.passwordEditable) {
      if (
        typeof this.state.passwordTemp !== "undefined" &&
        this.state.passwordTemp !== ""
      ) {
        this.state.user
          .updatePassword(this.state.passwordTemp)
          .then(function () {
            console.log("Password update success");
          })
          .catch(function (error) {
            errorMes = error;
            console.log(error);
          });
      }
    }
    this.setState({
      error: errorMes,
      passwordTemp: "",
      passwordEditable: !this.state.passwordEditable,
    });
  }

  //Store the value in a temp variable when textInput changes
  handleChange(evt, name) {
    const { text } = evt.nativeEvent;
    this.setState(() => ({ [name]: text }));
  }

  //Refreshes the user details by pulling new data from the database
  refreshUserDetails() {
    this.setState({ readError: null });

    try {
      db.ref(`users/${this.state.user.uid}`).once("value", (snapshot) => {
        this.setState({
          email: snapshot.val().email,
          username: snapshot.val().name ? snapshot.val().name : null,
        });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  componentDidMount() {
    this.refreshUserDetails();
  }

  render() {
    var usernameTextRender,
      emailTextRender,
      passwordTextRender,
      crossRender,
      errorText;

    crossRender = <FontAwesomeIcon icon={faTimes} aria-hidden="true" />;
    errorText = <TextField text={this.state.error} />;
    //username
    if (this.state.usernameEditable) {
      usernameTextRender = (
        <div>
          <TextInput
            style={{
              fontSize: 16,
              height: 35,
              borderColor: "gray",
              borderWidth: 1,
            }}
            defaultValue={this.state.username}
            onChange={(event) => this.handleChange(event, "usernameTemp")}
          />
        </div>
      );
    } else {
      usernameTextRender = (
        <div>
          <TextField text={this.state.username} />
        </div>
      );
    }

    //Email
    if (this.state.emailEditable) {
      emailTextRender = (
        <div>
          <TextInput
            style={{
              fontSize: 16,
              height: 35,
              borderColor: "gray",
              borderWidth: 1,
            }}
            defaultValue={this.state.email}
            onChange={(event) => this.handleChange(event, "emailTemp")}
          />
        </div>
      );
    } else {
      emailTextRender = (
        <div>
          <TextField text={this.state.email} />
        </div>
      );
    }

    //Password
    if (this.state.passwordEditable) {
      passwordTextRender = (
        <div>
          <TextInput
            style={{
              fontSize: 16,
              height: 35,
              borderColor: "gray",
              borderWidth: 1,
            }}
            onChange={(event) => this.handleChange(event, "passwordTemp")}
          />
        </div>
      );
    } else {
      passwordTextRender = (
        <div>
          <TextField text="************" />
        </div>
      );
    }

    return (
      <div id="profile">
        <div className="content-wrap">
          <div className="name-icon">
            {this.state.username != null ? this.state.username.charAt(0) : ""}
          </div>
          <h1>
            Welcome,{" "}
            {this.state.username != null
              ? this.state.username
              : this.state.email}
          </h1>
          <h2>Manage your information to make Chat App work better for you</h2>
          <div className="card">
            <div className="inner-heading">Profile</div>
            <div className="info">
              <h3>PHOTO</h3>
              <div className="content">
                <h4>Add a photo to personalise your account</h4>
              </div>
              <div className="icon" onClick={this.handleProfileChange}>
                {this.state.username != null
                  ? this.state.username.charAt(0)
                  : ""}
                <div className="photo">
                  <svg
                    data-v-d223ba98=""
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="camera"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="svg-inline--fa fa-camera fa-w-16"
                    style={{ fontSize: "17px" }}
                  >
                    <path
                      data-v-d223ba98=""
                      fill="currentColor"
                      d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"
                      className=""
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="info">
              <h3>EMAIL</h3>
              <div className="content">{emailTextRender}</div>
              <div onClick={this.handleEmailCancel}>
                <b>{this.state.emailEditable ? crossRender : ""}</b>
              </div>
              <div className="popup" onClick={this.handleEmailChange}>
                <svg
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="close"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-close fa-w-16"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
            <div className="info">
              <h3>USERNAME</h3>
              <div className="content">{usernameTextRender}</div>
              <div onClick={this.handleUsernameCancel}>
                <b>{this.state.usernameEditable ? crossRender : ""}</b>
              </div>
              <div className="popup" onClick={this.handleUsernameChange}>
                <svg
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="pen"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-pen fa-w-16"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
            <div className="info" style={{ borderBottom: "none" }}>
              <h3>PASSWORD</h3>
              <div className="content" type="password">
                {passwordTextRender}
              </div>
              <div onClick={this.handlePasswordCancel}>
                <b>{this.state.passwordEditable ? crossRender : ""}</b>
              </div>
              <div className="popup" onClick={this.handlePasswordChange}>
                <svg
                  style={{ width: "20px", fontSize: "20px", height: "20px" }}
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="arrow-right"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="svg-inline--fa fa-arrow-right fa-w-14"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
            <div>{errorText}</div>
          </div>
        </div>
      </div>
    );
  }
}
export default Profile;
