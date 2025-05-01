'use server'
import emailSDK from '@sendgrid/mail'
emailSDK.setApiKey(process.env.TWILIO_SENDGRID_API_KEY!)

export const sendEmail = async (email: string, title: string, text: string) => {
    try {
        const msg = {
            to: email, // Change to your recipient
            from: {
                email: process.env.TWILIO_SENDGRID_FROM_EMAIL!, // Change to your verified sender
            }, // Change to your verified sender
            subject: title,
            text: text,
        }

        await emailSDK.send(msg)
        return {
            code: 200,
            message: 'Email sent successfully',
        }
    } catch (error) {
        console.error('Error sending email:', error)
        return {
            code: 500,
            message: 'Error sending email',
        }
    }

}