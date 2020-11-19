import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { getAuthToken } from "../client";
import logo from "../img/LOGO1.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Login(props) {
  const [redirect, setredirect] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem("username");
    let pw = localStorage.getItem("password");

    if (user && pw) {
      document.getElementById("username").value = user;
      document.getElementById("password").value = pw;
      document.getElementById("rememberCheck").checked = true;
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    let user = e.target.username.value;
    let pw = e.target.password.value;
    let remember = e.target.rememberCheck.checked;
    let req = await getAuthToken(user, pw);

    if (req.status === 200) {
      if (remember) {
        localStorage.setItem("username", user);
        localStorage.setItem("password", pw);
        localStorage.setItem("remember", true);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("remember");
      }

      sessionStorage.setItem("authToken", req.data);
      setredirect(true);
    } else {
      setShowLoginError(true);
    }
  };

  return redirect ? (
    <Redirect to="/" />
  ) : (
    <Container className="flex-grow-1 justify-content-center" fluid>
      <Row className="flex-column align-items-center justify-content-center pt-5">
        <Col xs={8} sm={6} md={4} xl={2}>
          <img className="img-fluid p-4 mt-5" src={logo} alt="churrasco logo" />

          <Form onSubmit={handleLogin}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text
                  style={{
                    borderBottomLeftRadius: "0",
                  }}
                >
                  <i className="fas fa-user fa-xs"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                style={{
                  borderBottomRightRadius: "0",
                }}
                type="text"
                placeholder="Username"
                id="username"
                name="username"
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text
                  style={{
                    borderTop: "none",
                    borderTopLeftRadius: "0",
                  }}
                >
                  <i className="fas fa-lock fa-xs"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                style={{
                  borderTopRightRadius: "0",
                  borderTop: "none",
                }}
                type="password"
                placeholder="Password"
                name="password"
                id="password"
              />
            </InputGroup>
            <Container className="p-0 mt-2 d-flex justify-content-between align-items-center">
              <Form.Check
                className="d-flex align-items-end"
                type="checkbox"
                label="remember"
                id="rememberCheck"
                name="rememberCheck"
              />
              <Button variant="churrasco" type="submit">
                Log In
              </Button>
            </Container>
          </Form>
        </Col>
      </Row>
      <Modal show={showLoginError} centered>
        <Container className="login-error-modal d-flex flex-column align-items-center text-center">
          <Row className="d-flex flex-column align-items-center">
            <h3>Oops!</h3>
            <p>Looks like you got your username or password wrong.</p>
          </Row>
          <Button variant="churrasco" onClick={() => setShowLoginError(false)}>
            Try again
          </Button>
        </Container>
      </Modal>
    </Container>
  );
}
