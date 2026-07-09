export const sendNotificationEvent = async ({ userId, eventType, payload, channels = null, email = null }) => {
    try {
        const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "https://notification-olgf.onrender.com";
        const apiKey = process.env.NOTIFICATION_API_KEY || "default-dev-key";

        const requestBody = {
            user_id: String(userId),
            event_type: eventType,
            payload: payload
        };

        if (channels) {
            requestBody.channels = channels;
        }

        if (email) {
            requestBody.contact_info = { email };
        }

        const response = await fetch(`${notificationServiceUrl}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Failed to send notification:", errorData);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error in sending notification event:", error);
        return false;
    }
};
