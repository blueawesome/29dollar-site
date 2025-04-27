// src/pages/api/test.js - Simple test endpoint
export function GET() {
  console.log("Test API endpoint hit");
  
  return new Response(
    JSON.stringify({
      message: "API route is working!",
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}