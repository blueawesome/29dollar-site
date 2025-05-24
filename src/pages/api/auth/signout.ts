// src/pages/auth/signout.astro
---
export const prerender = false

if (Astro.request.method === 'POST') {
  // Clear the session cookies
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': '/hello',
      'Set-Cookie': [
        'sb-access-token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        'sb-refresh-token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      ].join(', ')
    }
  })
  
  return response
}

// If not POST, redirect to portal
return Astro.redirect('/portal')
---