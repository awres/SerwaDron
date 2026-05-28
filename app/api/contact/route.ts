import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Wszystkie pola są wymagane" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy adres email" },
        { status: 400 },
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "SerwaDron <onboarding@resend.dev>",
      to: ["filserw@gmail.com"],
      replyTo: email,
      subject: `[SerwaDron] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Nowa wiadomość z formularza kontaktowego
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Imię:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>Temat:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #334155;">Wiadomość:</h3>
            <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Ta wiadomość została wysłana z formularza kontaktowego na stronie SerwaDron.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Wystąpił błąd podczas wysyłania wiadomości" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Wiadomość została wysłana" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 },
    );
  }
}
