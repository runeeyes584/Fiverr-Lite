import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

export default router;
// This code defines an Express router for authentication-related routes.
// It imports the necessary modules and functions, creates a new router instance,
// and sets up three POST routes for user registration, login, and logout.
// Finally, it exports the router for use in other parts of the application.
// The routes are defined as follows:
// - POST /register: Calls the register function from the auth controller.
// - POST /login: Calls the login function from the auth controller.
// - POST /logout: Calls the logout function from the auth controller.
// This allows the application to handle user authentication and session management.
// The register function is responsible for creating a new user account.
// The login function handles user authentication and session creation.
// The logout function is responsible for terminating the user's session.
// This modular approach helps keep the code organized and maintainable.
// The auth.controller.js file should contain the implementations of the register, login, and logout functions.
// This code is a part of an Express.js application that manages user authentication.
// It uses the Express Router to define routes for user registration, login, and logout.
// The router is then exported for use in other parts of the application.
// The register function is responsible for creating a new user account.
// The login function handles user authentication and session creation.
// The logout function is responsible for terminating the user's session.
// This modular approach helps keep the code organized and maintainable.
// The auth.controller.js file should contain the implementations of the register, login, and logout functions.
// This code is a part of an Express.js application that manages user authentication.
// It uses the Express Router to define routes for user registration, login, and logout.
// The router is then exported for use in other parts of the application.
// The register function is responsible for creating a new user account.
// The login function handles user authentication and session creation.
// The logout function is responsible for terminating the user's session.
// This modular approach helps keep the code organized and maintainable.
// The auth.controller.js file should contain the implementations of the register, login, and logout functions.
// The register function is responsible for creating a new user account.
// The login function handles user authentication and session creation.
// The logout function is responsible for terminating the user's session.
// By CHatGPT