import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Risjas Updates <updates@risjas.com>";
const REPLY_TO = "risjas26@gmail.com";

export type EmailResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export interface OrderEmailItem {
  productName: string;
  quantity: number;
  price?: number | string;
  total?: number | string;
}

export interface OrderEmailDetails {
  customerName?: string;
  items: OrderEmailItem[];
  total?: number | string;
  paymentMethod?: string;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value: unknown) {
  return `Rs. ${Number(value || 0).toFixed(0)}`;
}

function emailLayout(title: string, content: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f8fb;font-family:Arial,sans-serif;color:#172b4d"><div style="max-width:600px;margin:0 auto;padding:24px 14px"><div style="background:#172b4d;border-radius:16px 16px 0 0;padding:24px;text-align:center;color:#fff"><h1 style="margin:0;font-size:24px">RISJAS</h1><p style="margin:7px 0 0;color:#f4b6bd;font-size:12px;letter-spacing:2px">${escapeHtml(title)}</p></div><div style="background:#fff;border:1px solid #e5e9f0;border-top:0;border-radius:0 0 16px 16px;padding:28px 24px">${content}<p style="margin:28px 0 0;color:#718096;font-size:12px">Thanks for shopping with Risjas.</p></div></div></body></html>`;
}

async function sendEmail(subject: string, to: string, html: string): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject,
      html,
      replyTo: REPLY_TO
    });

    if (error) {
      console.error("[email] Resend error", error);
      return { success: false, error: error.message || "Email provider rejected the message" };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("[email] Unexpected send error", error);
    return { success: false, error: error instanceof Error ? error.message : "Unable to send email" };
  }
}

export async function sendOtpEmail(to: string, otp: string): Promise<EmailResult> {
  const html = emailLayout(
    "SECURITY VERIFICATION",
    `<h2 style="margin:0 0 12px;color:#172b4d">Verify your email</h2><p style="color:#526581">Use this one-time password to continue your Risjas account verification:</p><div style="margin:24px 0;padding:18px;border-radius:12px;background:#fdf0f1;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#172b4d">${escapeHtml(otp)}</div><p style="color:#718096;font-size:13px">This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p>`
  );
  return sendEmail("Your Risjas verification code", to, html);
}

export async function sendOrderConfirmationEmail(to: string, orderId: string, orderDetails: OrderEmailDetails): Promise<EmailResult> {
  const rows = orderDetails.items.map((item) => `<tr><td style="padding:10px 0;border-bottom:1px solid #edf0f4">${escapeHtml(item.productName)}<br><span style="color:#718096;font-size:12px">Qty: ${escapeHtml(item.quantity)}</span></td><td style="padding:10px 0;border-bottom:1px solid #edf0f4;text-align:right">${money(item.total ?? Number(item.price || 0) * item.quantity)}</td></tr>`).join("");
  const html = emailLayout(
    "ORDER CONFIRMATION",
    `<h2 style="margin:0 0 8px;color:#172b4d">Thanks for your order${orderDetails.customerName ? `, ${escapeHtml(orderDetails.customerName)}` : ""}!</h2><p style="color:#526581">Your order <strong>${escapeHtml(orderId)}</strong> has been placed successfully.</p><table style="width:100%;border-collapse:collapse;margin-top:20px"><tbody>${rows}</tbody><tfoot><tr><td style="padding-top:16px;font-weight:700">Order total</td><td style="padding-top:16px;text-align:right;font-weight:700">${money(orderDetails.total)}</td></tr></tfoot></table>${orderDetails.paymentMethod ? `<p style="margin-top:18px;color:#718096;font-size:13px">Payment method: ${escapeHtml(orderDetails.paymentMethod)}</p>` : ""}`
  );
  return sendEmail(`Order confirmation · ${orderId}`, to, html);
}

export async function sendOrderStatusUpdateEmail(to: string, orderId: string, newStatus: string): Promise<EmailResult> {
  const status = newStatus.replaceAll("_", " ").toLowerCase().replace(/^./, (letter) => letter.toUpperCase());
  const html = emailLayout(
    "ORDER STATUS UPDATE",
    `<h2 style="margin:0 0 12px;color:#172b4d">Your order status changed</h2><p style="color:#526581">Order <strong>${escapeHtml(orderId)}</strong> is now:</p><div style="margin:22px 0;padding:16px;border-radius:12px;background:#edf4ff;text-align:center;font-size:20px;font-weight:700;color:#172b4d">${escapeHtml(status)}</div><p style="color:#718096;font-size:13px">You can view your latest order details from your Risjas profile.</p>`
  );
  return sendEmail(`${status} · ${orderId}`, to, html);
}
