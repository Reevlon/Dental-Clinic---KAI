import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking
  app.post("/api/book-appointment", async (req, res) => {
    const { name, phone, email, date, reason } = req.body;

    if (!name || !phone || !email || !date) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields." });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return res.status(500).json({ 
        success: false, 
        message: "Email service not configured. Please set RESEND_API_KEY in settings." 
      });
    }

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const toEmail = process.env.NOTIFICATION_EMAIL || "AgustinReevlon@gmail.com";
      
      // Send email to the clinic
      const { data, error } = await resend.emails.send({
        from: fromEmail === "onboarding@resend.dev" ? "onboarding@resend.dev" : `Premium Dental <${fromEmail}>`,
        to: [toEmail],
        subject: `New Appointment Request: ${name}`,
        html: `
          <h1>New Appointment Request</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Preferred Date:</strong> ${date}</p>
          <p><strong>Reason for Visit:</strong> ${reason || "Not specified"}</p>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        if (error.name === 'validation_error') {
           return res.status(400).json({ 
             success: false, 
             message: "Email validation failed. If using Resend's free tier, you can ONLY send emails to your registered email address. Please check your NOTIFICATION_EMAIL setting." 
           });
        }
        return res.status(500).json({ success: false, message: "Failed to send email. Check your Resend API key and domain." });
      }

      res.json({ success: true, message: "Appointment request sent successfully!", data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
  });

  // API Route for Newsletter
  app.post("/api/newsletter", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: "Email service not configured. Please set RESEND_API_KEY in settings." 
      });
    }

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const toEmail = process.env.NOTIFICATION_EMAIL || "AgustinReevlon@gmail.com";
      
      // Send notification to the clinic (Free tier cannot send to arbitrary user emails)
      const { data, error } = await resend.emails.send({
        from: fromEmail === "onboarding@resend.dev" ? "onboarding@resend.dev" : `Premium Dental <${fromEmail}>`,
        to: [toEmail],
        subject: "New Newsletter Subscriber!",
        html: `
          <h1>New Subscriber</h1>
          <p>A new user has joined the smile community newsletter.</p>
          <p><strong>Email:</strong> ${email}</p>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        if (error.name === 'validation_error') {
           return res.status(400).json({ 
             success: false, 
             message: "Email validation failed. Make sure your Resend account email matches the NOTIFICATION_EMAIL." 
           });
        }
        return res.status(500).json({ success: false, message: "Failed to process subscription." });
      }

      res.json({ success: true, message: "Subscribed successfully!", data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
