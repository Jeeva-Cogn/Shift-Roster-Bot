# NPE ShiftBot - AI-Powered Roster Management

🚀 **Live Demo**: https://shiftbot.netlify.app/ *(Ready for deployment)*
🚀 **Deploy to Netlify**: [One-Click Deployment](#deployment) *(Static Site - No Server Required)*

## 🌟 Overview

NPE ShiftBot is a powerful AI-powered shift roster management web application designed specifically for NPE teams. Built as a static web application with modern frontend technologies, it provides intelligent shift scheduling, comprehensive Excel-based reporting, and real-time roster management with actual August 2025 NPE team data.

## ✨ Key Features

- **🤖 AI-Powered Scheduling**: Health-conscious shift assignment with burnout prevention
- **📊 Animated Analytics**: Interactive charts and visualizations with Chart.js
- **👥 Real NPE Team Data**: 14 actual team members with CTS IDs and ESHC codes
- **📋 Excel Integration**: Professional .xlsx import/export (multi-sheet support)
- **🕐 IST Shift Support**: S1-S4 shifts with real August 2025 roster data
- **🌍 Timezone Aware**: Indian Standard Time (IST) support
- **📱 Progressive Web App**: Installable mobile app with offline capability
- **💾 Client-side Storage**: Local browser storage with Excel backup/restore
- **🎨 Modern UI**: Beautiful animated interface with gradient charts
- **🏖️ Leave Management**: Real approved leaves for August 2025

## 🏗️ Architecture

```
NPE Shift-Roster-Bot/
├── index.html             # Main application (single file)
├── service-worker.js      # PWA offline functionality
├── manifest.json          # PWA app manifest
├── netlify.toml           # Netlify deployment config
├── _redirects             # Netlify routing rules
├── package.json           # Build scripts
└── deployment docs/       # Netlify deployment guides
```

## 🚀 Quick Deploy to Netlify

### Option 1: Drag & Drop (30 seconds)
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire project folder to the deploy area
3. **Done!** Get instant URL: `https://random-name.netlify.app`

### Option 2: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → "New site from Git"
3. Connect repository
4. Auto-deploy on every commit

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/Jeeva-Cogn/Shift-Roster-Bot.git
cd Shift-Roster-Bot

# Open in browser
open index.html

# Or serve locally (optional)
python -m http.server 8000
# Visit: http://localhost:8000

# Or with Node.js
npx http-server .
```

## 📊 Real NPE Data (August 2025)

### Team Structure
- **2 Leads**: Dinesh, Mano
- **5 Shift Leads**: Jeyakaran, Karthikeyan, Panner, Sai Kumar, Manoj
- **7 Associates**: Sai Krishna, Jeeva, Saran, Akshay, Murugan, Sahana P, Rengadurai

### Shift Timings (IST)
- **S1 Morning**: 06:00 AM - 04:00 PM
- **S2 Afternoon**: 01:00 PM - 11:00 PM
- **S3 Night**: 10:00 PM - 08:00 AM
- **S4 Special**: 12:30 PM - 10:30 PM

### August 2025 Data
- **31 days** of actual roster assignments
- **8 approved leaves** integrated
- **Real employee preferences** and availability

## 📱 Progressive Web App (PWA)

Your deployed NPE ShiftBot can be installed as a mobile app:
- **Add to Home Screen** on iOS/Android
- **Offline Functionality** with service workers
- **App-like Experience** with full-screen mode
- **Fast Loading** with cached assets

## 🎯 Netlify Features

| Feature | Benefit |
|---------|---------|
| **Instant Deploy** | Drag & drop for immediate deployment |
| **Git Integration** | Auto-deploy on code changes |
| **Custom Domains** | Use your own domain name |
| **SSL/HTTPS** | Automatic security certificates |
| **Global CDN** | Fast loading worldwide |
| **Analytics** | Track usage and performance |
| **Forms** | Handle contact forms (if needed) |
| **Edge Functions** | Serverless capabilities |

## 🔒 Security & Performance

Your Netlify deployment includes:
- **HTTPS** encryption by default
- **Security headers** (XSS protection, CSP)
- **GZIP compression** for faster loading
- **Cache optimization** for better performance
- **CDN delivery** for global speed
- **DDoS protection** included

## 📈 Excel Features

### Import Capabilities
- **Multi-sheet Excel files** (.xlsx format)
- **Team data** with CTS IDs and ESHC codes
- **Schedule data** with shift assignments
- **Leave records** with approval status

### Export Capabilities
- **Complete backup** in Excel format
- **Schedule downloads** for planning
- **Team reports** with statistics
- **Leave summaries** by date range

## 🛠️ Configuration Files

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "/"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### `_redirects`
```
/* /index.html 200
```

## 🆘 Troubleshooting

### Common Issues
- **Charts not loading?** Check CDN connections in browser console
- **PWA not installing?** Verify HTTPS and manifest.json
- **Mobile issues?** Test responsive design on various devices
- **Excel import fails?** Ensure .xlsx format and proper structure

### Netlify Support
- Check deployment logs in Netlify dashboard
- Test in different browsers
- Verify all external dependencies load correctly

## 📚 Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js with gradient animations
- **Excel**: XLSX.js for import/export
- **Date/Time**: Luxon.js for timezone handling
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: Netlify static hosting

## 🎉 Go Live in 3 Steps!

1. **Prepare**: Ensure all files are ready
2. **Deploy**: Use Netlify drag & drop or GitHub integration
3. **Share**: Your NPE ShiftBot is live!

**Fast. Reliable. Professional.** 🚀

## 📞 Support

- **Repository**: https://github.com/Jeeva-Cogn/Shift-Roster-Bot
- **Issues**: Create GitHub issues for bugs/features
- **Netlify Docs**: https://docs.netlify.com

---

**NPE ShiftBot** - AI-Powered Health-Conscious Roster Management  
*Powered by Netlify's global edge network*

## 📜 License

This project is released into the **Public Domain** under the Unlicense.  
Free to use, modify, and distribute without restrictions.
