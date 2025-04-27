// src/pages/api/netlify/auth.js - Use .js extension instead of .ts
export function GET({ redirect }) {
  // Simplified version for testing
  console.log("Auth route hit!");
  
  // Simple redirect to Netlify for testing
  const authUrl = "https://app.netlify.com/authorize?" + 
    new URLSearchParams({
      client_id: import.meta.env.NETLIFY_CLIENT_ID || 'your_test_client_id',
      redirect_uri: import.meta.env.REDIRECT_URI || 'http://localhost:4321/api/netlify/callback',
      response_type: 'code',
      state: 'test_state_value'
    }).toString();
  
  // Log the URL we're redirecting to
  console.log("Redirecting to:", authUrl);
  
  return redirect(authUrl);
}