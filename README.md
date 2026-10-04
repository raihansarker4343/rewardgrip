<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Bl1S8plPbf92couVOkJZ7qaFGXFF7LwO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend password reset email setup

The Express backend can send password reset links via email and now issues email verification OTPs during sign-up. Configure the following environment variables in `earnlab-backend/.env` (or your deployment environment) so the `/api/auth/forgot-password` endpoint can send reset links and the signup flow can deliver verification codes through Esend/Resend:

- `ESEND_API_KEY` (or `RESEND_API_KEY`) containing your Esend API token
- `EMAIL_FROM` for the "from" address registered in Esend
- `FRONTEND_URL` pointing to your deployed frontend (used to build the reset link)

Place your Esend token (for example, `re_...`) in `.env` under `ESEND_API_KEY`; the backend will automatically use it for passwor
d-reset emails. If the optional `resend` SDK is installed, the backend will send through that client; otherwise it falls back to t
he Resend HTTP API.

If the API key is not configured in a local environment, the backend will log the reset link to the console so you can test the flow without sending an email.

### Environment setup

Copy `earnlab-backend/.env.example` to `earnlab-backend/.env` and fill in the secrets for your database, JWT, postback, and email keys. The example file is tracked while the real `.env` (and legacy `env.txt`) is gitignored to keep credentials out of the repository.
