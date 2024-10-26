import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import ChatContext from "../../contexts/ChatContext";

export const ChatBox = ({ isOpen, toggleChat }) => {
  const [hasScroll, setHasScroll] = useState(false);
  const chatRef = useRef(null);
  const users = [
    {
      name: "Marie Horwitz",
      message: "Hello, Are you there?",
      time: "Just now",
      unread: 3,
    },
    {
      name: "Alexa Chung",
      message: "Lorem ipsum dolor sit.",
      time: "5 mins ago",
      unread: 2,
    },
    {
      name: "Danny McChain",
      message: "Lorem ipsum dolor sit.",
      time: "Yesterday",
      unread: 0,
    },
    {
      name: "Ashley Olsen",
      message: "Lorem ipsum dolor sit.",
      time: "Yesterday",
      unread: 0,
    },
    {
      name: "Kate Moss",
      message: "Lorem ipsum dolor sit.",
      time: "Yesterday",
      unread: 0,
    },
    {
      name: "Ben Smith",
      message: "Lorem ipsum dolor sit.",
      time: "Yesterday",
      unread: 0,
    },
  ];
  const messages = [
    {
      sender: "other",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "12:00 PM | Aug 13",
    },
    {
      sender: "me",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      time: "12:05 PM | Aug 13",
    },
  ];
  const [listUser, setListUser] = useState([]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(scrollToBottom, [messages.length]);

  useEffect(() => {
    const fetchMessage = async () => {
      const data = await ChatContext.getChat();
      data.data.forEach((user) => {
        console.log(user.receiver);
      });
    };

    if (isOpen) {
      fetchMessage();
      scrollToBottom();
      checkForScroll();
    }
  }, [messages.length, isOpen]);

  const checkForScroll = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      setHasScroll(scrollHeight > clientHeight);
    }
  };

  return (
    <>
      {isOpen && (
        <section
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            cursor: "default",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div
                  className="card"
                  id="chat3"
                  style={{ borderRadius: "15px", position: "relative" }}
                >
                  <h5 className="card-title text-end gradient-custom-2 py-3">
                    <i
                      className="bi bi-x-lg fs-3 me-4"
                      onClick={toggleChat}
                    ></i>
                  </h5>
                  <div className="card-body pt-0">
                    <div className="row">
                      <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                        <div className="p-3">
                          <div className="input-group rounded mb-3">
                            <input
                              type="search"
                              className="form-control rounded"
                              placeholder="Search"
                              aria-label="Search"
                              aria-describedby="search-addon"
                            />
                            <span
                              className="input-group-text border-0"
                              id="search-addon"
                            >
                              <i className="bi bi-search"></i>
                            </span>
                          </div>
                          <div style={{ height: "400px", overflowY: "auto" }}>
                            <ul className="list-unstyled mb-0">
                              {users.map((user, index) => (
                                <li
                                  key={index}
                                  className="p-2 border-bottom"
                                  style={{
                                    backgroundColor: index === 0 ? "#eee" : "",
                                  }}
                                >
                                  <a
                                    href="#!"
                                    className="d-flex justify-content-between text-decoration-none"
                                  >
                                    <div className="d-flex flex-row">
                                      <img
                                        src={`https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava${
                                          index + 1
                                        }-bg.webp`}
                                        alt="avatar"
                                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                        width="60"
                                      />
                                      <div className="pt-1">
                                        <p className="fw-bold mb-0">
                                          {user.name}
                                        </p>
                                        <p className="small text-muted">
                                          {user.message}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="pt-1">
                                      <p className="small text-muted mb-1">
                                        {user.time}
                                      </p>
                                      {user.unread > 0 && (
                                        <span className="badge bg-danger rounded-pill float-end">
                                          {user.unread}
                                        </span>
                                      )}
                                    </div>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-7 col-xl-8">
                        <div
                          ref={chatContainerRef}
                          className="pt-3 pe-3"
                          style={{
                            height: "400px",
                            overflowY: hasScroll ? "scroll" : "hidden",
                          }}
                        >
                          {messages.map((message, index) => (
                            <div
                              key={index}
                              className={`d-flex flex-row justify-content-${
                                message.sender === "me" ? "end" : "start"
                              } mb-4`}
                            >
                              {message.sender === "other" && (
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                  alt="avatar 1"
                                  style={{ width: "45px", height: "100%" }}
                                />
                              )}
                              <div
                                className={`p-3 ms-3 ${
                                  message.sender === "me"
                                    ? "gradient-custom-2"
                                    : "border"
                                }`}
                                style={{
                                  borderRadius: "15px",
                                  backgroundColor:
                                    message.sender === "me"
                                      ? "#0d6efd"
                                      : "#f5f6f7",
                                }}
                              >
                                <p
                                  className={`small mb-0 ${
                                    message.sender === "me" ? "text-white" : ""
                                  }`}
                                >
                                  {message.content}
                                </p>
                              </div>
                              {message.sender === "me" && (
                                <img
                                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                  alt="avatar 1"
                                  style={{ width: "45px", height: "100%" }}
                                />
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                        <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                            alt="avatar 3"
                            style={{ width: "40px", height: "40px" }}
                            className="rounded-circle"
                          />
                          <input
                            type="text"
                            className="form-control form-control-lg mx-2"
                            id="exampleFormControlInput2"
                            placeholder="Type message"
                          />
                          <button className="btn gradient-custom-2 text-white">
                            <Send size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
