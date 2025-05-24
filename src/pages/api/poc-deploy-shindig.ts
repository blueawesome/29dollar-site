// src/pages/api/poc-deploy-shindig.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip'; // For zipping the dist folder

// Helper function to make Cloudflare API requests
async function cfRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  apiToken: string,
  body?: any
) {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${apiToken}`,
  };
  if (body && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Cloudflare API Error (${response.status} ${response.statusText}) for ${method} ${endpoint}: ${errorText}`);
    throw new Error(`Cloudflare API Error: ${response.status} - ${errorText}`);
  }
  return response.json();
}


export const POST: APIRoute = async ({ request }) => {
  // --- CONFIGURATION (Hardcode or get from request/env vars) ---
  const CLOUDFLARE_API_TOKEN = import.meta.env.CLOUDFLARE_API_TOKEN;
  const CLOUDFLARE_ACCOUNT_ID = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
  const SHINDIG_SITE_ZONE_ID = import.meta.env.SHINDIG_SITE_ZONE_ID || "eede1e55fde6e55506b8f1c9e2eceec6"; // Fallback for safety

  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID || !SHINDIG_SITE_ZONE_ID) {
    return new Response(JSON.stringify({ error: "Cloudflare API token, Account ID, or Zone ID missing in server environment." }), { status: 500 });
  }

  let subdomainHandle = '';
  try {
    const requestData = await request.json();
    subdomainHandle = requestData.subdomainHandle;
    if (!subdomainHandle || typeof subdomainHandle !== 'string' || !/^[a-z0-9-]+$/.test(subdomainHandle)) {
      throw new Error("Invalid or missing 'subdomainHandle'. Use lowercase letters, numbers, and hyphens.");
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request body. Expected JSON with 'subdomainHandle'." }), { status: 400 });
  }

  const fullVanityDomain = "shindig.site"; // The vanity domain we're using
  const finalFqdn = `${subdomainHandle}.${fullVanityDomain}`;
  const pagesProjectName = `poc-${subdomainHandle}-shindig`; // Unique name for the CF Pages project

  // Path to your placeholder static site's dist folder
  // IMPORTANT: Adjust this path to where your 'dist' folder is accessible by this API route
  // For POC, assuming it's in a 'poc_static_assets/dist' at the root of *this* project
  const staticDistPath = path.resolve(process.cwd(), 'poc_static_assets/dist');
  console.log(`[POC Deploy] Using static assets from: ${staticDistPath}`);

  try {
    // --- 1. Create a ZIP of the dist folder ---
    console.log(`[POC Deploy] Zipping contents of ${staticDistPath}...`);
    const zip = new AdmZip();
    zip.addLocalFolder(staticDistPath);
    const zipBuffer = zip.toBuffer();
    console.log(`[POC Deploy] ZIP created, size: ${zipBuffer.length} bytes`);

    // --- 2. Create Cloudflare Pages Project (or use existing if you prefer for POC) ---
    // For POC, we might try to create it each time or check if it exists
    // A more robust solution would check and update.
    // For now, let's try to create. It might fail if it already exists - handle this.
    let pagesProjectDetails;
    try {
      console.log(`[POC Deploy] Creating/getting Cloudflare Pages project: ${pagesProjectName}...`);
      pagesProjectDetails = await cfRequest(
        `/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
        'POST',
        CLOUDFLARE_API_TOKEN,
        {
          name: pagesProjectName,
          production_branch: "main", // Required, even if not using Git build
          build_config: { // Minimal build config for direct uploads
            build_command: "", 
            destination_dir: "", // Will be overridden by direct upload
          },
          // deployment_configs: { production: { destination_dir: "" } } // Alternative syntax
        }
      );
      console.log(`[POC Deploy] Pages project details:`, pagesProjectDetails.result.subdomain); // e.g. project-name.pages.dev
    } catch (e: any) {
      if (e.message && e.message.includes("Project already exists")) { // Error code might be more reliable
        console.log(`[POC Deploy] Pages project ${pagesProjectName} already exists. Fetching details...`);
        // You would typically fetch the existing project details here if needed, or just proceed
        // For POC, we'll assume it's okay to proceed if it exists
        pagesProjectDetails = { result: { name: pagesProjectName, subdomain: `${pagesProjectName}.pages.dev` } }; // Mock structure
      } else {
        throw e; // Re-throw other errors
      }
    }
    
    const pagesProjectActualName = pagesProjectDetails.result.name; // Use the actual name returned or used
    const pagesDevUrl = pagesProjectDetails.result.subdomain; // This is something like project-name.pages.dev

    // --- 3. Deploy files to Cloudflare Pages (Direct Upload) ---
    // Cloudflare's direct upload is a multi-step process: upload assets, then create deployment
    // For simplicity in POC, using Wrangler's underlying logic would be easier if possible,
    // but pure API means uploading a zip or manifest of files.
    // The API for direct upload is more complex than a single call.
    // A simpler approach for a POC might be to manually upload the zip via CF Dashboard once to a test project,
    // then for the API POC, just focus on creating the DNS.
    //
    // HOWEVER, let's attempt a simplified direct upload of the ZIP:
    // This usually requires a manifest of files. Uploading a single zip directly to the create deployment endpoint
    // is often what wrangler does behind the scenes but isn't a straightforward single API call.
    //
    // Let's assume we have a Pages project. The actual upload of a ZIP is complex via raw API.
    // A true robust solution uses wrangler or recreates its multi-part upload logic.
    // FOR THIS POC, we will mock this step and assume it succeeded and we have the pagesDevUrl.
    // In a real scenario, you'd implement the full direct upload manifest process or use Wrangler.
    console.log(`[POC Deploy] MOCKING: Files would be uploaded to ${pagesProjectActualName}, resulting in URL: ${pagesDevUrl}`);
    // If you want to try the actual upload later, it involves:
    // 1. POST to /accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${pagesProjectName}/upload (get upload token)
    // 2. Upload files using that token
    // 3. POST to /accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${pagesProjectName}/deployments (referencing uploaded assets)

    // --- 4. Create/Update DNS CNAME Record ---
    console.log(`[POC Deploy] Checking for existing DNS record for ${finalFqdn}...`);
    const dnsRecords = await cfRequest(
      `/zones/${SHINDIG_SITE_ZONE_ID}/dns_records?name=${finalFqdn}&type=CNAME`,
      'GET',
      CLOUDFLARE_API_TOKEN
    );

    let dnsRecordId = null;
    if (dnsRecords.result && dnsRecords.result.length > 0) {
      dnsRecordId = dnsRecords.result[0].id;
      console.log(`[POC Deploy] Found existing CNAME record ID: ${dnsRecordId}`);
      console.log(`[POC Deploy] Updating DNS CNAME record for ${finalFqdn} to point to ${pagesDevUrl}...`);
      await cfRequest(
        `/zones/${SHINDIG_SITE_ZONE_ID}/dns_records/${dnsRecordId}`,
        'PUT',
        CLOUDFLARE_API_TOKEN,
        {
          type: 'CNAME',
          name: subdomainHandle, // Just the subdomain part
          content: pagesDevUrl,  // The target e.g., project-name.pages.dev
          ttl: 1, // 1 for 'automatic', or a specific number like 120
          proxied: true, // Orange cloud
        }
      );
    } else {
      console.log(`[POC Deploy] No existing CNAME record found. Creating new one...`);
      await cfRequest(
        `/zones/${SHINDIG_SITE_ZONE_ID}/dns_records`,
        'POST',
        CLOUDFLARE_API_TOKEN,
        {
          type: 'CNAME',
          name: subdomainHandle,
          content: pagesDevUrl,
          ttl: 1,
          proxied: true,
        }
      );
    }
    console.log(`[POC Deploy] DNS record for ${finalFqdn} created/updated successfully.`);

    // --- 5. TODO: Database Logging ---
    // In a real app, update site_deployments and sites tables here.
    // console.log(`[POC Deploy] TODO: Log to DB - Site: ${siteId}, Deployed URL: ${finalFqdn}, Pages URL: ${pagesDevUrl}`);

    return new Response(JSON.stringify({ 
      message: "POC Deployment to Cloudflare Pages (mocked file upload) and DNS update initiated successfully!",
      liveUrl: `https://${finalFqdn}`,
      pagesDevUrl: `https://${pagesDevUrl}`
    }), { status: 200 });

  } catch (error: any) {
    console.error("[POC Deploy] Error in deployment process:", error);
    return new Response(JSON.stringify({ error: "Deployment process failed.", details: error.message }), { status: 500 });
  }
};