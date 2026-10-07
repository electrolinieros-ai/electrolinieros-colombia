import { supabase } from "./supabase";

const VISITOR_STORAGE_KEY = "ELECTROLINIEROS_visitor_id";

function createVisitorId(): string {
  return crypto.randomUUID();
}

export function getVisitorId(): string {
  const existingVisitorId = localStorage.getItem(VISITOR_STORAGE_KEY);

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const visitorId = createVisitorId();

  localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);

  return visitorId;
}

export function getTrafficSource(): string {
  const source = new URLSearchParams(window.location.search).get("source");

  if (source === "instagram" || source === "facebook_marketplace") {
    return source;
  }

  if (document.referrer.includes("instagram.com")) {
    return "instagram";
  }

  if (
    document.referrer.includes("facebook.com") ||
    document.referrer.includes("facebookmarketplace.com")
  ) {
    return "facebook_marketplace";
  }

  if (!document.referrer) {
    return "direct";
  }

  return "unknown";
}

export async function touchVisitor(): Promise<string> {
  const visitorId = getVisitorId();
  const source = getTrafficSource();

  try {
    const { error } = await supabase.rpc("touch_visitor", {
      p_visitor_id: visitorId,
      p_source: source,
    });

    if (error) {
      console.error("No fue posible registrar el visitante:", error);
    }
  } catch (exception) {
    console.error("No fue posible registrar el visitante:", exception);
  }

  return visitorId;
}
