# Demo Assets Creation Guide

## Creating Demo GIF/Video

### Option 1: Screen Recording (Recommended)
Use tools like:
- **Windows**: Xbox Game Bar (Win + G) or OBS Studio
- **Mac**: QuickTime Player or ScreenFlow
- **Cross-platform**: OBS Studio (free)

### Recording Steps:
1. **Setup** (30 seconds)
   - Open FinGrow at http://localhost:3000
   - Clear browser cache/localStorage to ensure fresh experience
   - Set browser window to 1280x720 for optimal recording

2. **Demo Flow** (90 seconds total)
   
   **Signup & Login (20 seconds)**
   - Navigate to signup page
   - Fill form: Name: "Demo User", Email: "demo@fingrow.com", Password: "demo123"
   - Show successful signup and redirect to dashboard

   **Dashboard Overview (25 seconds)**
   - Highlight key stats: Total Invested, Current Value, Active Goals
   - Show risk assessment prompt
   - Point out AI insights section
   - Demonstrate smooth animations and glass morphism effects

   **Onboarding Tour (20 seconds)**
   - Click "Start Tour Again" from settings (or trigger for new user)
   - Show 2-3 key steps of the onboarding
   - Highlight educational disclaimers

   **Investment Bundles (15 seconds)**
   - Navigate to /bundles
   - Show three bundle options with risk labels
   - Highlight simulated returns disclaimer
   - Show bundle details and recommendations

   **Investment Simulation (10 seconds)**
   - Navigate to /simulation
   - Set: ₹5,000/month, 3 years, Balanced Bundle
   - Show calculation: ₹1.8L invested → ₹2.1L final value
   - Display interactive chart with growth projection

### Recording Settings:
- **Resolution**: 1280x720 (720p)
- **Frame Rate**: 30 FPS
- **Format**: MP4 for video, GIF for quick preview
- **Duration**: 90 seconds maximum

### Post-Processing:
1. **Trim** unnecessary parts
2. **Add text overlays** for key features:
   - "AI-Powered Investment Analysis"
   - "Risk Assessment & Personalized Recommendations"
   - "Educational Prototype - Simulated Data"
3. **Compress** for web (target: <10MB for GIF, <25MB for MP4)

### Tools for GIF Creation:
- **Online**: ezgif.com, giphy.com
- **Desktop**: GIMP, Photoshop, or ffmpeg
- **Command line**: 
  ```bash
  ffmpeg -i demo-video.mp4 -vf "fps=15,scale=640:-1:flags=lanczos" demo.gif
  ```

### Final Assets:
- `demo.gif` (5-10MB) - Quick preview for README
- `demo-full.mp4` (15-25MB) - Complete walkthrough
- `screenshots/` folder with key screens

### Usage in README:
```markdown
## 🎬 Demo

![FinGrow Demo](./demo.gif)

**[Watch Full Demo Video](./demo-full.mp4)** (2 minutes)

### Quick Demo Flow:
1. **Signup** → Dashboard with AI insights
2. **Risk Assessment** → Personalized recommendations  
3. **Investment Bundles** → Choose your risk level
4. **Simulation** → See your money grow over time
5. **Onboarding Tour** → Guided feature walkthrough
```

## Screenshots to Capture:

1. **Landing/Login Page** - Clean, modern design
2. **Dashboard** - Stats, charts, AI insights
3. **Risk Assessment** - 5-question questionnaire
4. **Investment Bundles** - Three options with risk labels
5. **Simulation Results** - Chart showing growth projection
6. **Onboarding Tour** - Modal overlay with step-by-step guide
7. **Mobile View** - Responsive design showcase

## Tips:
- Keep mouse movements smooth and deliberate
- Pause briefly at each key feature (2-3 seconds)
- Show loading states and smooth transitions
- Highlight educational disclaimers and "simulated data" labels
- Demonstrate both desktop and mobile views if possible