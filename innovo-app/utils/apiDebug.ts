const redactSensitiveValue = (key: string, value: unknown) => {
  const normalizedKey = key.toLowerCase();
  if (
    normalizedKey.includes("token") ||
    normalizedKey.includes("authorization") ||
    normalizedKey.includes("clave") ||
    normalizedKey.includes("password")
  ) {
    return "[REDACTED]";
  }

  return value;
};

const redactData = (data: unknown): unknown => {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactData);
  }

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => [
      key,
      redactSensitiveValue(key, redactData(value)),
    ])
  );
};

const safeParseJson = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const getRequestBody = (init?: RequestInit) => {
  if (!init?.body || typeof init.body !== "string") {
    return undefined;
  }

  return redactData(safeParseJson(init.body));
};

const getRequestHeaders = (init?: RequestInit) => {
  if (!init?.headers) {
    return undefined;
  }

  const headers = new Headers(init.headers);
  const entries = Array.from(headers.entries()).map(([key, value]) => [
    key,
    redactSensitiveValue(key, value),
  ]);

  return Object.fromEntries(entries);
};

const getUrl = (input: RequestInfo | URL) => {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

const shouldLogApiRequest = (url: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  return Boolean(apiUrl && url.startsWith(apiUrl));
};

export const installApiDebugLogger = () => {
  if (process.env.EXPO_PUBLIC_API_DEBUG !== "true") {
    return;
  }

  if ((globalThis as typeof globalThis & { __apiDebugLoggerInstalled?: boolean }).__apiDebugLoggerInstalled) {
    return;
  }

  (globalThis as typeof globalThis & { __apiDebugLoggerInstalled?: boolean }).__apiDebugLoggerInstalled = true;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getUrl(input);
    const method = init?.method || (typeof input === "object" && "method" in input ? input.method : "GET");
    const startedAt = Date.now();
    const shouldLog = shouldLogApiRequest(url);

    if (shouldLog) {
      console.log("[APP API ->]", {
        method,
        url,
        headers: getRequestHeaders(init),
        body: getRequestBody(init),
      });
    }

    try {
      const response = await originalFetch(input, init);
      const durationMs = Date.now() - startedAt;

      if (shouldLog) {
        const responseClone = response.clone();
        const contentType = responseClone.headers.get("content-type") || "";
        let body: unknown = "[non-json response]";

        if (contentType.includes("application/json")) {
          body = redactData(await responseClone.json());
        }

        console.log("[APP API <-]", {
          method,
          url,
          status: response.status,
          ok: response.ok,
          durationMs,
          body,
        });
      }

      return response;
    } catch (error) {
      if (shouldLog) {
        console.warn("[APP API xx]", {
          method,
          url,
          durationMs: Date.now() - startedAt,
          error: error instanceof Error ? error.message : String(error),
        });
      }

      throw error;
    }
  };
};
