# ShiftBot Web Application

🚀 **Live Demo**: [Access ShiftBot Web App](#deployment) *(Ready for deployment)*

## 🌟 Overview

ShiftBot is a powerful AI-powered shift roster management web application designed specifically for QA&DOD UAT teams. Built with modern web technologies, it provides intelligent shift scheduling, comprehensive reporting, and real-time roster management.

## ✨ Features

- **🤖 AI-Powered Scheduling**: Intelligent shift assignment based on team skills and availability
- **📊 Real-time Analytics**: Comprehensive reports and visualizations
- **👥 Team Management**: Manage 14+ team members with role-based assignments
- **🕐 Multi-Shift Support**: Handle S1-S4 shifts, General, Production, and HIH schedules
- **🌍 Timezone Aware**: IST (Indian Standard Time) support
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Data Persistence**: Local storage with export/import capabilities

## 🏗️ Architecture

```
Shift-Roster-Bot/
├── server.js              # Express.js web server
├── package.json           # Root dependencies
├── shiftbot/              # Client-side application
│   ├── index.html         # Main application entry
│   ├── css/style.css      # Responsive styling
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application controller
│   │   ├── data-manager.js # Core data management
│   │   ├── schedule-generator.js # AI scheduling engine
│   │   ├── reports.js     # Analytics and reporting
│   │   ├── rule-engine.js # Business logic rules
│   │   └── utils.js       # Utility functions
│   └── *.json            # Sample and actual roster data
└── deployment/           # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Modern web browser
- Git

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jeeva-Cogn/Shift-Roster-Bot.git
   cd Shift-Roster-Bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Local: http://localhost:3000
   - Network: http://0.0.0.0:3000

### Production Deployment

```bash
npm start
```
├── LICENSE
├── package.json
├── README.md
├── css/
│ └── style.css
└── js/
    ├── app.js
    ├── data-manager.js
    ├── reports.js
    ├── rule-engine.js
    ├── schedule-generator.js
    └── utils.js
```