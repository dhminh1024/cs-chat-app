import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import authActions from "../redux/actions/auth.actions";

const PublicNavbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  const authLinks = (
    <Nav className="align-items-center">
      <Nav.Link>
        <img src={currentUser?.avatarUrl} className="avatar-xs" alt="avatar" />{" "}
        {currentUser?.name}
      </Nav.Link>
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );
  const publicLinks = (
    <Nav>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/" className="mr-auto">
        <img src={logo} alt="CoderSchool" width="200px" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        {!loading && <>{isAuthenticated ? authLinks : publicLinks}</>}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default PublicNavbar;
