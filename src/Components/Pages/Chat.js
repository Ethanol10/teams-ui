import React, { Component } from "react";
import { db } from "../../services/firebase";
import { createTaskboard } from "../../helpers/db";
import { auth } from "../../services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AnimatedModal from "./Modal";
import "./Chat.scss";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      groups: new Map(),
      users: new Map(),
      content: "",
      readError: null,
      writeError: null,
      loadingChats: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    //const chatArea = this.myRef.current;
    try {
      db.ref("chats").on("value", (snapshot) => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({ chats });
        //chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
    try {
      db.ref("groups").on("value", (snapshot) => {
        let groups = new Map();
        snapshot.forEach((snap) => {
          groups.set(snap.key, snap.val());
        });

        this.setState({ groups });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
    try {
      db.ref("users").on("value", (snapshot) => {
        let users = new Map();
        snapshot.forEach((snap) => {
          users.set(snap.key, snap.val());
        });

        this.setState({ users });
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }
  async componentWillUnmount() {
    db.ref("users").off("value");
    db.ref("chats").off("value");
    db.ref("groups").off("value");
  }

  handleChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleCreateTaskboard = async () => {
    try {
      await createTaskboard(this.state.user.uid);
    } catch (err) {
      console.error(`An error occurred when creating a new taskboard`, err);
    }
  };

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ writeError: null });
    //const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user.uid,
      });
      this.setState({ content: "" });
      //chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div id="chat" className="">
        <div className="messaging">
          <div className="inbox_msg">
            <div className="inbox_people">
              <div className="headind_srch">
                <div className="recent_heading">
                  <h4>Recent</h4>
                </div>
                <div className="srch_bar">
                  <div className="stylish-input-group">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Search"
                    />
                    <span className="input-group-addon">
                      <button type="button">
                        {" "}
                        <FontAwesomeIcon
                          icon={faSearch}
                          aria-hidden="true"
                        />{" "}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="inbox_chat">
                <div className="chat_list active_chat">
                  <div className="chat_people">
                    <div className="chat_img">
                      {" "}
                      <img
                        src="https://ptetutorials.com/images/user-profile.png"
                        alt="group-no"
                      />{" "}
                    </div>
                    <div className="chat_ib">
                      <h5>
                        Group 1 <span className="chat_date">Dec 25</span>
                      </h5>
                      <p>Description / Last Message</p>
                    </div>
                  </div>
                </div>
                <div className="chat_list">
                  <div className="chat_people">
                    <div className="chat_img">
                      {" "}
                      <img
                        src="https://ptetutorials.com/images/user-profile.png"
                        alt="group-no"
                      />{" "}
                    </div>
                    <div className="chat_ib">
                      <h5>
                        Group 2 <span className="chat_date">Dec 25</span>
                      </h5>
                      <p>Description / Last Message </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fab">
                <AnimatedModal
                  className="fab"
                  users={this.state.users}
                  groups={this.state.groups}
                />
              </div>
            </div>
            <div className="mesgs">
              {/*ref={this.myRef}*/}

              {/* chat area */}
              <div className="msg_history">
                <div className="msg-top">
                  {/* Logged in as:{" "}
                  <strong className="text-info">{this.state.user.email}</strong> */}
                  <div className="group_header">
                    <strong className="text-info">Group 1</strong>
                  </div>
                  <div className="create_subgroup_btn">
                    <button type="button" onClick={this.handleCreateTaskboard}>
                      <FontAwesomeIcon icon={faPlus} />{" "}
                    </button>
                  </div>
                  <div className="create_subgroup_btn">
                    <button type="button">
                      {" "}
                      <FontAwesomeIcon icon={faPlus} />{" "}
                    </button>
                  </div>
                </div>

                {/* loading indicator */}
                {this.state.loadingChats ? (
                  <div
                    className="spinner-border text-success"
                    role="status"
                    style={{
                      display: "flex",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "1em",
                      marginBottom: "1em",
                    }}
                  >
                    <span className="sr-only" style={{}}>
                      Loading...
                    </span>
                  </div>
                ) : (
                  <div className="msg-mid">
                    {this.state.chats.map((chat) => {
                      return (
                        <div
                          key={chat.timestamp}
                          className={
                            this.state.user.uid === chat.uid
                              ? "outgoing_msg"
                              : "incoming_msg"
                          }
                        >
                          {this.state.user.uid === chat.uid ? (
                            ""
                          ) : (
                            <div className="incoming_msg_img">
                              {" "}
                              <img
                                src="https://ptetutorials.com/images/user-profile.png"
                                alt="sunil"
                              />{" "}
                            </div>
                          )}
                          {this.state.user.uid === chat.uid ? (
                            <div className="sent_msg">
                              <p>{chat.content}</p>
                              <span className="time_date">
                                {this.formatTime(chat.timestamp)}
                              </span>
                            </div>
                          ) : (
                            <div className="received_msg">
                              <div className="received_withd_msg">
                                <div className="name-header">
                                  {this.state.users.has(chat.uid)
                                    ? this.state.users.get(chat.uid).name ===
                                      undefined
                                      ? this.state.users.get(chat.uid).email
                                      : this.state.users.get(chat.uid).name
                                    : "Anonymous"}
                                </div>
                                <p>{chat.content}</p>
                                <span className="time_date">
                                  {this.formatTime(chat.timestamp)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <form
                  onKeyDown={this._handleKeyDown}
                  onSubmit={this.handleSubmit}
                  className="type_msg"
                >
                  <textarea
                    type="text"
                    placeholder="Type a message"
                    className="form-control write_msg"
                    name="content"
                    onChange={this.handleChange}
                    value={this.state.content}
                  ></textarea>
                  {this.state.error ? (
                    <p className="text-danger">{this.state.error}</p>
                  ) : null}
                  <button className="msg_send_btn" type="submit">
                    <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
