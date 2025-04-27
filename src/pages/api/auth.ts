// src/pages/api/netlify/auth.ts
// The entry point for the OAuth flow

import type { APIRoute } from 'astro';
import { getAuthorizationUrl } from '../../../lib/netlify/oauth';
import * as crypto from 'crypto';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Generate a random state parameter to verify the callback
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store the state in a cookie for verification
    cookies.set('netlify_auth_state', state, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });
    
    // Get the authorization URL and redirect the user to Netlify
    const authUrl = getAuthorizationUrl(state);
    return redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Netlify OAuth flow:', error);
    return new Response(JSON.stringify({ error: 'Failed to start OAuth flow' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// src/pages/api/netlify/callback.ts
// Handles the OAuth callback from Netlify

import type { APIRoute } from 'astro';
import { exchangeCodeForToken, getCurrentUser } from '../../../lib/netlify/oauth';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    // Check for errors from Netlify
    if (error) {
      return new Response(JSON.stringify({ 
        error, 
        errorDescription,
        message: 'Error during Netlify authorization' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify the state parameter to prevent CSRF attacks
    const storedState = cookies.get('netlify_auth_state')?.value;
    if (!state || state !== storedState) {
      return new Response(JSON.stringify({ 
        error: 'Invalid state parameter',
        message: 'CSRF validation failed'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!code) {
      return new Response(JSON.stringify({ 
        error: 'Missing authorization code',
        message: 'No code parameter received from Netlify'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Exchange the authorization code for an access token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      return new Response(JSON.stringify({ 
        error: 'No access token received',
        message: 'Failed to obtain access token from Netlify'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get user information to confirm authentication
    const userData = await getCurrentUser(accessToken);
    
    // Store the token in a secure, HTTP-only cookie
    cookies.set('netlify_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Redirect to the success page with user information
    return redirect(`/netlify-success?userId=${userData.id}&email=${encodeURIComponent(userData.email || '')}`);
  } catch (error) {
    console.error('Error handling Netlify OAuth callback:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      message: 'Failed to complete OAuth flow'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// src/pages/api/netlify/deploy.ts
// Handles site creation and deployment

import type { APIRoute } from 'astro';
import { createAndDeploySite } from '../../../lib/netlify/oauth';
import JSZip from 'jszip';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get the access token from the cookie
    const accessToken = cookies.get('netlify_access_token')?.value;
    
    if (!accessToken) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'No access token found. Please authenticate with Netlify first.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the site files from the request body
    const requestData = await request.json();
    const { siteFiles } = requestData;
    
    if (!siteFiles || Object.keys(siteFiles).length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Missing site files',
        message: 'No site files provided for deployment'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create a ZIP file with the site files
    const zip = new JSZip();
    
    // Add files to the ZIP
    for (const [filePath, content] of Object.entries(siteFiles)) {
      zip.file(filePath, content);
    }
    
    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Create the site and deploy in one step
    const siteData = await createAndDeploySite(accessToken, zipBuffer);
    
    // Return the site information
    return new Response(JSON.stringify({
      success: true,
      site: {
        id: siteData.id,
        name: siteData.name,
        url: siteData.ssl_url || siteData.url,
        admin_url: `https://app.netlify.com/sites/${siteData.name}/overview`
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deploying site:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      message: 'Failed to deploy site'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};