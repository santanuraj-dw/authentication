import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  console.log("user email", email)
  console.log("my email", process.env.EMAIL_USER)
  console.log("my password", process.env.EMAIL_PASS)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
  });

  // console.log(transporter)

 await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Account",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
        
        <h2 style="color: #333;">Verify Your Email</h2>
        
        <p style="color: #555; font-size: 14px;">
          Thank you for registering. Please use the OTP below to verify your email address.
        </p>

        <div style="margin: 20px 0;">
          <span style="display: inline-block; padding: 12px 24px; font-size: 22px; letter-spacing: 4px; background: #f0f0f0; border-radius: 6px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="color: #777; font-size: 13px;">
          This OTP is valid for 5 minutes. Do not share it with anyone.
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="color: #999; font-size: 12px;">
          If you did not request this, please ignore this email.
        </p>

      </div>
    </div>
  `,
  });

  // console.log(res)
};
