/**
 * Webhook helper for sending notifications
 * Currently configured for Slack but can be adapted for other services
 */

interface WebhookPayload {
  collection: string
  action: 'create' | 'update' | 'delete'
  docId: number | string
  title?: string
  user?: {
    email: string
    fullName?: string
  }
}

/**
 * Send Slack notification when content changes
 * 
 * To enable:
 * 1. Create a Slack webhook URL at: https://api.slack.com/messaging/webhooks
 * 2. Add SLACK_WEBHOOK_URL to your .env file
 */
export async function sendWebhookNotification(payload: WebhookPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  
  if (!webhookUrl) {
    // Silently skip if no webhook configured
    return
  }

  const emoji = {
    create: '✨',
    update: '📝',
    delete: '🗑️',
  }

  const message = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji[payload.action]} ${payload.collection} ${payload.action}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Title:*\n${payload.title || 'N/A'}`,
          },
          {
            type: 'mrkdwn',
            text: `*User:*\n${payload.user?.fullName || payload.user?.email || 'System'}`,
          },
        ],
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View in CMS',
              emoji: true,
            },
            url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/${payload.collection}/${payload.docId}`,
            action_id: 'view_doc',
          },
        ],
      },
    ],
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    console.log(`[Webhook] Sent ${payload.action} notification for ${payload.collection}`)
  } catch (error) {
    console.error('[Webhook] Failed to send notification:', error)
  }
}

/**
 * Email notification helper (placeholder)
 * Integrate with your email service (Resend, SendGrid, etc.)
 */
export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.EMAIL_API_KEY
  
  if (!apiKey) {
    console.log('[Email] Would send to:', to, 'Subject:', subject)
    return
  }

  // Implement with your email provider
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'Simply Enak CMS <noreply@simplyenak.com>',
  //   to,
  //   subject,
  //   html,
  // })
  
  console.log('[Email] Sent to:', to, 'Subject:', subject)
}
