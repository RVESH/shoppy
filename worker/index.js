export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const CORS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
    };

    if (method === "OPTIONS")
      return new Response(null, { status: 204, headers: CORS });

    function res(body, status = 200) {
      return new Response(JSON.stringify(body), {
        status, headers: { ...CORS, "Content-Type": "application/json" }
      });
    }

    const db = env.slcart_db;

    try {
      // Test
      if (path === "/api/test")
        return res({ success: true, message: "Worker + D1 working!" });

      return res({ success: false, message: "Route not found: " + path }, 404);
    } catch(e) {
      return res({ success: false, message: e.message }, 500);
    }
  }
};
