import { Resend } from 'resend';
import { config } from '../config';
import { logger } from '../utils/logger';

const resend = new Resend(config.resend.apiKey);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: config.resend.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    logger.info('Email sent successfully', { 
      to: options.to, 
      subject: options.subject,
      id: result.data?.id 
    });

    return result;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  welcome: (firstName: string, role: string) => ({
    subject: 'Welcome to Theater Script Pro!',
    html: `
      <h2>Welcome to Theater Script Pro, ${firstName}!</h2>
      <p>We're thrilled to have you join our community of ${role === 'playwright' ? 'talented playwrights' : 'theater companies'}.</p>
      
      ${role === 'playwright' ? `
        <p>As a playwright, you can:</p>
        <ul>
          <li>Upload and manage your scripts</li>
          <li>Set licensing terms and pricing</li>
          <li>Track performance analytics</li>
          <li>Connect with theater companies worldwide</li>
        </ul>
      ` : `
        <p>As a theater company, you can:</p>
        <ul>
          <li>Browse our extensive script library</li>
          <li>License scripts for your productions</li>
          <li>Manage your performance rights</li>
          <li>Discover new playwrights</li>
        </ul>
      `}
      
      <p>Get started by completing your profile and ${role === 'playwright' ? 'uploading your first script' : 'browsing available scripts'}.</p>
      
      <p>Best regards,<br>The Theater Script Pro Team</p>
    `,
    text: `Welcome to Theater Script Pro, ${firstName}! We're thrilled to have you join our community.`,
  }),

  licenseConfirmation: (
    theaterName: string,
    scriptTitle: string,
    playwright: string,
    licenseType: string,
    performanceDates: Array<{ date: string; time?: string }>
  ) => ({
    subject: `License Confirmation: ${scriptTitle}`,
    html: `
      <h2>License Confirmation</h2>
      <p>Dear ${theaterName},</p>
      
      <p>This email confirms your ${licenseType} license for:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${scriptTitle}</h3>
        <p>By ${playwright}</p>
        <p><strong>License Type:</strong> ${licenseType}</p>
        <p><strong>Performance Dates:</strong></p>
        <ul>
          ${performanceDates.map(p => `<li>${new Date(p.date).toLocaleDateString()} ${p.time || ''}</li>`).join('')}
        </ul>
      </div>
      
      <p>You can download your script from your dashboard. This license is valid for the performances listed above.</p>
      
      <p>Break a leg!</p>
      <p>The Theater Script Pro Team</p>
    `,
    text: `License confirmed for ${scriptTitle} by ${playwright}. Performance dates: ${performanceDates.map(p => p.date).join(', ')}`,
  }),

  newLicenseNotification: (
    playwrightName: string,
    scriptTitle: string,
    theaterCompany: string,
    amount: number
  ) => ({
    subject: `New License Sale: ${scriptTitle}`,
    html: `
      <h2>Congratulations, ${playwrightName}!</h2>
      
      <p>Great news! Your script "${scriptTitle}" has been licensed by ${theaterCompany}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
        <p><strong>License Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Your Earnings:</strong> $${(amount * 0.85).toFixed(2)} (after 15% platform fee)</p>
      </div>
      
      <p>The funds will be transferred to your account within 3-5 business days.</p>
      
      <p>Keep up the great work!</p>
      <p>The Theater Script Pro Team</p>
    `,
    text: `Your script "${scriptTitle}" has been licensed by ${theaterCompany} for $${amount}.`,
  }),

  scriptPublished: (playwrightName: string, scriptTitle: string) => ({
    subject: `Your Script "${scriptTitle}" is Now Live!`,
    html: `
      <h2>Congratulations, ${playwrightName}!</h2>
      
      <p>Your script "${scriptTitle}" has been published and is now available for licensing on Theater Script Pro.</p>
      
      <p>Here are some tips to maximize your script's visibility:</p>
      <ul>
        <li>Add a compelling cover image</li>
        <li>Keep your script description engaging and concise</li>
        <li>Use relevant themes and tags</li>
        <li>Consider offering competitive pricing</li>
      </ul>
      
      <p>You can track views and licenses from your dashboard.</p>
      
      <p>Best of luck!</p>
      <p>The Theater Script Pro Team</p>
    `,
    text: `Your script "${scriptTitle}" has been published and is now available for licensing.`,
  }),

  reviewNotification: (
    playwrightName: string,
    scriptTitle: string,
    rating: number,
    reviewTitle: string,
    theaterCompany: string
  ) => ({
    subject: `New ${rating}-Star Review for "${scriptTitle}"`,
    html: `
      <h2>Hi ${playwrightName},</h2>
      
      <p>Your script "${scriptTitle}" just received a new review!</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
        <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
        <p><strong>From:</strong> ${theaterCompany}</p>
        <p><strong>Review Title:</strong> ${reviewTitle}</p>
      </div>
      
      <p>View the full review in your dashboard.</p>
      
      <p>Keep creating amazing work!</p>
      <p>The Theater Script Pro Team</p>
    `,
    text: `Your script "${scriptTitle}" received a ${rating}-star review from ${theaterCompany}.`,
  }),
};

// Helper functions for specific email types
export async function sendWelcomeEmail(email: string, firstName: string, role: string) {
  const template = emailTemplates.welcome(firstName, role);
  return sendEmail({
    to: email,
    ...template,
  });
}

export async function sendLicenseConfirmation(
  email: string,
  theaterName: string,
  scriptTitle: string,
  playwright: string,
  licenseType: string,
  performanceDates: Array<{ date: string; time?: string }>
) {
  const template = emailTemplates.licenseConfirmation(
    theaterName,
    scriptTitle,
    playwright,
    licenseType,
    performanceDates
  );
  return sendEmail({
    to: email,
    ...template,
  });
}

export async function sendNewLicenseNotification(
  email: string,
  playwrightName: string,
  scriptTitle: string,
  theaterCompany: string,
  amount: number
) {
  const template = emailTemplates.newLicenseNotification(
    playwrightName,
    scriptTitle,
    theaterCompany,
    amount
  );
  return sendEmail({
    to: email,
    ...template,
  });
}