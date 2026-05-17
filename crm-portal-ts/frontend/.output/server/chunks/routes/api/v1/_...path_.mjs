import { c as defineEventHandler, g as getRouterParam, e as createError, u as useRuntimeConfig, f as getRequestURL, p as proxyRequest } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const ____path_ = defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing API path"
    });
  }
  const config = useRuntimeConfig(event);
  const requestUrl = getRequestURL(event);
  const baseUrl = String(config.apiBase || "http://127.0.0.1:8080").replace(/\/+$/, "");
  const targetUrl = `${baseUrl}/api/v1/${path}${requestUrl.search}`;
  return proxyRequest(event, targetUrl);
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
