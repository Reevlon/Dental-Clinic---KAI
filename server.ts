import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { Resend } from "resend";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending notifications
  app.post("/api/notify-booking", async (req, res) => {
    const { name, phone, email, date, reason } = req.body;
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    let recipientId = process.env.FB_RECIPIENT_ID;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    const message = `New Booking Request:
Name: ${name}
Phone: ${phone}
Email: ${email}
Preferred Date: ${date}
Reason: ${reason}`;

    let fbSuccess = false;
    let emailSuccess = false;

    // 1. Try Facebook Notification
    if (accessToken && recipientId) {
      const sendFbMessage = async (id: string) => {
        return axios.post(
          `https://graph.facebook.com/v19.0/me/messages?access_token=${accessToken}`,
          {
            recipient: { id },
            message: { text: message },
            messaging_type: "MESSAGE_TAG",
            tag: "CONFIRMED_EVENT_UPDATE"
          }
        );
      };

      try {
        let cleanId = recipientId.trim();
        const configPageId = process.env.FB_PAGE_ID?.trim();

        if (cleanId === configPageId) {
          console.warn(`CONFIG WARNING: Your FB_RECIPIENT_ID is the same as your FB_PAGE_ID (${cleanId}). Switching to AUTO detection...`);
          cleanId = "AUTO";
        }

        // Feature: Auto-detect if ID looks like a Global ID (starts with 1000 and is 15 digits or less)
        if (cleanId.startsWith("1000") && cleanId.length <= 15) {
          console.warn(`CONFIG WARNING: Your FB_RECIPIENT_ID (${cleanId}) looks like a Global ID. Switching to AUTO detection to find your PSID...`);
          cleanId = "AUTO";
        }
        
        // Feature: Auto-detect PSID if set to "AUTO"
        if (cleanId === "AUTO") {
          console.log("Attempting to auto-detect latest conversation...");
          const convosResponse = await axios.get(
            `https://graph.facebook.com/v19.0/me/conversations?fields=participants,updated_time&access_token=${accessToken}`
          );
          
          const conversations = convosResponse.data.data || [];
          const lastConversation = conversations[0];

          if (lastConversation && lastConversation.participants?.data) {
            const pageInfo = await axios.get(`https://graph.facebook.com/v19.0/me?fields=id&access_token=${accessToken}`);
            const pageId = pageInfo.data.id;
            
            const participant = lastConversation.participants.data.find((p: any) => p.id !== pageId);
            
            if (participant) {
              recipientId = participant.id;
              console.log(`Auto-detected PSID: ${recipientId}`);
            }
          }

          if (recipientId.trim() === "AUTO") {
            throw new Error("No recent conversations found. YOU MUST send a message to your Page from your personal account first so the system can find your ID.");
          }
        }

        await sendFbMessage(recipientId.trim());
        fbSuccess = true;
      } catch (error: any) {
        const fbError = error.response?.data?.error || { message: error.message };
        
        // Fallback: If the provided ID fails (code 100 or subcode 2018001), try to auto-detect the latest PSID
        const isInvalidIdError = fbError?.code === 100 || fbError?.error_subcode === 2018001;
        
        if (isInvalidIdError && recipientId.trim() !== "AUTO") {
          console.warn(`Provided FB_RECIPIENT_ID (${recipientId}) failed with '${fbError.message}'. This ID is likely NOT a Page-Scoped ID (PSID). Attempting auto-detection fallback...`);
          try {
            const convosResponse = await axios.get(
              `https://graph.facebook.com/v19.0/me/conversations?fields=participants,updated_time&access_token=${accessToken}`
            );
            
            // Sort by updated_time to get the absolute latest
            const conversations = convosResponse.data.data || [];
            const lastConversation = conversations[0];

            if (lastConversation && lastConversation.participants?.data) {
              // Find the participant that is NOT the page itself
              const pageInfo = await axios.get(`https://graph.facebook.com/v19.0/me?fields=id&access_token=${accessToken}`);
              const pageId = pageInfo.data.id;
              
              const participant = lastConversation.participants.data.find((p: any) => p.id !== pageId);
              
              if (participant) {
                const detectedId = participant.id;
                console.log(`Fallback detected PSID: ${detectedId} (from latest conversation). Retrying notification...`);
                await sendFbMessage(detectedId);
                recipientId = detectedId; // Update for response
                fbSuccess = true;
                console.log("Fallback notification successful! Please update your FB_RECIPIENT_ID in Settings to this detected ID.");
              }
            }

            if (!fbSuccess) {
              console.error("Fallback failed: No recent conversations found on this Page. YOU MUST send a message to your Page from your personal account first so the system can find your ID.");
            }
          } catch (fallbackError: any) {
            console.error("Fallback auto-detection also failed:", fallbackError.response?.data || fallbackError.message);
          }
        }

        if (!fbSuccess) {
          if (fbError?.error_subcode === 460) {
            console.error("CRITICAL: Your Facebook Page Access Token has been invalidated (User changed password or session expired). YOU MUST generate a new token in Facebook Developers and update FB_PAGE_ACCESS_TOKEN in Settings.");
          } else {
            console.error("Facebook Notification Final Failure:", fbError);
          }
        }
      }
    }

    // 2. Try Email Notification
    if (resend && notificationEmail) {
      try {
        await resend.emails.send({
          from: "K.A.I Dental Clinic <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New Booking: ${name}`,
          text: message,
        });
        emailSuccess = true;
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    }

    if (fbSuccess || emailSuccess) {
      res.status(200).json({ 
        success: true, 
        fb: fbSuccess ? "sent" : "failed", 
        email: emailSuccess ? "sent" : "failed",
        detectedPsid: recipientId !== process.env.FB_RECIPIENT_ID ? recipientId : undefined
      });
    } else {
      res.status(500).json({ error: "All notification methods failed" });
    }
  });

  // Debug endpoint to verify Facebook Token
  app.get("/api/fb-debug", async (req, res) => {
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    const configPageId = process.env.FB_PAGE_ID?.trim();
    const configRecipientId = process.env.FB_RECIPIENT_ID?.trim();
    
    if (!accessToken) return res.status(400).json({ error: "FB_PAGE_ACCESS_TOKEN is not set" });
    
    try {
      const pageInfo = await axios.get(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${accessToken}`);
      const actualPageId = pageInfo.data.id;
      const convos = await axios.get(`https://graph.facebook.com/v19.0/me/conversations?fields=participants,updated_time&access_token=${accessToken}`);
      
      const issues = [];
      if (configPageId && configPageId !== actualPageId) {
        issues.push(`MISMATCH: Your FB_PAGE_ID in Settings (${configPageId}) does not match the Page ID associated with your Token (${actualPageId}).`);
      }
      if (configRecipientId === actualPageId) {
        issues.push(`ERROR: Your FB_RECIPIENT_ID is set to the Page ID (${actualPageId}). The system will now automatically try to find your PSID, but you should update your Settings to 'AUTO' or your real PSID.`);
      }
      if (configRecipientId === configPageId && configPageId) {
        issues.push(`ERROR: FB_RECIPIENT_ID and FB_PAGE_ID are identical. The system will treat this as 'AUTO' and try to find your PSID.`);
      }
      if (configRecipientId && configRecipientId.startsWith("1000") && configRecipientId.length <= 15) {
        issues.push(`WARNING: Your FB_RECIPIENT_ID (${configRecipientId}) looks like a Global Facebook ID. Facebook Messenger requires a Page-Scoped ID (PSID). Please set your FB_RECIPIENT_ID to 'AUTO' in Settings.`);
      }

      const conversations = convos.data.data || [];
      let suggestedPsid = null;
      if (conversations.length > 0 && conversations[0].participants?.data) {
        const latestParticipant = conversations[0].participants.data.find((p: any) => p.id !== actualPageId);
        if (latestParticipant) {
          suggestedPsid = latestParticipant.id;
        }
      }

      res.json({
        status: issues.length > 0 ? "warning" : "success",
        issues: issues.length > 0 ? issues : "None detected",
        suggestedPsid: suggestedPsid,
        configuredPageId: configPageId,
        actualPageId: actualPageId,
        configuredRecipientId: configRecipientId,
        pageName: pageInfo.data.name,
        recentConversations: conversations.map((c: any) => ({
          id: c.id,
          updated_time: c.updated_time,
          participants: c.participants.data
        }))
      });
    } catch (error: any) {
      const fbError = error.response?.data?.error;
      if (fbError?.error_subcode === 460) {
        return res.status(401).json({ 
          status: "error",
          error: "TOKEN_INVALIDATED",
          message: "Your Facebook Page Access Token has been invalidated (User changed password or session expired).",
          instruction: "Please generate a new Page Access Token in the Facebook Developers portal and update FB_PAGE_ACCESS_TOKEN in your Settings."
        });
      }
      res.status(500).json({ error: error.response?.data || error.message });
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
