import { z } from "zod";
import { Resend } from "resend";

import { createTRPCRouter, publicProcedure } from "../create-context";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailRouter = createTRPCRouter({
  sendOrderConfirmation: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        customerName: z.string(),
        email: z.string().email(),
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
        year: 'numeric' 
      });

      const itemsList = input.items
        .map(
          (item) =>
            `- ${item.productName} (Talla: ${item.size}${
              item.color ? `, Color: ${item.color}` : ""
            }) x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`
        )
        .join("\n");

      const emailBody = `
Hola ${input.customerName},

Tu pedido ha sido confirmado.

Pedido: ${input.orderId}
Fecha: ${orderDate}

Productos:
${itemsList}

Total: ${input.total.toFixed(2)}€

Dirección de envío:
${input.address}

Tiempo estimado de entrega: 3-5 días laborables

Gracias por tu compra.
      `.trim();

      try {
        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: input.email,
          subject: `Confirmación de Pedido ${input.orderId}`,
          text: emailBody,
        });

        if (error) {
          console.error("Error sending email:", error);
          throw new Error("No se pudo enviar el correo de confirmación");
        }

        console.log("Email sent successfully:", data);
        return { success: true, messageId: data?.id };
      } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("No se pudo enviar el correo de confirmación");
      }
    }),
});
