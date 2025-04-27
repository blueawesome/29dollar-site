// src/lib/netlify/oauth.js
// A utility file for handling Netlify OAuth operations

/**
 * Configuration for Netlify OAuth
 * These should be stored in environment variables in production
 */
const NETLIFY_CLIENT_ID = import.meta.env.NETLIFY_CLIENT_ID;
const NETLIFY_CLIENT_SECRET = import.meta.env.NETLIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.REDIRECT_URI || 'http://localhost:4321/api/netlify/callback';

/**
 * Generate a URL to initialize the OAuth flow with Netlify
 * @param {string} state - A random state parameter to verify callback authenticity
 * @returns {string} The authorization URL
 */
export function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: NETLIFY_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state: state
  });
  
  return `https://app.netlify.com/authorize?${params.toString()}`;
}

/**
 * Exchange an authorization code for an access token
 * @param {string} code - The authorization code received from Netlify
 * @returns {Promise<object>} The response containing the access token
 */
export async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: NETLIFY_CLIENT_ID,
    client_secret: NETLIFY_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI
  });
  
  const response = await fetch('https://api.netlify.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }
  
  return response.json();
}

/**
 * Create a new site on the user's Netlify account
 * @param {string} accessToken - The OAuth access token
 * @param {string} siteName - The name for the new site
 * @returns {Promise<object>} The newly created site data
 */
export async function createSite(accessToken, siteName = `29dollar-site-${Date.now()}`) {
  const response = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: siteName })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create site: ${error}`);
  }
  
  return response.json();
}

/**
 * Deploy site content using a ZIP file
 * @param {string} accessToken - The OAuth access token
 * @param {string} siteId - The ID of the site to deploy to
 * @param {ArrayBuffer} zipData - The ZIP file data to deploy
 * @returns {Promise<object>} The deployment data
 */
export async function deploySite(accessToken, siteId, zipData) {
  const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/zip'
    },
    body: zipData
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy site: ${error}`);
  }
  
  return response.json();
}

/**
 * Create and deploy a site in one step
 * @param {string} accessToken - The OAuth access token
 * @param {ArrayBuffer} zipData - The ZIP file data to deploy
 * @returns {Promise<object>} The site and deployment data
 */
export async function createAndDeploySite(accessToken, zipData) {
  const response = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/zip'
    },
    body: zipData
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create and deploy site: ${error}`);
  }
  
  return response.json();
}

/**
 * Get information about the authenticated user
 * @param {string} accessToken - The OAuth access token
 * @returns {Promise<object>} The user data
 */
export async function getCurrentUser(accessToken) {
  const response = await fetch('https://api.netlify.com/api/v1/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user data: ${error}`);
  }
  
  return response.json();
}