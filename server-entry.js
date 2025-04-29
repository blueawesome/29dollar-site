// server-entry.js
import { handler } from './dist/server/entry.mjs';

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

// Create the server using your handler
import http from 'http';
const server = http.createServer(handler);

// Start the server
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});