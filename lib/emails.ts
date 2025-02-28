'use server';
import { User } from 'next-auth';
import supabaseClient from './supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.resend_API_KEY);

export async function checkIfWelcomeEmailAlreadySent(user_id: string) {
  try {
    const { data, error } = await supabaseClient()
      .from('welcome_emails')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (error) {
      console.error('Error checking welcome email:', error);
      return false;
    }

    const emailSent = data !== null;
    return emailSent;
  } catch (err) {
    return false;
  }
}
export async function sendWelcomeEmail(user: User) {
  if (!user) {
    throw new Error('sendWelcomeEmail: User is not defined');
  }
  if (!user.email) {
    throw new Error('sendWelcomeEmail: User Email is not defined');
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resugenie.app',
      to: user.email,
      subject: 'Welcome to resugenie!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to resugenie!</h2>
          <p>Hi ${user.name || 'there'},</p>
          <p>We're excited to have you join our community! Your account has been successfully created.</p>
          
          <p>If you have any questions or need assistance, don't hesitate to contact our support team at service.mpleines@gmail.com</p>
          <p>Best regards,<br>The resugenie Team</p>
        </div>
      `,
    });

    // After successfully sending the email, record it in Supabase
    const response = await supabaseClient().from('welcome_emails').insert({
      user_id: user.id,
      sent_at: new Date().toISOString(),
    });

    if (response.error) {
      throw response.error;
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}
