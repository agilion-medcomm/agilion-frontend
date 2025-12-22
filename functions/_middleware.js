export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {
    // For SPA: serve index.html for all non-asset routes
    return context.env.ASSETS.fetch(context.request.url.replace(/\/[^/.]*$/, '/index.html'));
  }
}
