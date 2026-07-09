type EmailItem = {
  title: string;
  price: number;
  image: string;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  currency: string;
  items: EmailItem[];
};

type OrderStatusEmailData = {
  orderNumber: string;
  customerName: string;
  status: "order_confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  note?: string;
  trackUrl?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getCurrencySymbol(currency: string) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "TRY":
      return "₺";
    default:
      return currency ? `${currency} ` : "";
  }
}

function formatMoney(amount: number, currency: string) {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusLabel(status: OrderStatusEmailData["status"]) {
  switch (status) {
    case "order_confirmed":
      return "Order Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusMessage(status: OrderStatusEmailData["status"]) {
  switch (status) {
    case "order_confirmed":
      return "Your order has been received successfully and is now being prepared with care.";
    case "processing":
      return "Your order is now being prepared.";
    case "shipped":
      return "Your order has been shipped and is on its way.";
    case "delivered":
      return "Your order has been delivered.";
    case "cancelled":
      return "Your order has been cancelled. If you need help, please reply to this email.";
    default:
      return "Your order status has been updated.";
  }
}

function getItemsHtml(items: EmailItem[], currency: string) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #ece7dc; width: 88px; vertical-align: top;">
            <img
              src="${escapeHtml(item.image)}"
              alt="${escapeHtml(item.title)}"
              width="72"
              height="72"
              style="display: block; width: 72px; height: 72px; object-fit: cover; border-radius: 10px; border: 1px solid #e8dfd2;"
            />
          </td>

          <td style="padding: 16px 0 16px 16px; border-bottom: 1px solid #ece7dc; vertical-align: top;">
            <div style="font-size: 16px; line-height: 1.5; color: #2a2a2a; font-weight: 600;">
              ${escapeHtml(item.title)}
            </div>
          </td>

          <td style="padding: 16px 0 16px 16px; border-bottom: 1px solid #ece7dc; text-align: right; vertical-align: top; white-space: nowrap;">
            <div style="font-size: 16px; line-height: 1.5; color: #2a2a2a; font-weight: 700;">
              ${formatMoney(item.price, currency)}
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function getButtonHtml(label: string, href: string) {
  return `
    <div style="margin: 24px 0 0;">
      <a
        href="${escapeHtml(href)}"
        style="
          display: inline-block;
          background: #7a1f1f;
          color: #ffffff;
          text-decoration: none;
          padding: 13px 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
        "
      >
        ${escapeHtml(label)}
      </a>
    </div>
  `;
}

function getBaseLayout(title: string, subtitle: string, content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f2e8; font-family: Arial, Helvetica, sans-serif; color: #2a2a2a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f2e8; margin: 0; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="max-width: 680px; background-color: #fffdf8; border: 1px solid #eadfce; border-radius: 22px; overflow: hidden; box-shadow: 0 10px 30px rgba(60, 34, 18, 0.08);"
              >
                <tr>
                  <td style="background: linear-gradient(135deg, #5b0f0f 0%, #7b1616 100%); padding: 32px 36px;">
                    <div style="font-size: 13px; letter-spacing: 1.8px; text-transform: uppercase; color: #f6e7d3; font-weight: 700;">
                      Keramet
                    </div>
                    <div style="margin-top: 10px; font-size: 32px; line-height: 1.2; color: #ffffff; font-weight: 700;">
                      ${escapeHtml(title)}
                    </div>
                    <div style="margin-top: 8px; font-size: 15px; line-height: 1.6; color: #f3ddd0;">
                      ${escapeHtml(subtitle)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 36px;">
                    ${content}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 36px 36px;">
                    <div style="padding-top: 18px; border-top: 1px solid #ece7dc; font-size: 13px; line-height: 1.7; color: #6b6258;">
                      Keramet<br />
                      Handmade carpets with timeless character.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function getAdminEmailHtml(data: OrderEmailData) {
  const content = `
    <div style="font-size: 16px; line-height: 1.8; color: #2a2a2a;">
      <p style="margin: 0 0 18px;">A new order has been placed on your store.</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px; background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 16px;">
      <tr>
        <td style="padding: 22px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 10px; font-size: 14px; color: #7b6f62;">Order Number</td>
              <td style="padding: 0 0 10px; font-size: 16px; color: #2a2a2a; font-weight: 700; text-align: right;">#${escapeHtml(data.orderNumber)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 14px; color: #7b6f62;">Customer</td>
              <td style="padding: 10px 0; font-size: 16px; color: #2a2a2a; font-weight: 600; text-align: right;">${escapeHtml(data.customerName)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 14px; color: #7b6f62;">Email</td>
              <td style="padding: 10px 0; font-size: 16px; color: #2a2a2a; text-align: right;">${escapeHtml(data.email)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 14px; color: #7b6f62;">Phone</td>
              <td style="padding: 10px 0; font-size: 16px; color: #2a2a2a; text-align: right;">${escapeHtml(data.phone)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="font-size: 22px; line-height: 1.3; color: #2a2a2a; font-weight: 700; margin: 0 0 16px;">
      Order Items
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      ${getItemsHtml(data.items, data.currency)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 16px;">
      <tr>
        <td style="padding: 20px 24px; font-size: 16px; color: #2a2a2a;">
          <span style="font-weight: 600;">Order Total</span>
          <span style="float: right; font-weight: 800; font-size: 22px; color: #5b0f0f;">
            ${formatMoney(data.total, data.currency)}
          </span>
        </td>
      </tr>
    </table>
  `;

  return getBaseLayout(
    "New Order Received",
    "A new customer order has been placed.",
    content
  );
}

export function getCustomerEmailHtml(data: OrderEmailData) {
  const trackUrl = "https://kerametrugs.com/track-order";

  const content = `
    <div style="font-size: 16px; line-height: 1.8; color: #2a2a2a;">
      <p style="margin: 0 0 14px;">Hi ${escapeHtml(data.customerName)},</p>
      <p style="margin: 0 0 18px;">
        Your order has been received and is now being prepared with care. Each piece at Keramet is selected and handled individually, and we’ll keep you updated as it moves forward.
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px; background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 16px;">
      <tr>
        <td style="padding: 22px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 10px; font-size: 14px; color: #7b6f62;">Order Number</td>
              <td style="padding: 0 0 10px; font-size: 16px; color: #2a2a2a; font-weight: 700; text-align: right;">#${escapeHtml(data.orderNumber)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 0; font-size: 14px; color: #7b6f62;">Contact Email</td>
              <td style="padding: 10px 0 0; font-size: 16px; color: #2a2a2a; text-align: right;">${escapeHtml(data.email)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${getButtonHtml("Track Your Order", trackUrl)}

    <div style="font-size: 22px; line-height: 1.3; color: #2a2a2a; font-weight: 700; margin: 28px 0 16px;">
      Your Items
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      ${getItemsHtml(data.items, data.currency)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 16px;">
      <tr>
        <td style="padding: 20px 24px; font-size: 16px; color: #2a2a2a;">
          <span style="font-weight: 600;">Total</span>
          <span style="float: right; font-weight: 800; font-size: 22px; color: #5b0f0f;">
            ${formatMoney(data.total, data.currency)}
          </span>
        </td>
      </tr>
    </table>

    <div style="margin-top: 24px; font-size: 15px; line-height: 1.8; color: #6b6258;">
      We’ll notify you again as your order moves through processing, shipping, and delivery.
    </div>
  `;

  return getBaseLayout(
    "Order Confirmed",
    "Your Keramet order is being prepared",
    content
  );
}

export function getOrderStatusEmailHtml(data: OrderStatusEmailData) {
  const statusLabel = getStatusLabel(data.status);
  const message = getStatusMessage(data.status);
  const trackUrl = data.trackUrl || "https://kerametrugs.com/track-order";

  const noteHtml = data.note
    ? `
      <div style="margin-top: 18px; padding: 16px 18px; background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 14px;">
        <div style="font-size: 13px; line-height: 1.6; color: #7b6f62; text-transform: uppercase; letter-spacing: 1.3px; font-weight: 700;">
          Update Note
        </div>
        <div style="margin-top: 8px; font-size: 15px; line-height: 1.8; color: #2a2a2a;">
          ${escapeHtml(data.note)}
        </div>
      </div>
    `
    : "";

  const content = `
    <div style="font-size: 16px; line-height: 1.8; color: #2a2a2a;">
      <p style="margin: 0 0 14px;">Hi ${escapeHtml(data.customerName)},</p>
      <p style="margin: 0 0 18px;">${escapeHtml(message)}</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px; background-color: #fbf7ef; border: 1px solid #ece2d4; border-radius: 16px;">
      <tr>
        <td style="padding: 22px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 0 10px; font-size: 14px; color: #7b6f62;">Order Number</td>
              <td style="padding: 0 0 10px; font-size: 16px; color: #2a2a2a; font-weight: 700; text-align: right;">#${escapeHtml(data.orderNumber)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0 0; font-size: 14px; color: #7b6f62;">Current Status</td>
              <td style="padding: 10px 0 0; font-size: 16px; color: #5b0f0f; font-weight: 700; text-align: right;">${escapeHtml(statusLabel)}</td>
            </tr>
          </table>
          ${noteHtml}
        </td>
      </tr>
    </table>

    ${getButtonHtml("Track Your Order", trackUrl)}

    <div style="margin-top: 24px; font-size: 15px; line-height: 1.8; color: #6b6258;">
      You can use the button above to view the latest order progress anytime.
    </div>
  `;

  return getBaseLayout(
    `Order Update: ${statusLabel}`,
    "Your Keramet order status has been updated",
    content
  );
}
