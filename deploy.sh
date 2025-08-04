#!/bin/bash

# NPE ShiftBot - One-Click Deployment Script
# Supports multiple hosting platforms without restrictions

echo "🤖 NPE ShiftBot - Deployment Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prereqs() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is required but not installed${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}⚠️  Node.js not found, some deployment options may not work${NC}"
    fi
    
    echo -e "${GREEN}✅ Prerequisites checked${NC}"
}

# Deploy to Netlify (Easiest option)
deploy_netlify() {
    echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
    
    # Install Netlify CLI if not present
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # Prepare files
    cp google-sites-version.html index.html
    
    # Deploy
    netlify deploy --prod --dir .
    
    echo -e "${GREEN}✅ Deployed to Netlify!${NC}"
    echo -e "${GREEN}Your app is live at the URL shown above${NC}"
}

# Deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    
    # Install Vercel CLI if not present
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Prepare files
    cp google-sites-version.html index.html
    
    # Create vercel.json
    cat > vercel.json << EOF
{
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF
    
    # Deploy
    vercel --prod
    
    echo -e "${GREEN}✅ Deployed to Vercel!${NC}"
}

# Deploy to GitHub Pages
deploy_github_pages() {
    echo -e "${BLUE}🚀 Setting up GitHub Pages...${NC}"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "Initializing git repository..."
        git init
        git branch -M main
    fi
    
    # Prepare files
    cp google-sites-version.html index.html
    
    # Add and commit files
    git add .
    git commit -m "Deploy NPE ShiftBot to GitHub Pages"
    
    echo -e "${YELLOW}⚠️  Please push to GitHub and enable Pages in repository settings${NC}"
    echo -e "${BLUE}Instructions:${NC}"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to Repository Settings → Pages"
    echo "3. Select source: Deploy from branch (main)"
    echo "4. Your site will be live at: https://USERNAME.github.io/REPOSITORY"
}

# Deploy to Firebase
deploy_firebase() {
    echo -e "${BLUE}🚀 Deploying to Firebase...${NC}"
    
    # Install Firebase CLI if not present
    if ! command -v firebase &> /dev/null; then
        echo "Installing Firebase CLI..."
        npm install -g firebase-tools
    fi
    
    # Prepare files
    cp google-sites-version.html index.html
    
    # Initialize Firebase (if not already done)
    if [ ! -f "firebase.json" ]; then
        echo "Initializing Firebase..."
        firebase init hosting
    fi
    
    # Deploy
    firebase deploy
    
    echo -e "${GREEN}✅ Deployed to Firebase!${NC}"
}

# Deploy to Surge
deploy_surge() {
    echo -e "${BLUE}🚀 Deploying to Surge.sh...${NC}"
    
    # Install Surge CLI if not present
    if ! command -v surge &> /dev/null; then
        echo "Installing Surge CLI..."
        npm install -g surge
    fi
    
    # Prepare files
    cp google-sites-version.html index.html
    
    # Deploy
    surge . --domain npe-shiftbot-$(date +%s).surge.sh
    
    echo -e "${GREEN}✅ Deployed to Surge!${NC}"
}

# Create Docker deployment
create_docker() {
    echo -e "${BLUE}🐳 Creating Docker deployment...${NC}"
    
    # Create Dockerfile
    cat > Dockerfile << EOF
FROM nginx:alpine

# Copy the HTML file
COPY google-sites-version.html /usr/share/nginx/html/index.html
COPY manifest.json /usr/share/nginx/html/manifest.json
COPY service-worker.js /usr/share/nginx/html/service-worker.js

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

    # Create nginx.conf
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files \$uri \$uri/ /index.html;
        }
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    }
}
EOF

    # Create docker-compose.yml
    cat > docker-compose.yml << EOF
version: '3.8'
services:
  npe-shiftbot:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
EOF

    echo -e "${GREEN}✅ Docker files created!${NC}"
    echo -e "${BLUE}To run with Docker:${NC}"
    echo "docker build -t npe-shiftbot ."
    echo "docker run -p 8080:80 npe-shiftbot"
    echo ""
    echo -e "${BLUE}Or with Docker Compose:${NC}"
    echo "docker-compose up -d"
}

# Main menu
show_menu() {
    echo ""
    echo -e "${YELLOW}Select deployment option:${NC}"
    echo "1) Netlify (Recommended - Easiest)"
    echo "2) Vercel (Fast & Modern)"
    echo "3) GitHub Pages (Free & Reliable)"
    echo "4) Firebase Hosting (Google Cloud)"
    echo "5) Surge.sh (Quick & Simple)"
    echo "6) Create Docker Setup"
    echo "7) Show all deployment info"
    echo "8) Exit"
    echo ""
}

# Show all deployment information
show_all_info() {
    echo -e "${BLUE}📚 All Deployment Options:${NC}"
    echo ""
    echo -e "${GREEN}🔥 Recommended Free Options:${NC}"
    echo "• Netlify: Drag & drop or CLI deployment"
    echo "• Vercel: Perfect for modern web apps"
    echo "• GitHub Pages: Reliable with version control"
    echo ""
    echo -e "${GREEN}🌐 Other Free Options:${NC}"
    echo "• Firebase Hosting: Google's platform"
    echo "• Surge.sh: Instant static deployments"
    echo "• Cloudflare Pages: Global CDN included"
    echo ""
    echo -e "${GREEN}💰 Paid Options (Full Control):${NC}"
    echo "• DigitalOcean Droplets: $5/month VPS"
    echo "• AWS S3 + CloudFront: Pay-as-you-go"
    echo "• Linode/Vultr: $5/month VPS"
    echo ""
    echo -e "${GREEN}🐳 Self-Hosting:${NC}"
    echo "• Docker: Use option 6 to create Docker setup"
    echo "• VPS with Nginx: Manual server setup"
    echo ""
}

# Main execution
main() {
    check_prereqs
    
    while true; do
        show_menu
        read -p "Enter your choice (1-8): " choice
        
        case $choice in
            1)
                deploy_netlify
                break
                ;;
            2)
                deploy_vercel
                break
                ;;
            3)
                deploy_github_pages
                break
                ;;
            4)
                deploy_firebase
                break
                ;;
            5)
                deploy_surge
                break
                ;;
            6)
                create_docker
                break
                ;;
            7)
                show_all_info
                ;;
            8)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please try again.${NC}"
                ;;
        esac
    done
}

# Run the script
main
