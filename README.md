# KRYA Robotics - Autonomous Cyber-Physical Platform

Next-generation sensory-adaptive robotic systems equipped with real-time neural edge processing, sub-millimeter precision torque actuators, and zero-downtime fleet orchestration.

## GitHub Pages Deployment

This repository is pre-configured for automated **GitHub Pages** deployment via GitHub Actions.

### Quick Setup & Local Execution
`ash
# Clone the repository
git clone <your-repo-url>
cd Krya-Robotics

# Install dependencies
npm install

# Start development server
npm run dev
`

### Build for Production
`ash
npm run build
`

### GitHub Pages Automatic Deployment
This repository includes .github/workflows/deploy.yml which deploys the application automatically to GitHub Pages on every push to main or master.

1. Push this repository to GitHub:
`ash
git add .
git commit -m "Initialize Krya Robotics Web Platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
`
2. In your GitHub repository:
- Go to Settings > Pages
- Under Build and deployment > Source, select GitHub Actions
3. The workflow will automatically trigger, build the production bundle, and publish your site.

## Features Included
- Dynamic Lighting Background: Cursor-driven radial ambient glow with reactive ambient cyber meshes for both light & dark modes.
- Interactive Robot Arm Simulation: 6-DoF visual articulation with real-time torque, angle slider controls, and gripper actuation.
- Live Telemetry Stream: Real-time simulation of linear velocity, solid cell charge, neural vision latency, and thermal parameters.
- Payload Interchanger: Hot-swap simulation payloads with instant visual feedback and calibration readouts.
- Autonomous Fleet Matrix: Grid monitoring multiple active autonomous robot clusters.
- Interactive Deployment ROI Calculator: Dynamic slider calculation for unit fleet size and payback timeline.
- Engineering Inquiry System: Reservation form with celebration confetti animations.

## Team Hub accounts

The Team Hub now uses Supabase Auth for invitation-only email/password sign-in. Administrators can invite users, disable or re-enable sign-in, and review the latest 100 login attempts. Login history stores only the account email, time, and success/failure result; it never stores passwords or IP/device details. Team workspace projects and tasks remain a browser-local prototype, isolated by account on each browser but not shared between devices.

GitHub Pages is only the static frontend. Supabase provides authentication, account administration, and the protected login-event table. The service-role key must remain in Supabase's server-side environment and must never be added to the frontend, GitHub Pages, or repository.

### Connect Supabase

1. In Supabase, turn off **Allow new users to sign up** under Authentication settings so accounts can only be invited.
2. Set the Supabase Auth **Site URL** to the published Team Hub URL and add that URL with `?view=team` to the allowed redirect URLs. This is needed for invitation and password-reset links.
3. Add the following local values to an ignored `.env.local` file:

   ```text
   VITE_SUPABASE_URL=https://bwatkmmbevaakgiaerhm.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
   ```

   For GitHub Pages builds, add the same names under **Settings → Secrets and variables → Actions → Variables**. The publishable key is intended for browser use; never use a service-role or secret key here.
4. Install and link the Supabase CLI, then apply the database migration and deploy the functions:

   ```bash
   npx supabase login
   npx supabase link --project-ref bwatkmmbevaakgiaerhm
   npx supabase db push
   npx supabase functions deploy account-login
   npx supabase functions deploy admin-accounts
   ```

5. Create the first user from the Supabase Auth dashboard, then grant administrator access once from the SQL Editor (replace the email):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = lower('admin@example.com');
   ```

   Sign out and back in after setting the role. The app does not expose a way for users to grant themselves administrator access.

6. Add the GitHub Pages URL to Supabase Auth's allowed redirect URLs and enable the email provider. Supabase sends invitation and password-reset emails; configure an SMTP provider in Supabase before relying on production email delivery.

The public website can be built without Supabase values, but Team Hub sign-in stays disabled until the configuration, migration, and Edge Functions are set up.