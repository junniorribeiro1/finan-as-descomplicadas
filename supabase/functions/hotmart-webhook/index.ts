import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

type PlanConfig = {
  plan: string;
  accountType: "pf" | "pj" | "pfj";
  months: number;
};

const PLAN_MAP: Record<string, PlanConfig> = {
  "MENSAL - PF": {
    plan: "mensal_pf",
    accountType: "pf",
    months: 1,
  },
  "TRIMESTRAL - PF": {
    plan: "trimestral_pf",
    accountType: "pf",
    months: 3,
  },
  "SEMESTRAL - PF": {
    plan: "semestral_pf",
    accountType: "pf",
    months: 6,
  },
  "ANUAL - PF": {
    plan: "anual_pf",
    accountType: "pf",
    months: 12,
  },

  "MENSAL - PJ": {
    plan: "mensal_pj",
    accountType: "pj",
    months: 1,
  },
  "TRIMESTRAL - PJ": {
    plan: "trimestral_pj",
    accountType: "pj",
    months: 3,
  },
  "SEMESTRAL - PJ": {
    plan: "semestral_pj",
    accountType: "pj",
    months: 6,
  },
  "ANUAL - PJ": {
    plan: "anual_pj",
    accountType: "pj",
    months: 12,
  },

  "MENSAL - COMBO PFJ": {
    plan: "mensal_pfj",
    accountType: "pfj",
    months: 1,
  },
  "TRIMESTRAL - COMBO PFJ": {
    plan: "trimestral_pfj",
    accountType: "pfj",
    months: 3,
  },
  "SEMESTRAL - COMBO PFJ": {
    plan: "semestral_pfj",
    accountType: "pfj",
    months: 6,
  },
  "ANUAL - COMBO PFJ": {
    plan: "anual_pfj",
    accountType: "pfj",
    months: 12,
  },

  // Algumas variações possíveis do nome no Hotmart
  "MENSAL - COMBO PF + PJ": {
    plan: "mensal_pfj",
    accountType: "pfj",
    months: 1,
  },
  "TRIMESTRAL - COMBO PF + PJ": {
    plan: "trimestral_pfj",
    accountType: "pfj",
    months: 3,
  },
  "SEMESTRAL - COMBO PF + PJ": {
    plan: "semestral_pfj",
    accountType: "pfj",
    months: 6,
  },
  "ANUAL - COMBO PF + PJ": {
    plan: "anual_pfj",
    accountType: "pfj",
    months: 12,
  },
};

function normalizePlanName(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  if (aBytes.length !== bBytes.length) return false;

  let difference = 0;

  for (let i = 0; i < aBytes.length; i++) {
    difference |= aBytes[i] ^ bBytes[i];
  }

  return difference === 0;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDay));

  return result;
}

function getPurchaseDate(data: any): Date {
  const timestamp =
    data?.purchase?.approved_date ??
    data?.purchase?.order_date ??
    data?.purchase?.created_at;

  if (typeof timestamp === "number") {
    return new Date(timestamp);
  }

  if (typeof timestamp === "string") {
    const parsed = new Date(timestamp);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return new Date();
}

function generateTemporaryPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function findAuthUserByEmail(
  supabaseAdmin: any,
  email: string,
): Promise<any | null> {
  const normalizedEmail = email.toLowerCase().trim();

  for (let page = 1; page <= 20; page++) {
    const { data, error } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

    if (error) {
      throw new Error(`Erro ao consultar usuários: ${error.message}`);
    }

    const users = data?.users ?? [];

    const found = users.find(
      (user: any) =>
        typeof user.email === "string" &&
        user.email.toLowerCase() === normalizedEmail,
    );

    if (found) return found;

    if (users.length < 1000) break;
  }

  return null;
}

async function getOrCreateUser(
  supabaseAdmin: any,
  email: string,
  fullName: string,
): Promise<{
  userId: string;
  created: boolean;
  currentAccessExpiresAt?: string | null;
}> {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: existingProfile, error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .select("id, access_expires_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

  if (profileError) {
    throw new Error(
      `Erro ao consultar profile: ${profileError.message}`,
    );
  }

  if (existingProfile?.id) {
    return {
      userId: existingProfile.id,
      created: false,
      currentAccessExpiresAt: existingProfile.access_expires_at ?? null,
    };
  }

  const existingAuthUser = await findAuthUserByEmail(
    supabaseAdmin,
    normalizedEmail,
  );

  if (existingAuthUser?.id) {
    const { data: profileById } = await supabaseAdmin
      .from("profiles")
      .select("access_expires_at")
      .eq("id", existingAuthUser.id)
      .maybeSingle();

    return {
      userId: existingAuthUser.id,
      created: false,
      currentAccessExpiresAt: profileById?.access_expires_at ?? null,
    };
  }

  const temporaryPassword = generateTemporaryPassword();

  const { data, error } =
    await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

  if (error || !data?.user?.id) {
    throw new Error(
      `Erro ao criar usuário: ${error?.message ?? "usuário não criado"}`,
    );
  }

  return {
    userId: data.user.id,
    created: true,
    currentAccessExpiresAt: null,
  };
}

export default {
  fetch: withSupabase(
    { auth: "none" },
    async (req, ctx) => {
      if (req.method !== "POST") {
        return Response.json(
          {\n            ok: false,
            error: "Método não permitido",
          },
          { status: 405 },
        );
      }

      const receivedHottok =
        req.headers.get("X-HOTMART-HOTTOK") ?? "";

      const expectedHottok =
        Deno.env.get("HOTMART_HOTTOK") ?? "";

      if (
        !expectedHottok ||
        !receivedHottok ||
        !safeEqual(receivedHottok, expectedHottok)
      ) {
        console.warn("Webhook recusado: Hottok inválido.");

        return Response.json(
          {
            ok: false,
            error: "Não autorizado",
          },
          { status: 401 },
        );
      }

      let payload: any;

      try {
        payload = await req.json();
      } catch {
        return Response.json(
          {
            ok: false,
            error: "JSON inválido",
          },
          { status: 400 },
        );
      }

      const eventId =
        typeof payload?.id === "string"
          ? payload.id
          : null;

      const eventType =
        typeof payload?.event === "string"
          ? payload.event
          : "";

      const data = payload?.data ?? {};

      const buyerEmail =
        typeof data?.buyer?.email === "string"
          ? data.buyer.email.toLowerCase().trim()
          : "";

      const buyerName =
        typeof data?.buyer?.name === "string"
          ? data.buyer.name.trim()
          : "";

      const productId =
        data?.product?.id != null
          ? String(data.product.id)
          : null;

      const productName =
        typeof data?.product?.name === "string"
          ? data.product.name
          : null;

      const transactionId =
        typeof data?.purchase?.transaction === "string"
          ? data.purchase.transaction
          : null;

      const subscriptionId =
        typeof data?.subscription?.id === "string"
          ? data.subscription.id
          : null;

      const offerCode =
        typeof data?.purchase?.offer?.code === "string"
          ? data.purchase.offer.code
          : null;

      const admin = ctx.supabaseAdmin;

      // Evita processar o mesmo evento duas vezes.
      if (eventId) {
        const { data: existingEvent, error: eventLookupError } =
          await admin
            .from("hotmart_events")
            .select("id, processed, error_message")
            .eq("event_id", eventId)
            .maybeSingle();

        if (eventLookupError) {
          throw new Error(
            `Erro ao consultar evento: ${eventLookupError.message}`,
          );
        }

        if (existingEvent?.processed) {
          return Response.json({
            ok: true,
            duplicate: true,
            message: "Evento já processado.",
          });
        }
      }

      // Registra o evento recebido antes do processamento.
      if (eventId) {
        const { error: insertEventError } =
          await admin
            .from("hotmart_events")
            .insert({
              event_id: eventId,
              event_type: eventType,
              transaction_id: transactionId,
              subscription_id: subscriptionId,
              buyer_email: buyerEmail || null,
              buyer_name: buyerName || null,
              product_id: productId,
              product_name: productName,
              payload,
              processed: false,
            });

        if (
          insertEventError &&
          !insertEventError.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          throw new Error(
            `Erro ao registrar evento: ${insertEventError.message}`,
          );
        }
      }

      try {
        if (!buyerEmail) {
          throw new Error(
            "Webhook recebido sem e-mail do comprador.",
          );
        }

        /*
         * COMPRA APROVADA
         */
        if (eventType === "PURCHASE_APPROVED") {
          const hotmartPlanName =
            normalizePlanName(
              data?.subscription?.plan?.name,
            );

          const planConfig = PLAN_MAP[hotmartPlanName];

          if (!planConfig) {
            throw new Error(
              `Plano Hotmart não reconhecido: "${hotmartPlanName}".`,
            );
          }

          const {
            userId,
            created,
            currentAccessExpiresAt: rawExpiresAt,
          } = await getOrCreateUser(
            admin,
            buyerEmail,
            buyerName || buyerEmail,
          );

          const purchaseDate = getPurchaseDate(data);

          let currentAccessExpiresAt: Date | null = null;

          if (rawExpiresAt) {
            const parsed = new Date(rawExpiresAt);
            if (!Number.isNaN(parsed.getTime())) {
              currentAccessExpiresAt = parsed;
            }
          } else if (!created) {
            const { data: profileRow } = await admin
              .from("profiles")
              .select("access_expires_at")
              .eq("id", userId)
              .maybeSingle();

            if (profileRow?.access_expires_at) {
              const parsed = new Date(profileRow.access_expires_at);
              if (!Number.isNaN(parsed.getTime())) {
                currentAccessExpiresAt = parsed;
              }
            }
          }

          // Regra de vigência cumulativa:
          // 1. Se o usuário já possui access_expires_at futuro, o novo período é somado ao vencimento atual.
          // 2. Se for igual ou anterior à nova compra (ou se não possuir acesso prévio), conta a partir da compra.
          const baseDate =
            currentAccessExpiresAt &&
            currentAccessExpiresAt.getTime() > purchaseDate.getTime()
              ? currentAccessExpiresAt
              : purchaseDate;

          const expiresAt = addMonths(
            baseDate,
            planConfig.months,
          );

          const price =
            typeof data?.purchase?.price?.value === "number"
              ? data.purchase.price.value
              : null;

          const currency =
            typeof data?.purchase?.price?.currency_value ===
            "string"
              ? data.purchase.price.currency_value
              : "BRL";

          const paymentType =
            typeof data?.purchase?.payment?.type === "string"
              ? data.purchase.payment.type
              : null;

          const installments =
            typeof data?.purchase?.payment
              ?.installments_number === "number"
              ? data.purchase.payment.installments_number
              : null;

          // Atualiza o perfil e libera o acesso.
          const { error: profileUpdateError } =
            await admin
              .from("profiles")
              .update({
                full_name: buyerName || buyerEmail,
                email: buyerEmail,
                account_type: planConfig.accountType,
                plan: planConfig.plan,
                status: "ativo",
                access_expires_at: expiresAt.toISOString(),
              })
              .eq("id", userId);

          if (profileUpdateError) {
            throw new Error(
              `Erro ao atualizar profile: ${profileUpdateError.message}`,
            );
          }

          // Verifica se já existe uma assinatura para esta transação.
          let existingSubscription = null;

          if (transactionId) {
            const { data: subscription } =
              await admin
                .from("subscriptions")
                .select("id")
                .eq("transaction_id", transactionId)
                .maybeSingle();

            existingSubscription = subscription;
          }

          const subscriptionData = {
            user_id: userId,
            provider: "hotmart",
            transaction_id: transactionId,
            subscription_id: subscriptionId,
            product_id: productId,
            product_name: productName,
            plan: planConfig.plan,
            status: "active",
            price,
            currency,
            starts_at: purchaseDate.toISOString(),
            expires_at: expiresAt.toISOString(),
            next_charge_at: expiresAt.toISOString(),
            payment_type: paymentType,
            installments,
            buyer_email: buyerEmail,
            buyer_name: buyerName || null,
            hotmart_offer_code: offerCode,
            updated_at: new Date().toISOString(),
          };

          if (existingSubscription?.id) {
            const { error: updateSubscriptionError } =
              await admin
                .from("subscriptions")
                .update(subscriptionData)
                .eq("id", existingSubscription.id);

            if (updateSubscriptionError) {
              throw new Error(
                `Erro ao atualizar assinatura: ${updateSubscriptionError.message}`,
              );
            }
          } else {
            const { error: insertSubscriptionError } =
              await admin
                .from("subscriptions")
                .insert(subscriptionData);

            if (insertSubscriptionError) {
              throw new Error(
                `Erro ao criar assinatura: ${insertSubscriptionError.message}`,
              );
            }
          }

          // Se for um novo usuário criado pelo webhook, envia o link de primeiro acesso (recuperação de senha).
          if (created) {
            const { error: recoveryEmailError } =
              await admin.auth.resetPasswordForEmail(buyerEmail, {
                redirectTo: "https://nataliarodolfo.com.br/login",
              });

            if (recoveryEmailError) {
              throw new Error(
                `Erro ao enviar primeiro acesso: ${recoveryEmailError.message}`,
              );
            }
          }
        }

        /*
         * COMPRA CANCELADA
         *
         * O cancelamento não remove imediatamente o acesso.
         * O cliente mantém o período que já foi pago.
         */
        else if (eventType === "PURCHASE_CANCELED") {
          if (transactionId) {
            await admin
              .from("subscriptions")
              .update({
                status: "canceled",
                updated_at: new Date().toISOString(),
              })
              .eq("transaction_id", transactionId);
          }
        }

        /*
         * COMPRA ATRASADA
         *
         * Não revoga imediatamente o acesso.
         */
        else if (eventType === "PURCHASE_DELAYED") {
          if (transactionId) {
            await admin
              .from("subscriptions")
              .update({
                status: "pending",
                updated_at: new Date().toISOString(),
              })
              .eq("transaction_id", transactionId);
          }
        }

        /*
         * Outros eventos são apenas registrados.
         */

        if (eventId) {
          await admin
            .from("hotmart_events")
            .update({
              processed: true,
              processed_at: new Date().toISOString(),
              error_message: null,
            })
            .eq("event_id", eventId);
        }

        console.info(
          `Hotmart webhook processado: ${eventType}`,
        );

        return Response.json({
          ok: true,
          event: eventType,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro desconhecido";

        console.error(
          "Erro processando webhook:",
          errorMessage,
        );

        if (eventId) {
          await admin
            .from("hotmart_events")
            .update({
              processed: false,
              error_message: errorMessage,
            })
            .eq("event_id", eventId);
        }

        return Response.json(
          {
            ok: false,
            error: errorMessage,
          },
          { status: 422 },
        );
      }
    },
  ),
};
