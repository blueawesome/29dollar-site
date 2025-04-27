// src/pages/api/test-netlify.ts
import type { APIRoute } from 'astro';
import * as querystring from 'querystring';
import JSZip from 'jszip';

// Configuration - store these in environment variables in production
const NETLIFY_CLIENT_ID = import.meta.env.NETLIFY_CLIENT_ID || 'your_netlify_client_id';
const NETLIFY_CLIENT_SECRET = import.meta.env.NETLIFY_CLIENT_SECRET || 'your_netlify_client_secret';
const REDIRECT_URI = import.meta.env.REDIRECT_URI || 'http://localhost:4321/api/test-netlify';

// For CSRF protection
const generateStateParam = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  
  console.log('API route accessed with:', { 
    code: code ? 'present' : 'not present', 
    state: state ? 'present' : 'not present',
    error: error || 'none',
    errorDescription: errorDescription || 'none',
    fullUrl: request.url
  });
  
  // If there's an error, display it
  if (error) {
    return new Response(JSON.stringify({ 
      error, 
      errorDescription,
      message: 'Error from Netlify OAuth'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const storedState = cookies.get('netlify_auth_state')?.value;
  
  // Step 1: Initial request - redirect to Netlify for authorization
  if (!code) {
    // Generate state parameter for CSRF protection
    const stateParam = generateStateParam();
    
    // Store state in a cookie
    cookies.set('netlify_auth_state', stateParam, {
      path: '/',
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    
    // Redirect to Netlify authorization URL
    // IMPORTANT: Using proper scope value 'user' instead of 'sites'
    const authUrl = `https://app.netlify.com/authorize?` +
      querystring.stringify({
        client_id: NETLIFY_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        state: stateParam,
        scope: 'user' // Changed from 'sites' to 'user' which is what Netlify expects
      });
    
    return redirect(authUrl, 302);
  }
  
  // Step 2: Handle the callback from Netlify
  try {
    // Verify state parameter to prevent CSRF attacks
    if (state !== storedState) {
      return new Response(JSON.stringify({ 
        error: 'Invalid state parameter. Possible CSRF attack.' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.netlify.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: NETLIFY_CLIENT_ID,
        client_secret: NETLIFY_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      })
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Failed to exchange authorization code for token',
        details: errorData
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      return new Response(JSON.stringify({ 
        error: 'No access token received from Netlify' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Step 3: Create a site and deploy in one step using ZIP method
    try {
      // Create a ZIP file with the site contents
      const zip = new JSZip();
      
      // Add files to the ZIP (for testing purposes)
      // In your actual implementation, you would add your generated site files here
      zip.file("index.html", '<html><body><h1>29Dollar.Site Test</h1><p>Deployed using the ZIP method!</p><p>This site was created in your Netlify account.</p></body></html>');
      zip.file("css/style.css", 'body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }');
      zip.file("js/main.js", 'console.log("Hello from 29Dollar.Site");');
      
      // Generate the ZIP as a Buffer
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      
      // Create site and deploy in one step
      const siteName = `29dollar-site-${Date.now()}`;
      const deployResponse = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/zip'
        },
        body: zipBuffer
      });
      
      if (!deployResponse.ok) {
        const errorData = await deployResponse.text();
        console.error('Site creation and deployment error:', errorData);
        return new Response(JSON.stringify({ 
          error: 'Failed to create and deploy site', 
          details: errorData 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const siteData = await deployResponse.json();
      
      // Return the results
      return new Response(JSON.stringify({
        success: true,
        site: {
          id: siteData.id,
          name: siteData.name,
          url: siteData.ssl_url || siteData.url,
          admin_url: `https://app.netlify.com/sites/${siteData.name}/overview`,
          user_account: true // This is created on the user's own account
        },
        token: {
          // Only include minimal token info for security
          type: tokenData.token_type,
          scope: tokenData.scope
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in site creation and deployment:', error);
      return new Response(JSON.stringify({ 
        error: 'Error creating and deploying site',
        message: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Error in Netlify flow:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error in Netlify integration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};