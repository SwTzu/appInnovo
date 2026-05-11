const root = new URL("../dist/", import.meta.url);
const port = Number.parseInt(process.env.PORT || "30004", 10);
const hostname = process.env.HOST || "127.0.0.1";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getPathname(url) {
  try {
    return decodeURIComponent(new URL(url).pathname);
  } catch {
    return "/";
  }
}

function getExtension(pathname) {
  const lastSegment = pathname.split("/").pop() || "";
  const dotIndex = lastSegment.lastIndexOf(".");
  return dotIndex >= 0 ? lastSegment.slice(dotIndex).toLowerCase() : "";
}

function staticUrlFor(pathname) {
  const cleanPath = pathname.replace(/^\/+/, "");

  if (cleanPath.includes("..")) {
    return null;
  }

  return new URL(cleanPath || "index.html", root);
}

function routeHtmlUrlFor(pathname) {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");

  if (cleanPath.includes("..")) {
    return null;
  }

  if (!cleanPath) {
    return new URL("index.html", root);
  }

  return new URL(`${cleanPath}.html`, root);
}

async function serveFile(fileUrl, extension) {
  const file = Bun.file(fileUrl);

  if (!(await file.exists())) {
    return null;
  }

  return new Response(file, {
    headers: {
      "Cache-Control": extension && extension !== ".html" ? "public, max-age=31536000, immutable" : "no-cache",
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    },
  });
}

Bun.serve({
  hostname,
  port,
  async fetch(request) {
    const pathname = getPathname(request.url);
    const extension = getExtension(pathname);
    const fileUrl = staticUrlFor(pathname);

    if (!fileUrl) {
      return new Response("Not found", { status: 404 });
    }

    const staticResponse = await serveFile(fileUrl, extension || getExtension(fileUrl.pathname));

    if (staticResponse) {
      return staticResponse;
    }

    if (!extension) {
      const routeResponse = await serveFile(routeHtmlUrlFor(pathname), ".html");

      if (routeResponse) {
        return routeResponse;
      }

      const indexResponse = await serveFile(new URL("index.html", root), ".html");

      if (indexResponse) {
        return indexResponse;
      }
    } else {
      return new Response("Not found", { status: 404 });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Serving Innovo app web on http://${hostname}:${port}`);
