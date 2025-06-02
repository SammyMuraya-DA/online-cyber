
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  orderId: string;
  customerPhone: string;
  services: string[];
  total: number;
  transactionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerPhone, services, total, transactionId }: OrderEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Connex Cyber Services <onboarding@resend.dev>",
      to: ["sammraya98@gmail.com"],
      subject: `New Order Received - #${orderId}`,
      html: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer Phone:</strong> ${customerPhone}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Services:</strong></p>
        <ul>
          ${services.map(service => `<li>${service}</li>`).join('')}
        </ul>
        <p><strong>Total Amount:</strong> KSh ${total.toLocaleString()}</p>
        <p><strong>Status:</strong> Payment Received</p>
        <hr>
        <p>Please log in to the admin dashboard to manage this order.</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
