export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const targetUrl = new URL(event.path, config.apiBaseUrl).toString()

  return proxyRequest(event, targetUrl)
})
