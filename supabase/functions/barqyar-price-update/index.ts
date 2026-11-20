import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const PROJECT_URL = Deno.env.get("SUPABASE_URL") ?? "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1";
const ALLOWED_ORIGIN = "https://ailifedad-bot.github.io";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-barqyar-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const secretKeys = (() => {
  try {
    return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
  } catch {
    return {};
  }
})();
const publishableKeys = (() => {
  try {
    return JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
  } catch {
    return {};
  }
})();
const serviceKey =
  secretKeys.default ??
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  "";
const publishableKey =
  publishableKeys.default ??
  Deno.env.get("SUPABASE_ANON_KEY") ??
  "";

const adminDb = createClient(PROJECT_URL, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function authorize(req: Request): Promise<"cron" | "manual"> {
  const cronToken = req.headers.get("x-barqyar-cron-token");
  if (cronToken) {
    const { data, error } = await adminDb.rpc(
      "shop_verify_price_cron_token",
      { p_token: cronToken },
    );
    if (error || data !== true) throw new Error("cron authorization failed");
    return "cron";
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!jwt || !publishableKey) throw new Error("manager authentication required");

  const { data: userData, error: userError } = await adminDb.auth.getUser(jwt);
  if (userError || !userData.user) throw new Error("invalid manager session");

  const userClient = createClient(PROJECT_URL, publishableKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: isAdmin, error: adminError } = await userClient.rpc("shop_is_admin");
  if (adminError || isAdmin !== true) throw new Error("manager permission required");
  return "manual";
}

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          sku: { type: "string" },
          wholesale_price: { anyOf: [{ type: "number" }, { type: "null" }] },
          retail_price: { anyOf: [{ type: "number" }, { type: "null" }] },
          suggested_price: { anyOf: [{ type: "number" }, { type: "null" }] },
          match_confidence: { type: "number" },
          unit_match: { type: "boolean" },
          match_status: { type: "string", enum: ["verified", "partial", "ambiguous", "not_found"] },
          notes: { type: "string" },
          sources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                source_type: { type: "string", enum: ["wholesale", "retail", "other"] },
                title: { type: "string" },
                url: { type: "string" },
                price: { anyOf: [{ type: "number" }, { type: "null" }] },
                unit: { type: "string" },
                observed_at: { type: "string" },
                notes: { type: "string" },
              },
              required: ["source_type", "title", "url", "price", "unit", "observed_at", "notes"],
            },
          },
        },
        required: [
          "sku", "wholesale_price", "retail_price", "suggested_price",
          "match_confidence", "unit_match", "match_status", "notes", "sources",
        ],
      },
    },
  },
  required: ["items"],
};

function outputText(response: any): string {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }
  const chunks: string[] = [];
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if ((content.type === "output_text" || content.type === "text") && content.text) {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join("\n");
}

function webSourceUrls(response: any): Set<string> {
  const urls = new Set<string>();
  for (const item of response.output ?? []) {
    if (item.type !== "web_search_call") continue;
    const sources = item.action?.sources ?? item.sources ?? [];
    for (const source of sources) {
      if (typeof source.url === "string") urls.add(source.url);
    }
  }
  return urls;
}

function safePrice(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100) / 100;
}

function normalizeCandidate(raw: any, product: any, allowedUrls: Set<string>) {
  const rawSources = Array.isArray(raw?.sources) ? raw.sources : [];
  const sources = rawSources.flatMap((s: any) => {
    const url = typeof s?.url === "string" ? s.url.trim() : "";
    if (!url.startsWith("https://") || !allowedUrls.has(url)) return [];
    const price = safePrice(s.price);
    return [{
      source_type: ["wholesale", "retail"].includes(s.source_type) ? s.source_type : "other",
      title: String(s.title ?? "").slice(0, 300),
      url,
      price,
      unit: String(s.unit ?? "").slice(0, 120),
      observed_at: String(s.observed_at ?? "").slice(0, 80),
      notes: String(s.notes ?? "").slice(0, 500),
    }];
  });

  const wholesalePrices = sources
    .filter((s) => s.source_type === "wholesale" && s.price !== null)
    .map((s) => s.price as number);
  const retailPrices = sources
    .filter((s) => s.source_type === "retail" && s.price !== null)
    .map((s) => s.price as number);
  const median = (values: number[]) => {
    if (!values.length) return null;
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return Math.round((values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2) * 100) / 100;
  };

  const confidence = Math.max(0, Math.min(1, Number(raw?.match_confidence) || 0));
  const unitMatch = raw?.unit_match === true;
  let matchStatus = ["verified", "partial", "ambiguous", "not_found"].includes(raw?.match_status)
    ? raw.match_status
    : "not_found";
  if (!sources.length) matchStatus = "not_found";
  else if (!unitMatch || confidence < 0.7) matchStatus = "partial";
  else if (matchStatus !== "verified") matchStatus = "partial";

  return {
    product_id: product.id,
    product_sku: product.sku,
    product_name: product.name,
    category: product.category,
    unit: product.unit,
    currency: "TOMAN",
    current_price: Number(product.price ?? 0),
    wholesale_price: median(wholesalePrices),
    retail_price: median(retailPrices),
    suggested_price: safePrice(raw?.suggested_price),
    match_confidence: Math.round(confidence * 1000) / 1000,
    unit_match: unitMatch,
    match_status: matchStatus,
    notes: String(raw?.notes ?? "").slice(0, 2000),
    sources,
  };
}

async function runPriceScan(triggerType: "manual" | "cron") {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured in Supabase Edge Function Secrets");

  if (triggerType === "cron") {
    const { data: latest, error: latestError } = await adminDb
      .from("shop_price_update_runs")
      .select("completed_at")
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestError) throw latestError;
    if (latest?.completed_at && Date.now() - new Date(latest.completed_at).getTime() < 14 * 24 * 60 * 60 * 1000) {
      return { skipped: true, reason: "fourteen_day_interval_not_reached" };
    }
  }

  const { data: products, error: productsError } = await adminDb
    .from("shop_products")
    .select("id,sku,name,category,unit,price,description")
    .order("id", { ascending: true });
  if (productsError) throw productsError;
  if (!products?.length) throw new Error("no products found in shop_products");

  const { data: run, error: runError } = await adminDb
    .from("shop_price_update_runs")
    .insert({
      trigger_type: triggerType,
      status: "running",
      product_count: products.length,
    })
    .select("id")
    .single();
  if (runError || !run) throw runError ?? new Error("could not create price update run");

  try {
    const inputProducts = products.map((p: any) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      unit: p.unit,
      current_price_toman: Number(p.price ?? 0),
      description: p.description ?? "",
    }));

    const prompt = [
      "You are a careful price research assistant for Barqyar, an Iranian building electrical supplies shop.",
      "Research current prices in the IRAN market using web search. Use BOTH wholesale supplier/wholesaler sources and retail online shops; keep the two source types separate.",
      "The input contains the complete live product list from the database. Return exactly one item for every input SKU, never invent a SKU and never omit a SKU.",
      "Search for the exact product specifications. Never treat a similar but technically different cable, breaker, switch, lamp, brand, conductor material, cross-section, pole count, amperage, voltage rating, or package size as an exact match.",
      "All numeric prices must be in TOMAN. If a source quotes RIAL, divide by 10 and mention the conversion in notes. Preserve the product's exact sale unit. If a source price unit differs or cannot be converted reliably, set unit_match=false and match_status='partial' or 'ambiguous'.",
      "Only use source URLs actually returned by your web search. Do not invent websites, URLs, prices, or publication dates. A source with no visible current price must have price=null.",
      "For wholesale_price and retail_price, use the median of the relevant sourced prices when possible; if there are no valid sources of that type, return null. suggested_price is only a recommendation for the manager, never a database update.",
      "Set match_status='verified' only when the product specifications and sale unit match clearly and at least one trustworthy source with a price is available. Otherwise use partial, ambiguous, or not_found and lower confidence.",
      "If no reliable current price is found, return null prices, an empty sources array, confidence 0, and not_found. Never use the database's current price as a substitute for a newly researched market price.",
      "Return JSON only according to the required schema.",
    ].join("\n");

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        tools: [{ type: "web_search" }],
        include: ["web_search_call.action.sources"],
        input: [
          { role: "system", content: [{ type: "input_text", text: prompt }] },
          { role: "user", content: [{ type: "input_text", text: JSON.stringify(inputProducts) }] },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "barqyar_price_scan",
            strict: true,
            schema,
          },
        },
        max_output_tokens: 12000,
      }),
    });

    const responseBody = await openaiResponse.json();
    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API ${openaiResponse.status}: ${responseBody?.error?.message ?? "request failed"}`);
    }

    const text = outputText(responseBody);
    if (!text) throw new Error("OpenAI returned no structured text");
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("OpenAI response was not valid JSON");
    }

    const allowedUrls = webSourceUrls(responseBody);
    const bySku = new Map<string, any>();
    for (const item of parsed.items ?? []) {
      if (typeof item.sku === "string") bySku.set(item.sku, item);
    }

    const rows = products.map((product: any) => {
      const raw = bySku.get(product.sku);
      if (!raw) {
        return {
          run_id: run.id,
          product_id: product.id,
          product_sku: product.sku,
          product_name: product.name,
          category: product.category,
          unit: product.unit,
          currency: "TOMAN",
          current_price: Number(product.price ?? 0),
          match_confidence: 0,
          unit_match: false,
          match_status: "not_found",
          notes: "هوش مصنوعی برای این کد کالا نتیجه قابل اتکایی برنگرداند.",
          sources: [],
        };
      }
      return { run_id: run.id, ...normalizeCandidate(raw, product, allowedUrls) };
    });

    const { error: insertError } = await adminDb
      .from("shop_price_candidates")
      .insert(rows);
    if (insertError) throw insertError;

    const { error: completeError } = await adminDb
      .from("shop_price_update_runs")
      .update({
        status: "completed",
        candidate_count: rows.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    if (completeError) throw completeError;

    return {
      run_id: run.id,
      products_scanned: products.length,
      candidates_saved: rows.length,
      sourced_candidates: rows.filter((r: any) => r.sources.length > 0).length,
      approval_required: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await adminDb
      .from("shop_price_update_runs")
      .update({
        status: "failed",
        error_message: message.slice(0, 2000),
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const origin = req.headers.get("origin");
  if (origin && origin !== ALLOWED_ORIGIN) return json({ error: "origin not allowed" }, 403);

  try {
    const triggerType = await authorize(req);
    const result = await runPriceScan(triggerType);
    return json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /authorization|permission|session|required/i.test(message) ? 403 : 500;
    console.error("barqyar-price-update failed:", message);
    return json({ ok: false, error: message }, status);
  }
});
