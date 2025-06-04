export const signupTemplate = (firstName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to SaifAuth, ${firstName}!</h2>
      <p>Thank you for signing up with SaifAuth. We're excited to have you on board!</p>
      <p>Your account is now active, and you can start using SaifAuth to manage your account and access all its features.</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Thank you for using SaifAuth!</p>
      <p>Best regards,</p>
      <p>The SaifAuth Team</p>
      <p>Found Issues contact: dev@saifabdelrazek.com</p>
    </div>
  `;
};

export const loginNotificationTemplate = (username, ipAddress, location, time) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Login Alert</h2>
      <p>Hello ${username},</p>
      <p>We detected a new login to your account with the following details:</p>
      <div style="background: #f4f4f4; padding: 15px; margin: 10px 0;">
        <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ipAddress}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
    </div>
      <p>If this was you, you can ignore this email. If you didn't sign in to your account, please change your password immediately and contact support.</p>
      <p>Best regards,<br>SaifAuth Team</p>
      <p>Found Issues contact: dev@saifabdelrazek.com</p>
    </div>
  `;
}

export const verificationCodeTemplate = (code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Verification Code</h2>
      <p>You requested a verification code. Here it is:</p>
      <h3 style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px;">${code}</h3>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Best regards,<br>SaifAuth Team</p>
      <p>Found Issues contact: dev@saifabdelrazek.com</p>
    </div>
  `;
};

export const forgotPasswordTemplate = (code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Forgot Password Verification Code</h2>
      <p>Your forget password verification code:</p>
      <h3 style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px;">${code}</h3>
      <p>This code will expire in 10 minutes</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <p>Best regards,<br>SaifAuth Team</p>
      <p>Found Issues contact: dev@saifabdelrazek.com</p>
    </div>
  `;
};