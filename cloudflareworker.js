const defaultDestination = "jackbox.tv";
const ecastDestination = "ecast.jackboxgames.com";
const ecastAws = "ecast-prod-28687133.us-east-1.elb.amazonaws.com";

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

    text = text.replace(defaultDestination, url.hostname);
    text = text.replace(ecastDestination, url.hostname);

    return new Response(text, req);
  } else {
    const req = await fetch(
      `https://${defaultDestination}${url.pathname}`,
      request
    );

    if (req.headers.get("content-type") == "application/javascript") {
      let text = await req.text();
      text = text.replace(defaultDestination, url.hostname);
      text = text.replace(ecastDestination, url.hostname);

      return new Response(text, req);
    }

    return req;
  }
}
