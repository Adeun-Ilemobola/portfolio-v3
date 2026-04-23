import { Resend } from 'resend';

const resend = new Resend(process.env.ReSEND_API_KEY);

resend.apiKeys.create({ name: 'Production' });
type NewContact = {
  email: string;
  name: string;
  company: string;

  text: string;
};

type SendCodeProps = {
  code: string;
};

type EmailMap = {
  contact: NewContact;
  sendCode: SendCodeProps;
};

 function createNewContactEmailHtml(payload: NewContact): string {
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact</title>
    </head>
    <body style="margin:0;padding:0;background:#081120;background-image:radial-gradient(circle at top, rgba(88,199,255,0.10), transparent 30%),radial-gradient(circle at 80% 20%, rgba(122,108,255,0.10), transparent 25%),linear-gradient(to bottom, #081120, #060d1a 55%, #040914);font-family:Inter,Arial,Helvetica,sans-serif;color:#DCE9F8;">
      <div style="width:100%;padding:40px 16px;">
        <div style="max-width:640px;margin:0 auto;border-radius:24px;overflow:hidden;background:#101B2F;border:1px solid rgba(255,255,255,0.10);box-shadow:0 18px 60px rgba(0,0,0,0.35);">
          <div style="padding:32px 28px 20px 28px;background:linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02));">
            <div style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:rgba(67,230,195,0.12);border:1px solid rgba(93,235,208,0.18);color:#B8FFF0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">
              New Contact
            </div>

            <h1 style="margin:0 0 8px 0;font-size:28px;line-height:1.2;color:#E6F2FF;font-weight:700;">
              New contact submission
            </h1>

            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#8FA5C7;">
              A new message was submitted from your portfolio contact flow.
            </p>

            <div style="height:1px;background:linear-gradient(to right, rgba(93,235,208,0.30), rgba(255,255,255,0.08), transparent);margin-bottom:24px;"></div>

            <div style="margin-bottom:14px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8FA5C7;margin-bottom:6px;">Name</div>
              <div style="font-size:15px;line-height:1.6;color:#E6F2FF;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 14px;">
                ${escape(payload.name)}
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8FA5C7;margin-bottom:6px;">Email</div>
              <div style="font-size:15px;line-height:1.6;color:#E6F2FF;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 14px;">
                ${escape(payload.email)}
              </div>
            </div>

            ${
              payload.company?.trim()
                ? `
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8FA5C7;margin-bottom:6px;">Company</div>
              <div style="font-size:15px;line-height:1.6;color:#E6F2FF;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 14px;">
                ${escape(payload.company)}
              </div>
            </div>
            `
                : ""
            }

           

            <div style="margin-top:18px;">
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8FA5C7;margin-bottom:6px;">Message</div>
              <div style="font-size:15px;line-height:1.8;color:#E6F2FF;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;white-space:pre-wrap;">
                ${escape(payload.text)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}

 function createSendCodeEmailHtml(payload: SendCodeProps): string {
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login Code</title>
    </head>
    <body style="margin:0;padding:0;background:#081120;background-image:radial-gradient(circle at top, rgba(88,199,255,0.10), transparent 30%),radial-gradient(circle at 80% 20%, rgba(122,108,255,0.10), transparent 25%),linear-gradient(to bottom, #081120, #060d1a 55%, #040914);font-family:Inter,Arial,Helvetica,sans-serif;color:#DCE9F8;">
      <div style="width:100%;padding:40px 16px;">
        <div style="max-width:640px;margin:0 auto;border-radius:24px;overflow:hidden;background:#101B2F;border:1px solid rgba(255,255,255,0.10);box-shadow:0 18px 60px rgba(0,0,0,0.35);">
          <div style="padding:32px 28px 20px 28px;background:linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02));">
            <div style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:rgba(67,230,195,0.12);border:1px solid rgba(93,235,208,0.18);color:#B8FFF0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">
              Admin Access
            </div>

            <h1 style="margin:0 0 8px 0;font-size:28px;line-height:1.2;color:#E6F2FF;font-weight:700;">
              Your login code
            </h1>

            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#8FA5C7;">
              Enter this code in your login popup to create your session.
            </p>

            <div style="height:1px;background:linear-gradient(to right, rgba(93,235,208,0.30), rgba(255,255,255,0.08), transparent);margin-bottom:24px;"></div>

            <div style="margin-bottom:18px;font-size:15px;line-height:1.8;color:#DCE9F8;">
              Use the verification code below to continue signing in.
            </div>

            <div style="margin:24px 0;padding:18px 20px;border-radius:18px;background:linear-gradient(to bottom, rgba(67,230,195,0.10), rgba(255,255,255,0.03));border:1px solid rgba(93,235,208,0.18);text-align:center;">
              <div style="font-size:12px;letter-spacing:0.20em;text-transform:uppercase;color:#8FA5C7;margin-bottom:10px;">
                Verification Code
              </div>

              <div style="font-size:34px;line-height:1;font-weight:800;letter-spacing:0.22em;color:#43E6C3;font-family:'JetBrains Mono','SFMono-Regular',Consolas,monospace;">
                ${escape(payload.code)}
              </div>
            </div>

            <div style="font-size:14px;line-height:1.7;color:#8FA5C7;">
              If you did not request this code, you can safely ignore this email.
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}



 const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: "Admin <no-reply@send.adeunilemobola.dev>"!,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


export async function emailSwitcher<T extends keyof EmailMap>( type: T, payload: EmailMap[T]): Promise<boolean> {
    switch (type) {
        case 'contact':
            return await sendEmail(process.env.RE_SEND_FROM_EMAIL!, "New contact submission", createNewContactEmailHtml(payload as EmailMap['contact']));
        case 'sendCode':
            return await sendEmail(process.env.RE_SEND_FROM_EMAIL!, "Your login code", createSendCodeEmailHtml(payload as EmailMap['sendCode']));
        default:
            throw new Error(`Unsupported email type: ${type}`);
    }
                
}
