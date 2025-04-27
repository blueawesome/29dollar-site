// src/pages/api/netlify/deploy.js
export async function POST({ request, cookies }) {
  console.log("Deploy endpoint hit!");
  
  try {
    // Get the access token from the cookie
    const accessToken = cookies.get('netlify_access_token')?.value;
    
    if (!accessToken) {
      console.error("No access token found in cookies");
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'No access token found. Please authenticate with Netlify first.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the site files from the request body
    let siteFiles;
    try {
      const requestData = await request.json();
      siteFiles = requestData.siteFiles;
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ 
        error: 'Invalid request',
        message: 'Could not parse request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!siteFiles || Object.keys(siteFiles).length === 0) {
      console.error("No site files provided");
      return new Response(JSON.stringify({ 
        error: 'Missing site files',
        message: 'No site files provided for deployment'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Import JSZip dynamically
    const JSZip = (await import('jszip')).default;
    
    // Create a ZIP file with the site files
    console.log("Creating ZIP file...");
    const zip = new JSZip();
    
    // Add files to the ZIP
    for (const [filePath, content] of Object.entries(siteFiles)) {
      zip.file(filePath, content);
    }
    
    // Generate the ZIP file
    console.log("Generating ZIP file...");
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    
    // Create the site name with a timestamp to ensure uniqueness
    const siteName = `29dollar-site-${Date.now()}`;
    
    // Create the site and deploy in one step
    console.log(`Creating site "${siteName}" and deploying...`);
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/zip'
      },
      body: zipBuffer
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Site creation failed:", errorText);
      
      return new Response(JSON.stringify({ 
        error: 'Failed to create and deploy site',
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the response
    const siteData = await response.json();
    console.log("Site created and deployed:", {
      id: siteData.id,
      name: siteData.name,
      url: siteData.ssl_url || siteData.url
    });
    
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
    console.error("Error in deploy endpoint:", error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message || 'An unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}