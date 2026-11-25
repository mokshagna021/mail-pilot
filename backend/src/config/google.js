import { google } from 'googleapis';

export const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
  );
};

export const getAuthenticatedClient = (user) => {
  const oauth2Client = createOAuth2Client();
  if (user?.googleTokens?.refreshToken || user?.googleTokens?.accessToken) {
    oauth2Client.setCredentials({
      access_token: user.googleTokens.accessToken,
      refresh_token: user.googleTokens.refreshToken,
      expiry_date: user.googleTokens.tokenExpiry ? new Date(user.googleTokens.tokenExpiry).getTime() : undefined
    });

    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        user.googleTokens.accessToken = tokens.access_token;
      }
      if (tokens.refresh_token) {
        user.googleTokens.refreshToken = tokens.refresh_token;
      }
      if (tokens.expiry_date) {
        user.googleTokens.tokenExpiry = new Date(tokens.expiry_date);
      }
      await user.save();
    });
  }
  return oauth2Client;
};

export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
