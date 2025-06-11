# Supabase Authentication Setup

## Enable Google OAuth in Supabase

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard/projects

2. **Navigate to Authentication settings**:
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list

3. **Enable Google OAuth**:
   - Toggle "Enable sign in with Google" to ON
   - You'll see fields for Client ID and Client Secret

4. **Get Google OAuth credentials** (if you don't have them):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google+ API" 
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set authorized redirect URI to: `https://vsbrhhhtqqbpgsbyszpz.supabase.co/auth/v1/callback`

5. **Add credentials to Supabase**:
   - Paste your Google Client ID and Client Secret
   - Click "Save"

## Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3001/login`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth page
5. After successful login, you'll be redirected back to your app with admin navigation visible!

## That's it! 

Supabase handles all the OAuth complexity for you. No environment variables needed, no complex setup - just enable it in your Supabase dashboard and it works! 