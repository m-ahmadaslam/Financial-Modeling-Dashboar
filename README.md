# Financial Dashboard

A modern, professional financial dashboard built with Next.js, TypeScript, and MongoDB. Features secure authentication, user management, and a beautiful UI designed for financial data visualization.

## Features

- 🔐 **Secure Authentication** - NextAuth.js with MongoDB integration
- 👤 **User Management** - Sign up, sign in, and role-based access
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS
- 📊 **Dashboard Interface** - Ready for financial charts and data
- 🔒 **Protected Routes** - Automatic redirect for unauthenticated users
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `financial-dashboard`
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Create admin user**
   ```bash
   npm run create-admin
   ```
   This creates a default admin user:
   - Username: `superadmin`
   - Password: `admin123`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication Flow

1. **Sign Up**: New users can create accounts at `/auth/signup`
2. **Sign In**: Users can log in at `/auth/signin`
3. **Dashboard**: Authenticated users are redirected to `/dashboard`
4. **Sign Out**: Users can sign out from the dashboard header

### Default Admin Account

- **Username**: `superadmin`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin password in production!

## Project Structure

```
fin-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/         # Authentication endpoints
│   │   ├── auth/             # Authentication pages
│   │   │   ├── signin/       # Sign in page
│   │   │   └── signup/       # Sign up page
│   │   ├── dashboard/        # Protected dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page (redirects to signin)
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # NextAuth configuration
│   │   └── mongodb.ts       # MongoDB connection
│   └── types/               # TypeScript type definitions
│       └── next-auth.d.ts   # NextAuth type extensions
├── scripts/                 # Utility scripts
│   └── create-admin.js      # Admin user creation script
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Database Collections
- `users` - User accounts and authentication data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Secret key for JWT tokens | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based session management
- ✅ Protected routes with automatic redirects
- ✅ Input validation and sanitization
- ✅ CSRF protection via NextAuth.js

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run create-admin` - Create default admin user

### Adding New Features

1. **New Pages**: Add to `src/app/` directory
2. **API Routes**: Add to `src/app/api/` directory
3. **Components**: Create in `src/components/` directory
4. **Utilities**: Add to `src/lib/` directory

## Production Deployment

1. **Set production environment variables**
2. **Build the application**: `npm run build`
3. **Start the server**: `npm run start`
4. **Set up MongoDB Atlas** (recommended for production)
5. **Configure your domain** in `NEXTAUTH_URL`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
