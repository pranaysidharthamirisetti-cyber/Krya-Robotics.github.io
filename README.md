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