// Cloudflare Worker: tampilkan halaman "maaf" saat origin (komputer/VPS/tunnel) tidak bisa dijangkau.
import page from "./index.html"; // error mendadak: kucing pekerja
import scheduledPage from "./terjadwal.html"; // maintenance terjadwal: kucing tidur

// Status yang dianggap "server bermasalah".
// 530 = Cloudflare Tunnel putus (error 1033), 52x = origin Cloudflare error.
const DOWN_STATUSES = new Set([502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 527, 530]);

const HEADERS_HTML = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
  "retry-after": "60",
  "x-robots-tag": "noindex",
};

function maintenanceResponse(request, html = page) {
  const accept = request.headers.get("accept") || "";
  // Navigasi browser dapat halaman cantik. Panggilan API/fetch dapat JSON agar aplikasi tidak error aneh.
  if (accept.includes("text/html")) {
    return new Response(request.method === "HEAD" ? null : html, { status: 503, headers: HEADERS_HTML });
  }
  return new Response(
    JSON.stringify({ error: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." }),
    {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "retry-after": "60" },
    }
  );
}

export default {
  async fetch(request, env) {
    // Mode maintenance manual: set variabel MAINTENANCE = "true" di Cloudflare.
    if (env.MAINTENANCE === "true") {
      return maintenanceResponse(request, scheduledPage);
    }
    try {
      const response = await fetch(request);
      if (DOWN_STATUSES.has(response.status)) {
        return maintenanceResponse(request);
      }
      return response;
    } catch (err) {
      return maintenanceResponse(request);
    }
  },
};
