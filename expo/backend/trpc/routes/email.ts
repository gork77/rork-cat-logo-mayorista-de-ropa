import { z } from "zod";
import { Resend } from "resend";

import { createTRPCRouter, publicProcedure } from "../create-context";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "g.coo.wat@gmail.com";

export const emailRouter = createTRPCRouter({
  sendOrderNotification: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        address: z.string(),
        items: z.array(
          z.object({
            productName: z.string(),
            quantity: z.number(),
            size: z.string(),
            color: z.string().optional(),
            price: z.number(),
          })
        ),
        total: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const orderDate = new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const itemsList = input.items
        .map(
          (item) =>
            `  • ${item.productName}\n    Talla: ${item.size}${
              item.color ? ` | Color: ${item.color}` : ""
            }\n    Cantidad: ${item.quantity} x ${item.price.toFixed(2)}€ = ${(item.price * item.quantity).toFixed(2)}€`
        )
        .join("\n\n");

      const emailBody = `
═══════════════════════════════════════════
           NUEVO PEDIDO RECIBIDO
═══════════════════════════════════════════

Pedido: ${input.orderId}
Fecha: ${orderDate}

───────────────────────────────────────────
              DATOS DEL CLIENTE
───────────────────────────────────────────

Nombre: ${input.customerName}
Email: ${input.customerEmail}
${input.customerPhone ? `Teléfono: ${input.customerPhone}` : ''}

Dirección de envío:
${input.address}

───────────────────────────────────────────
              PRODUCTOS PEDIDOS
───────────────────────────────────────────

${itemsList}

───────────────────────────────────────────
                   TOTAL
───────────────────────────────────────────

                ${input.total.toFixed(2)}€

═══════════════════════════════════════════
      `.trim();

      try {
        const { error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: ADMIN_EMAIL,
          subject: `Pedido ${input.orderId} de ${input.customerName}`,
          text: emailBody,
        });

        if (error) {
          console.error("Error sending email:", error);
          throw new Error("No se pudo enviar el correo de notificación");
        }

        console.log("Order notification email sent to admin successfully");
        return { success: true };
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("No se pudo enviar el correo de notificación");
      }
    }),
});
