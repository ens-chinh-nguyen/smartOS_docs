import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig();
config.buildCommand = 'pnpm next:build';

export default config;

