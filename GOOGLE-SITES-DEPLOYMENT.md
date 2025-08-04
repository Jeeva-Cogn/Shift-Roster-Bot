# NPE ShiftBot - Google Sites Deployment Guide

## 📋 Overview
This guide will help you deploy the NPE ShiftBot application to Google Sites with full health-conscious leave management functionality.

## 🚀 Deployment Options

### Option 1: Full Website Version
**File:** `google-sites-version.html`
- Complete standalone application
- All features included (Dashboard, Team Management, Leave System, Schedule Generator)
- Best for dedicated websites or subdomains

### Option 2: Embed Widget Version
**File:** `google-sites-embed.html`
- Simplified version optimized for Google Sites embedding
- Core functionality in a compact format
- Better compatibility with Google Sites restrictions

## 📝 Step-by-Step Deployment

### Method A: Using Google Sites HTML Embed

1. **Upload HTML File**
   - Go to Google Sites (sites.google.com)
   - Create a new site or edit existing one
   - Click "Insert" → "Embed" → "Embed code"
   - Copy the content of `google-sites-embed.html`
   - Paste into the embed code box

2. **Adjust Size**
   - Set width: 100%
   - Set height: 800px (or adjust as needed)
   - Click "Insert"

### Method B: External Hosting + Iframe

1. **Host the HTML File**
   - Upload `google-sites-version.html` to:
     - GitHub Pages
     - Netlify
     - Vercel
     - Google Drive (public sharing)
     - Any web hosting service

2. **Embed in Google Sites**
   - In Google Sites, click "Insert" → "Embed" → "By URL"
   - Enter your hosted URL
   - Adjust iframe settings

### Method C: Direct HTML Integration

1. **Use HTML Component**
   - In Google Sites, insert an "HTML" component
   - Copy and paste the relevant sections from the HTML files
   - May require splitting into multiple components due to size limits

## 🔧 Configuration Steps

### 1. Customize Team Data
Edit the `npeTeam` array in the JavaScript section:

```javascript
const npeTeam = [
    { id: '001', name: 'Your Employee Name', role: 'Lead', daysOff: ['Sun', 'Sat'] },
    // Add your team members here
];
```

### 2. Adjust Shift Requirements
Modify shift configurations as needed:

```javascript
const shifts = ['S1 (Morning)', 'S2 (Afternoon)', 'S3 (Night)'];
// Customize based on your requirements
```

### 3. Brand Customization
Update colors and branding in the CSS section:

```css
:root {
    --primary-color: #8b5fbf;    /* Your primary color */
    --secondary-color: #a374d0;  /* Your secondary color */
    /* Adjust other colors as needed */
}
```

## ✨ Features Included

### 📊 Dashboard
- Team workload distribution
- Real-time statistics
- Health & wellness metrics
- Leave status overview

### 👥 Team Management
- Employee profiles
- Role assignments
- Preferred days off tracking
- Status monitoring

### 🏖️ Leave Management
- Leave request submission
- Approval/rejection workflow
- Calendar integration
- Leave type categorization

### 📅 AI Schedule Generator
- Health-conscious scheduling
- Work-life balance rules
- Automatic leave consideration
- Fair workload distribution

## 🛡️ Health-Conscious AI Rules

The system automatically applies these health protection rules:

1. **WORK_LIFE_BALANCE**: 5 days work + 2 days rest cycle
2. **STRESS_MANAGEMENT**: Maximum 6 consecutive work days
3. **MENTAL_HEALTH**: Respects preferred days off
4. **FAIR_DISTRIBUTION**: Equal workload across team members

## 📱 Mobile Responsiveness

Both versions are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Data Storage

### Local Storage
- Leave requests stored in browser localStorage
- Data persists between sessions
- No external database required

### Backup & Export
- Schedule data can be exported to Excel
- Manual backup through browser developer tools
- Consider implementing cloud storage for production use

## ⚡ Performance Optimization

### Loading Speed
- External CDN libraries for charts and date handling
- Optimized CSS with minimal overhead
- Lazy loading for non-critical components

### Browser Compatibility
- Works in all modern browsers
- Fallbacks for older browsers
- Progressive enhancement approach

## 🛠️ Troubleshooting

### Common Issues

**1. Charts Not Loading**
- Check if Chart.js CDN is accessible
- Verify internet connection
- Try refreshing the page

**2. Date Picker Issues**
- Ensure browser supports HTML5 date input
- Check for JavaScript errors in console
- Verify date format compatibility

**3. Styling Problems**
- Check for CSS conflicts with Google Sites theme
- Adjust z-index values if needed
- Test in different browsers

### Debug Mode

Add this to enable console logging:

```javascript
const DEBUG = true;
if (DEBUG) {
    console.log('NPE ShiftBot Debug Mode Enabled');
}
```

## 🔄 Updates & Maintenance

### Regular Updates
- Update team member information
- Review and approve leave requests
- Generate monthly schedules
- Monitor health metrics

### Data Backup
- Export schedule data regularly
- Save team configurations
- Document any customizations

## 📞 Support

For technical support or customization requests:
- Check browser console for error messages
- Verify all external CDN links are working
- Test in incognito/private mode
- Review Google Sites embedding guidelines

## 🎯 Best Practices

1. **Regular Schedule Generation**
   - Generate schedules weekly or bi-weekly
   - Consider approved leaves before generation
   - Review AI recommendations before finalizing

2. **Leave Management**
   - Process leave requests promptly
   - Maintain clear leave policies
   - Monitor team workload balance

3. **Health Monitoring**
   - Review burnout alerts regularly
   - Ensure proper rest periods
   - Adjust schedules based on team feedback

4. **Data Security**
   - Regularly backup schedule data
   - Protect employee information
   - Follow data privacy guidelines

## 🚀 Going Live Checklist

- [ ] Test all functionality in different browsers
- [ ] Update team member information
- [ ] Configure shift requirements
- [ ] Customize branding and colors
- [ ] Test leave request workflow
- [ ] Generate sample schedule
- [ ] Verify mobile responsiveness
- [ ] Set up regular backup process
- [ ] Train team members on usage
- [ ] Document any customizations

## 📈 Future Enhancements

Consider these improvements for production use:
- Database integration for data persistence
- Email notifications for leave requests
- Advanced reporting and analytics
- Integration with existing HR systems
- Multi-team support
- Role-based access control

---

**NPE ShiftBot** - AI-Powered Health-Conscious Roster Management
*Ensuring work-life balance while maintaining operational efficiency*
