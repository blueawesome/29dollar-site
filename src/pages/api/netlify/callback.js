// src/pages/api/netlify/callback.js - Updated with token exchange
export async function GET({ request, cookies, redirect }) {
  console.log("Callback route hit!");
  
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  
  console.log("Received params:", { 
    code: code ? "present" : "not present", 
    state, 
    error: error || "none" 
  });
  
  // Check for errors from Netlify
  if (error) {
    return new Response(JSON.stringify({ 
      error, 
      message: 'Error from Netlify OAuth' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check for code
  if (!code) {
    return new Response(JSON.stringify({ 
      error: 'No code parameter received',
      message: 'Authorization code is missing' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Exchange the code for an access token
    const NETLIFY_CLIENT_ID = import.meta.env.NETLIFY_CLIENT_ID || 'your_test_client_id';
    const NETLIFY_CLIENT_SECRET = import.meta.env.NETLIFY_CLIENT_SECRET || 'your_test_client_secret';
    const REDIRECT_URI = import.meta.env.REDIRECT_URI || 'http://localhost:4321/api/netlify/callback';
    
    console.log("Exchanging code for token...");
    
    const tokenResponse = await fetch('https://api.netlify.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: NETLIFY_CLIENT_ID,
        client_secret: NETLIFY_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }).toString()
    });
    
    // Check if token exchange was successful
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      
      return new Response(JSON.stringify({
        error: 'Token exchange failed',
        message: errorText
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the token response
    const tokenData = await tokenResponse.json();
    console.log("Token received:", {
      access_token: tokenData.access_token ? "present" : "not present",
      token_type: tokenData.token_type,
      scope: tokenData.scope
    });
    
    if (!tokenData.access_token) {
      return new Response(JSON.stringify({
        error: 'No access token in response',
        message: 'The token response did not contain an access token'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Store the token in a secure HTTP-only cookie
    cookies.set('netlify_access_token', tokenData.access_token, {
      path: '/',
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Optional: Get some basic user information to confirm the token works
    const userResponse = await fetch('https://api.netlify.com/api/v1/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log("User data retrieved:", {
        email: userData.email,
        full_name: userData.full_name,
        id: userData.id
      });
      
      // Redirect to success page with user information
      return redirect(`/netlify-success?email=${encodeURIComponent(userData.email || '')}`);
    }
    
    // If we couldn't get user data, still redirect to success
    // but with less information
    return redirect('/netlify-success');
    
  } catch (error) {
    console.error("Error in callback handler:", error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message || 'An unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}