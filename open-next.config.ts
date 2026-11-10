import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// SSR on Cloudflare Workers: pages are rendered on each request and fetch
// live data from the backend API. No build-time data, so no cache store needed.
export default defineCloudflareConfig({});
