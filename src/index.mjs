// Code: Main entry point for the application
// Import environment variables from .env file
import 'dotenv/config';
import Gateway from './Gateway.mjs';

// Create a new Gateway instance
const gateway = new Gateway();

// Start the server
gateway.createServer();