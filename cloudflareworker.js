const defaultDestination = "jackbox.tv";
const ecastDestination = "ecast.jackboxgames.com";
const ecastAws = "ecast-prod-28687133.us-east-1.elb.amazonaws.com";
const bundleHost = "bundles.jackbox.tv";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api")) {
    const newHeaders = Object.fromEntries([...request.headers]);
    delete newHeaders.host;
    delete newHeaders.origin;

    const req = await fetch(`http://${ecastAws}${url.pathname}`, {
      method: request.method,
      headers: {
        ...newHeaders,
        host: ecastDestination,
      },
    });
    let text = await req.text();

    text = text.replace(bundleHost, `${url.hostname}/bundles`);
    text = text.replace(defaultDestination, url.hostname);
    text = text.replace(ecastDestination, url.hostname);

    return new Response(text, req);
  } else {
    const bundle = url.pathname.startsWith("/bundles");
    
    const req = await fetch(
      `https://${bundle ? bundleHost : defaultDestination}${url.pathname.slice(bundle ? 8 : 0)}`,
      request
    );

    if (['application/javascript', 'text/javascript', 'text/css'].includes(req.headers.get("content-type"))) {
      let text = await req.text();
      text = text.replace(bundleHost, `${url.hostname}/bundles`);
      text = text.replace(defaultDestination, url.hostname);
      text = text.replace(ecastDestination, url.hostname);

      return new Response(text, req);
    }

    return req;
  }
}
