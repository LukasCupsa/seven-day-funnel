import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const sha256 = (v?: string) =>
  v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined;

type Body = {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
  custom_data?: Record<string, unknown>;
};

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const pixelId = process.env.META_PIXEL_ID;
        const token = process.env.META_CAPI_TOKEN;
        if (!pixelId || !token) {
          return new Response(JSON.stringify({ error: "missing_config" }), { status: 500 });
        }
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
        }
        if (!body?.event_name) {
          return new Response(JSON.stringify({ error: "missing_event_name" }), { status: 400 });
        }

        const forwarded = request.headers.get("x-forwarded-for") || "";
        const ip = forwarded.split(",")[0]?.trim() || undefined;

        const user_data: Record<string, unknown> = {
          em: body.email ? [sha256(body.email)] : undefined,
          ph: body.phone ? [sha256(body.phone.replace(/\D/g, ""))] : undefined,
          fn: sha256(body.first_name),
          ln: sha256(body.last_name),
          fbp: body.fbp,
          fbc: body.fbc,
          client_ip_address: ip,
          client_user_agent: body.client_user_agent || request.headers.get("user-agent") || undefined,
        };
        Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

        const payload: Record<string, unknown> = {
          data: [
            {
              event_name: body.event_name,
              event_time: Math.floor(Date.now() / 1000),
              event_id: body.event_id,
              event_source_url: body.event_source_url,
              action_source: "website",
              user_data,
              custom_data: body.custom_data || {},
            },
          ],
        };
        const testCode = process.env.META_TEST_EVENT_CODE;
        if (testCode) payload.test_event_code = testCode;

        const res = await fetch(
          `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
