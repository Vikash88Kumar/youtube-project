import axios from 'axios';

class NotificationClient {
  constructor(baseUrl, apiKey) {
    // Defaults to environment variables
    this.baseUrl = (baseUrl || process.env.NOTIFICATION_SERVICE_URL || "https://your-notification-service.onrender.com").replace(/\/$/, "");
    this.apiKey = apiKey || process.env.NOTIFICATION_API_KEY || "default-dev-key";
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
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
      await this.api.post(`/users/${userId}/token`, {
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
  async sendEvent(userId, eventType, message, channels = ["push", "email", "inapp"], forceDelivery = false) {
    try {
      const response = await this.api.post('/events', {
        user_id: userId,
        event_type: eventType,
        payload: {
          item: message
        },
        channels: channels,
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
