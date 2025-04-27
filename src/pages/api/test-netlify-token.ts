// src/pages/api/test-netlify-token.ts
import type { APIRoute } from 'astro';
import JSZip from 'jszip';

// Use a personal access token for testing instead of OAuth
// Get this from https://app.netlify.com/user/applications#personal-access-tokens
const NETLIFY_TOKEN = import.meta.env.NETLIFY_TOKEN || 'your_personal_access_token';

export const GET: APIRoute = async ({ request }) => {
  console.log('Testing Netlify API with personal access token');
  
  try {
    // Create a ZIP file with the site contents
    const zip = new JSZip();
    
    // Add files to the ZIP (for testing purposes)
    zip.file("index.html", '<html><body><h1>29Dollar.Site Test</h1><p>Deployed using personal access token!</p><p>This site was created using the Netlify API.</p></body></html>');
    zip.file("css/style.css", 'body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }');
    zip.file("js/main.js", 'console.log("Hello from 29Dollar.Site");');
    
    // Generate the ZIP as a Buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    
    // Create site and deploy in one step
    const siteName = `29dollar-site-${Date.now()}`;
    console.log(`Creating site: ${siteName}`);
    
    const deployResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/zip'
      },
      body: zipBuffer
    });
    
    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      console.error('Site creation error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to create and deploy site', 
        status: deployResponse.status,
        details: errorText
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const siteData = await deployResponse.json();
    console.log('Site created successfully:', siteData.name);
    
    // Return the results
    return new Response(JSON.stringify({
      success: true,
      site: {
        id: siteData.id,
        name: siteData.name,
        url: siteData.ssl_url || siteData.url,
        admin_url: `https://app.netlify.com/sites/${siteData.name || siteData.id}/overview`
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating site:', error);
    return new Response(JSON.stringify({ 
      error: 'Error creating and deploying site',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};