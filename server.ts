import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Load Firebase config
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
let db: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/book", async (req, res) => {
    const { name, phone, email, date, reason } = req.body;
    
    // Basic server-side validation
    if (!name || !phone || !email || !date || !reason) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (!db) {
      return res.status(500).json({ success: false, message: "Database not configured." });
    }

    try {
      const bookingData = {
        name,
        phone,
        email,
        date,
        reason,
        status: "pending",
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("New booking saved to Firestore with ID:", docRef.id);

      // Send Email Confirmation
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          // Patient Confirmation
          await transporter.sendMail({
            from: process.env.FROM_EMAIL || '"Premium Dental" <no-reply@premiumdental.com>',
            to: email,
            subject: "Your Appointment Request at Premium Dental",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #db2777;">Appointment Request Received</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for choosing Premium Dental. We have received your appointment request for <strong>${date}</strong>.</p>
                <p><strong>Details:</strong></p>
                <ul>
                  <li><strong>Reason:</strong> ${reason}</li>
                  <li><strong>Phone:</strong> ${phone}</li>
                </ul>
                <p>Our scheduling coordinator will contact you shortly to confirm your exact time.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">123 Smile Avenue, Beverly Hills, CA 90210 | (555) 019-8372</p>
              </div>
            `,
          });

          // Clinic Notification
          if (process.env.CLINIC_EMAIL) {
            await transporter.sendMail({
              from: '"Booking System" <no-reply@premiumdental.com>',
              to: process.env.CLINIC_EMAIL,
              subject: `New Booking Request: ${name}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h2>New Appointment Request</h2>
                  <p><strong>Patient:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Date:</strong> ${date}</p>
                  <p><strong>Reason:</strong> ${reason}</p>
                  <p><strong>Booking ID:</strong> ${docRef.id}</p>
                </div>
              `,
            });
          }
          console.log("Confirmation emails sent successfully.");
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // We don't fail the whole request if email fails, but we log it
        }
      } else {
        console.warn("SMTP not configured. Skipping email confirmation.");
      }

      // Send success response
      res.json({ 
        success: true, 
        message: "Booking confirmed! We will contact you shortly.",
        bookingId: docRef.id
      });
    } catch (error) {
      console.error("Error saving booking to Firestore:", error);
      res.status(500).json({ success: false, message: "Failed to save booking. Please try again later." });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!db) {
      return res.status(500).json({ success: false, message: "Database not configured." });
    }

    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        createdAt: serverTimestamp()
      });
      res.json({ success: true, message: "Thank you for subscribing!" });
    } catch (error) {
      console.error("Error saving newsletter signup:", error);
      res.status(500).json({ success: false, message: "Failed to subscribe. Please try again later." });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
