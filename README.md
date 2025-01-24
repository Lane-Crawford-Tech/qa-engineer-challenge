# qa-engineer-challenge

A React-based product management interface built with Gatsby, featuring data grid functionality and comprehensive error logging.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Git

## Setup Instructions

### 1. Install Gatsby CLI
```bash
npm install -g gatsby-cli
```

### 2. Clone and Setup Project
```bash
# Clone repository
git clone [qa-engineer-challenge url]
cd [project-directory]

# Install dependencies
npm install

# Install required packages
npm install axios @mui/material @mui/x-data-grid @emotion/react @emotion/styled
```

### 3. Environment Configuration
```bash
# Create .env.development file
cp .env.example .env.development

# Add necessary environment variables
echo "GATSBY_API_URL=http://localhost:8000" >> .env.development
```

## Starting the Application

### Development Mode
```bash
# Start development server
gatsby develop

# Access the application
# Open browser and navigate to http://localhost:8000
```

### Production Mode
```bash
# Build for production
gatsby build

# Serve production build
gatsby serve

# Access production build
# Open browser and navigate to http://localhost:9000
```

## Live Debugging

### 1. Browser Developer Tools
- Open Chrome DevTools (F12 or Cmd+Option+I)
- Navigate to Sources tab
- Find your source files under webpack:// directory
- Set breakpoints in your code

### 2. VS Code Debugging
```json
// .vscode/launch.json configuration
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Gatsby Debug",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:8000",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///./~/*": "${webRoot}/node_modules/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///*": "*"
      }
    }
  ]
}
```

### 3. Console Logging
The application includes a comprehensive logging system:
```javascript
// Log levels available
logger.info("Information message");
logger.warn("Warning message");
logger.error("Error message", error);
```

### 4. Hot Reloading
- Changes to React components automatically reload
- GraphQL query changes require manual page refresh
- Changes to gatsby-* files require restart of development server

## Troubleshooting

### Common Issues
1. Port conflicts:
```bash
# Kill process using port 8000
sudo lsof -i :8000
kill -9 [PID]
```

2. Cache issues:
```bash
# Clear Gatsby cache
gatsby clean
```

3. Dependencies issues:
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Additional Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs)
- [Material-UI DataGrid](https://mui.com/x/react-data-grid)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
