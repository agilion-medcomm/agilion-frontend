export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {

    return context.env.ASSETS.fetch(context.request.url.replace(/\/[^/.]*$/, '/index.html'));
  }
}
