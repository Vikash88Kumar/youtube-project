import axios from 'axios';

import { Notification } from "../models/notification.models.js";

class NotificationClient {
  constructor(baseUrl, apiKey) {
    // Defaults to environment variables
    this.baseUrl = (baseUrl || process.env.NOTIFICATION_SERVICE_URL || "https://notification-olgf.onrender.com").replace(/\/$/, "");
    this.apiKey = apiKey || process.env.NOTIFICATION_API_KEY || "default-dev-key";
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json"
      }
    });
  }
  /**
   * Register or update a user's contact information.
   * Call this when a user logs in.
   */
  async registerUser(userId, email, fcmToken) {
    try {
      await this.api.post(`/users/${String(userId)}/token`, {
        email: email,
        fcm_token: fcmToken
      });
      return true;
    } catch (error) {
      console.error(`Failed to register user ${userId}:`, error.response?.data || error.message);
      return false;
    }
  }
  /**
   * Trigger a notification event for a specific user.
   */
  async sendEvent(userId, eventType, message, channels = ["push", "email", "inapp"], forceDelivery = false, actionUrl = null, senderId = null) {
    // 1. Save to local MongoDB for in-app inbox
    try {
      if (channels.includes("inapp")) {
        await Notification.create({
          recipient: userId,
          type: eventType,
          message: message,
          actionUrl: actionUrl,
          sender: senderId
        });
      }
    } catch (dbError) {
      console.error("Failed to save notification to DB:", dbError);
    }

    // 2. Send push/email via external service
    try {
      const response = await this.api.post('/events', {
        user_id: String(userId),
        event_type: eventType,
        payload: {
          item: message,
          actionUrl: actionUrl
        },
        channels: channels.filter(c => c !== "inapp"), // microservice doesn't handle inapp
        force_delivery: forceDelivery
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to send event to user ${userId}:`, error.response?.data || error.message);
      return null;
    }
  }
}

export default NotificationClient;
