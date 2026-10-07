import { supabase } from "./supabase";
import { getVisitorId } from "./visitor";

export type ProductEventType =
  | "product_viewed"
  | "details_viewed"
  | "price_requested";

/**
 * Registra un evento de producto a través de la función RPC
 * create_event(p_visitor_id, p_product_id, p_event_type), porque la key de
 * Supabase es publishable y solo permite llamar funciones.
 */
export async function trackEvent(
  eventType: ProductEventType,
  productId: string,
): Promise<boolean> {
  const visitorId = getVisitorId();

  try {
    const { error } = await supabase.rpc("create_event", {
      p_visitor_id: visitorId,
      p_product_id: productId,
      p_event_type: eventType,
    });

    if (error) {
      console.error("No fue posible registrar el evento:", error);

      return false;
    }

    return true;
  } catch (exception) {
    console.error("No fue posible registrar el evento:", exception);

    return false;
  }
}