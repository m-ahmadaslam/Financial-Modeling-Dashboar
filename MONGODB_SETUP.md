# MongoDB Setup Guide

This guide will help you set up MongoDB for the Financial Dashboard application.

## Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `financial-dashboard`

6. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-dashboard?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

### Windows

1. **Download MongoDB Community Server**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download the Windows installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB Compass (optional but recommended)

3. **Start MongoDB Service**
   - MongoDB should start automatically as a Windows service
   - To verify, open Command Prompt and run:
     ```bash
     mongod --version
     ```

4. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   ```

### macOS

1. **Install with Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB Service**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

3. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   ```

### Linux (Ubuntu)

1. **Import MongoDB GPG Key**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB Service**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   ```

## Verify Installation

1. **Test Connection**
   ```bash
   # For local MongoDB
   mongosh
   
   # For MongoDB Atlas
   mongosh "your-connection-string"
   ```

2. **Create Database**
   ```javascript
   use financial-dashboard
   db.createCollection('users')
   ```

3. **Exit MongoDB Shell**
   ```javascript
   exit
   ```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - Verify firewall settings

2. **Authentication Failed**
   - Double-check username and password
   - Ensure database user has correct permissions
   - Verify connection string format

3. **Network Timeout**
   - Check internet connection (for Atlas)
   - Verify IP whitelist settings
   - Try different regions

### Getting Help

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)

## Next Steps

After setting up MongoDB:

1. Update your `.env.local` file with the correct `MONGODB_URI`
2. Run `npm run create-admin` to create the default admin user
3. Start the application with `npm run dev`
4. Test the authentication flow

## Security Notes

- **Never commit your MongoDB connection string to version control**
- **Use environment variables for all sensitive information**
- **In production, use MongoDB Atlas with proper security settings**
- **Regularly update MongoDB to the latest version**
- **Enable MongoDB authentication for production deployments**
