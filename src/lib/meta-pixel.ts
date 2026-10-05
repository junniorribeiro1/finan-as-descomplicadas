/**
 * Utilitário de rastreamento para o Meta Pixel (Facebook / Instagram Ads)
 * ID padrão: 939058608879666
 */

export const META_PIXEL_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_META_PIXEL_ID) ||
  "939058608879666";

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: any;
  }
}

/**
 * Dispara evento de visualização de página (PageView).
 * Deve ser disparado nas transições de rotas client-side (SPA).
 */
export function trackPageView(): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", "PageView");
    } catch (e) {
      console.warn("[MetaPixel] Falha ao disparar PageView:", e);
    }
  }
}

export type MetaStandardEvent =
  | "PageView"
  | "CompleteRegistration"
  | "Lead"
  | "Contact"
  | "ViewContent"
  | "InitiateCheckout"
  | "Purchase"
  | "AddToCart"
  | "CustomizeProduct"
  | "Search"
  | "Subscribe"
  | "StartTrial";

/**
 * Dispara um evento padrão da Meta com parâmetros opcionais.
 */
export function trackEvent(
  eventName: MetaStandardEvent | (string & {}),
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("track", eventName, params);
      } else {
        window.fbq("track", eventName);
      }
    } catch (e) {
      console.warn(`[MetaPixel] Falha ao disparar evento ${eventName}:`, e);
    }
  }
}

/**
 * Dispara um evento personalizado da Meta (trackCustom).
 */
export function trackCustomEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("trackCustom", eventName, params);
      } else {
        window.fbq("trackCustom", eventName);
      }
    } catch (e) {
      console.warn(`[MetaPixel] Falha ao disparar evento customizado ${eventName}:`, e);
    }
  }
}

/**
 * Atualiza o consentimento de rastreamento no Meta Pixel (LGPD / GDPR).
 * Conforme especificação oficial: fbq('consent', 'grant') ou fbq('consent', 'revoke').
 */
export function setPixelConsent(granted: boolean): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("consent", granted ? "grant" : "revoke");
    } catch (e) {
      console.warn("[MetaPixel] Falha ao atualizar consentimento:", e);
    }
  }
}
