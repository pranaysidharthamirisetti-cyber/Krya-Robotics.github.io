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

## Team Hub prototype

Open **Team Hub** from the site header to try the workspace prototype. It starts with sample projects but no example robots or tasks, so you can add your own. It includes separate Competition and R&D robot tracks, member assignments, task status/progress updates, and due-date views. Changes are saved in the current browser using `localStorage`.

This is a front-end prototype, not a production team system:

- GitHub Pages serves static files; this prototype does not provide accounts, email/password login, shared team data, or email/push reminders.
- Do not enter real member details, passwords, or confidential project information. The sample data is illustrative and stays in the browser where it was entered.
- Never store or export passwords in Excel. A production version needs an authentication provider, a protected shared database, access rules, and a notification service. Only non-sensitive account fields should be exported if an administrator needs a roster.