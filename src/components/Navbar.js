import React from "react";
import { useHistory } from "react-router-dom";
import logo from "../img/LOGO1.png";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

export function NavbarComponent() {
  const history = useHistory();

  return (
    <Navbar className="px-md-5" expand="lg">
      <img height="70" src={logo} alt="churrasco logo" />
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Button
          variant="logout"
          onClick={() => {
            sessionStorage.removeItem("authToken");
            history.push("/login");
          }}
        >
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
