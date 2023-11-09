import { defineApi, resolveAppRoot } from '@red-technology/tripla-api';

defineApi((config) => {
  config.httpConfig = config.httpConfig || {};
  config.app_root = resolveAppRoot(import.meta);
}).start();
