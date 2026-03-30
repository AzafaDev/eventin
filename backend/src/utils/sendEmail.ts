import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export const sendEmail = {
  verification: async (userEmail: string, fullName: string, token: string) => {
    try {
      await resend.emails.send({
        from: "EventIn <noreply@azafadev.web.id>", // Gunakan domain yang terverifikasi di Resend nanti
        to: [userEmail],
        subject: "Verify Your EventIn Account",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f4f4f4; }
            .logo { font-size: 24px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 2px; }
            .content { padding: 30px 20px; text-align: center; }
            .otp-container { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px dashed #007bff; }
            .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
            .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
            .button { background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">EventIn</div>
            </div>
            <div class="content">
              <h2>Hi, ${fullName}! 👋</h2>
              <p>Terima kasih sudah bergabung di <strong>EventIn</strong>. Langkah terakhir sebelum kamu bisa eksplor event seru adalah memverifikasi emailmu.</p>
              <p>Masukkan kode verifikasi di bawah ini pada halaman aktivasi:</p>
              
              <div class="otp-container">
                <div class="otp-code">${token}</div>
              </div>
              
              <p style="font-size: 14px; color: #666;">Kode ini hanya berlaku selama 1 jam. Jangan bagikan kode ini kepada siapapun.</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 EventIn Platform. All rights reserved.<br>Tangerang, Indonesia</p>
            </div>
          </div>
        </body>
        </html>
        `,
      });
    } catch (error: any) {
      console.error("Email Error:", error.message);
      throw new Error("Failed to send verification email");
    }
  },
  verificationSuccess: async (userEmail: string, fullName: string) => {
    try {
      await resend.emails.send({
        from: "EventIn <noreply@azafadev.web.id>",
        to: [userEmail],
        subject: "Verify Your EventIn Account",
        html: `
        <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Berhasil</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .header { background-color: #ea580c; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 30px; text-align: center; color: #334155; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
          h1 { color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
          p { line-height: 1.6; margin-bottom: 20px; }
          .button { display: inline-block; padding: 14px 30px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; margin-top: 20px; }
          .success-icon { font-size: 50px; margin-bottom: 20px; }
          .highlight { color: #ea580c; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verifikasi Berhasil!</h1>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <p>Halo <strong>${fullName}</strong>,</p>
            <p>Selamat! Akun Anda telah berhasil diverifikasi. Sekarang Anda memiliki akses penuh untuk menjelajahi dan mendaftar di berbagai event menarik di platform kami.</p>
            
            <p>Jangan lupa, jika Anda mendaftar menggunakan kode referral, Anda memiliki <span class="highlight">Kupon Diskon 10%</span> yang berlaku selama 3 bulan ke depan!</p>
            
            <a href="${process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.FRONT_END_URL}/login" class="button">Mulai Jelajahi Event</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 Event Management Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
      });
    } catch (error: any) {
      console.error("Email Error:", error.message);
      throw new Error("Failed to send verification email");
    }
  },
  resetPassword: async (userEmail: string, fullName: string, token: string) => {
    const resetLink =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.FRONT_END_URL;
    try {
      await resend.emails.send({
        from: "EventIn <noreply@azafadev.web.id>",
        to: [userEmail],
        subject: "Verify Your EventIn Account",
        html: `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Eventin</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #334155; border-radius: 16px; overflow: hidden; margin-top: 40px; border: 1px solid #e2e8f0; }
        .header { background-color: #ffffff; padding: 40px 0 20px 0; text-align: center; }
        .content { padding: 0 40px 40px 40px; text-align: center; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        .logo { font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -1px; }
        .logo span { color: #ea580c; }
        h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
        p { font-size: 16px; line-height: 1.6; color: #64748b; margin-bottom: 24px; }
        .btn { display: inline-block; padding: 16px 32px; background-color: #ea580c; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2); transition: background-color 0.2s; }
        .expiry-note { margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #94a3b8; }
        .social-link { color: #ea580c; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <div class="logo">EVENT<span>IN</span></div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h1>Reset Password Anda?</h1>
                    <p>Halo <strong>${fullName}</strong>,</p>
                    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Eventin Anda. Jangan khawatir, klik tombol di bawah ini untuk membuat password baru:</p>
                    
                    <a href="${resetLink}/reset-password/${token}" class="btn">Atur Ulang Password</a>
                    
                    <p class="expiry-note">
                        Link ini hanya berlaku selama <strong>1 jam</strong>.<br>
                        Jika Anda tidak merasa meminta reset password, silakan abaikan email ini dengan aman.
                    </p>
                </td>
            </tr>
        </table>
        <div class="footer">
            <p>&copy; 2026 Eventin Platform. Parung Panjang, Indonesia.<br>
            Temukan event seru lainnya di <a href="https://eventin.com" class="social-link">Eventin.com</a></p>
        </div>
    </div>
</body>
</html>
  `,
      });
    } catch (error: any) {
      console.error("Email Error:", error.message);
      throw new Error("Failed to send verification email");
    }
  },
};
