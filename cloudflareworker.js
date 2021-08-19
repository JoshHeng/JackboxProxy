const defaultDestination = 'jackbox.tv';
const ecastDestination = 'ecast.jackboxgames.com';
const ecastProxy = 'https://jackboxabc.vercel.app/api?path=';

addEventListener('fetch', function(event) {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  // Only GET requests work with this proxy.
  if (request.method !== 'GET') return MethodNotAllowed(request);
  
  const rewriteDestination = request.headers.get('Host');
  const proxyUrl = `https://${rewriteDestination}`;
  const path = request.url.slice(request.url.search(rewriteDestination) + rewriteDestination.length);
  
  if (path.startsWith('/ecast')) {
    // Handle Ecast API requests
    const ecastPath = path.slice('6');
    try {
        const res2 = await fetch(`${ecastProxy}${ecastPath}`);
        const data = await res2.json();

        return new Response(JSON.stringify({...data, body: {
            ...data.body, host: `${rewriteDestination}/websocket/${data.body.host}`
        }}), res2);
    }
    catch (err) {
        console.log('2');
        if (err.response) {
            return new Response(err.response);
        }
        return new Response('ERROR');
    }
  }

  if (path.startsWith('/websocket')) {
    const websocketPath = path.slice('11');
    return fetch(`https://${websocketPath}`, request)
  }

  else {
    // Handle normal requests to cloudfront
    const res = await fetch(`https://${defaultDestination}${path}`);
    const contentType = res.headers.get("Content-Type");

    if (contentType === 'application/javascript') {
      let data = await res.text();

      data = data.replace(defaultDestination, rewriteDestination);
      data = data.replace(ecastDestination, `${rewriteDestination}/ecast`);

      return new Response(data, res);
    }

    return res;
  }
}

function MethodNotAllowed(request) {
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    headers: {
      'Allow': 'GET'
    }
  })
}