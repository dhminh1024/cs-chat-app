import React, { useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import ConversationList from "../components/ConversationList";
import Message from "../components/Message";
import { socketTypes, conversationTypes } from "../config/constants.js";
import { toast } from "react-toastify";

import socketIOClient from "socket.io-client";
let socket;

const HomePage = () => {
  const [globalMessages, setGlobalMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState({
    type: conversationTypes.GLOBAL,
  });
  const loading = useSelector((state) => state.user.loading);

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const currentUser = useSelector((state) => state.auth.user);

  const handleChangeMessage = (e) => {
    setNewMessage(e.target.value);
  };

  const handleClickFriend = (friend) => {
    socket.emit(socketTypes.PRIVATE_MSG_INIT, {
      from: currentUser._id,
      to: friend._id,
    });
  };

  const handleClickConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (conversation.type === conversationTypes.GLOBAL) {
      socket.emit(socketTypes.GLOBAL_MSG_INIT);
    } else {
      console.log(conversation);
      socket.emit(socketTypes.PRIVATE_MSG_INIT, {
        from: currentUser._id,
        to:
          conversation.users[0]._id === currentUser._id
            ? conversation.users[1]._id
            : conversation.users[0]._id,
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (selectedConversation.type === conversationTypes.GLOBAL) {
      socket.emit(socketTypes.GLOBAL_MSG_SEND, {
        from: currentUser._id,
        body: newMessage,
      });
    } else {
      socket.emit(socketTypes.PRIVATE_MSG_SEND, {
        conversation: selectedConversation._id,
        from: currentUser._id,
        to: selectedConversation.to._id,
        body: newMessage,
      });
    }
    setNewMessage("");
  };

  useEffect(() => {
    if (accessToken) {
      socket = socketIOClient(process.env.REACT_APP_BACKEND_API, {
        query: { accessToken },
      });
      socket.emit(socketTypes.GLOBAL_MSG_INIT);
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    if (socket) {
      socket.on(socketTypes.NOTIFICATION, (data) => {
        if (data.onlineUsers) {
          setOnlineUsers(data.onlineUsers);
        }
        if (data.globalMessages) {
          setGlobalMessages(data.globalMessages);
        }
        if (data.globalMsg) {
          setGlobalMessages((globalMessages) => [
            ...globalMessages,
            data.globalMsg,
          ]);
        }
        if (data.selectedConversation) {
          console.log(data.selectedConversation);
          setSelectedConversation({
            ...data.selectedConversation,
            type: conversationTypes.PRIVATE,
          });
        }
        if (data.privateMessages) {
          setPrivateMessages(data.privateMessages);
        }
        if (data.sentMessage) {
          setPrivateMessages((messages) => [...messages, data.sentMessage]);
        }
        if (data.receivedMessage) {
          toast.info(
            `${data.receivedMessage.user.name} has sent you a message`
          );
        }
      });
    }
  }, []);

  return (
    <Container fluid>
      <br />

      {selectedConversation.type === conversationTypes.GLOBAL ? (
        <>
          <h4>Global Room</h4>
          <h6 className="text-success">
            {onlineUsers && (
              <>
                {onlineUsers.length < 2
                  ? onlineUsers.length + " user online"
                  : onlineUsers.length + " users online"}
              </>
            )}
          </h6>
        </>
      ) : (
        <>
          <h4>
            <img
              src={selectedConversation.to?.avatarUrl}
              alt="User Avatar"
              className="avatar-sm mr-3"
            />
            <span>{selectedConversation.to?.name}</span>
          </h4>
          <h6>
            {onlineUsers.includes(selectedConversation.to?._id) ? (
              <span className="text-success"> online</span>
            ) : (
              <span className="text-muted"> offline</span>
            )}
          </h6>
        </>
      )}

      <Row>
        <Col md={4} className="p-3 border conversation-list">
          <ConversationList
            onlineUsers={onlineUsers}
            handleClickFriend={handleClickFriend}
            handleClickConversation={handleClickConversation}
          />
        </Col>
        <Col md={8} className="pr-4 d-flex flex-column justify-content-between">
          <ScrollToBottom className="messages border mb-2">
            <ul className="list-unstyled">
              {selectedConversation.type === conversationTypes.GLOBAL
                ? globalMessages.map((msg) => (
                    <Message key={msg._id} msg={msg} />
                  ))
                : privateMessages.map((msg, i) => (
                    <Message key={msg._id} msg={msg} />
                  ))}
            </ul>
          </ScrollToBottom>
          <div>
            <Form onSubmit={handleSendMessage}>
              <Form.Row>
                <Col>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Type something.."
                    name="newMessage"
                    value={newMessage}
                    onChange={handleChangeMessage}
                  />
                </Col>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !newMessage}
                >
                  Send
                </Button>
              </Form.Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
