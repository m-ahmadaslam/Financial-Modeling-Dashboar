# 🏗️ Financial Modeling Dashboard

A comprehensive financial modeling and analysis platform built for **Alfanar Company**, featuring advanced Excel integration, real-time calculations, and interactive timeline generation.

## 📋 Project Overview

This project is a modern web-based financial modeling dashboard developed to digitize and enhance traditional Excel-based financial analysis workflows. The system provides a seamless interface for financial modeling, project timeline management, and comprehensive data analysis.

### 🏢 **Company Context**
**Alfanar Company** - A leading engineering and construction company specializing in renewable energy projects, requiring sophisticated financial modeling tools for project evaluation and decision-making.

## ✨ Key Features

### 🔢 **Financial Modeling Engine**
- **Excel Integration**: Direct parsing and analysis of complex Excel financial models
- **Formula Engine**: Real-time calculation of 85,569+ financial fields
- **Input Processing**: 3,469 input fields with validation and error handling
- **Calculated Fields**: 82,100+ automatically calculated financial metrics

### 📊 **Timeline Generation System**
- **Monthly Timelines**: 164 comprehensive timeline fields with 485+ monthly periods
- **Multi-Period Analysis**: Quarterly, Semi-annual, and Annual timeline generation
- **Construction Tracking**: Project phases from start to commercial operation
- **Financial Scheduling**: Debt service, tax payments, and dividend distributions

### 🎨 **Modern User Interface**
- **Responsive Design**: Built with Next.js 15 and Tailwind CSS
- **Interactive Components**: Real-time form validation and calculations
- **Data Visualization**: Comprehensive charts and financial dashboards
- **User Management**: Role-based access control and authentication

### 🚀 **Backend Architecture**
- **FastAPI Backend**: High-performance Python API for data processing
- **Excel Analysis**: Comprehensive parsing of complex financial models
- **DataFrame Processing**: Pandas integration for large-scale calculations
- **Real-time API**: RESTful endpoints for seamless frontend integration

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS for modern UI design
- **Authentication**: NextAuth.js with MongoDB integration
- **TypeScript**: Full type safety and enhanced development experience

### **Backend**
- **API Framework**: FastAPI (Python)
- **Data Processing**: Pandas, NumPy for financial calculations
- **Excel Integration**: OpenPyXL for advanced Excel file processing
- **Database**: MongoDB for user management and project storage

### **Infrastructure**
- **Development**: Node.js 18+, Python 3.13
- **Package Management**: npm, pip with virtual environments
- **Version Control**: Git with comprehensive project history

## 📁 Project Structure

```
financial-modeling-dashboard/
├── 📂 backend/                 # FastAPI backend services
│   ├── main.py                 # Main API application
│   ├── requirements.txt        # Python dependencies
│   └── comprehensive_analysis.json  # Excel analysis data (2.2M+ lines)
├── 📂 src/
│   ├── 📂 app/                 # Next.js app directory
│   │   ├── 📂 dashboard/       # Dashboard pages
│   │   │   ├── timelines/      # Timeline generation
│   │   │   ├── projects/       # Project management
│   │   │   └── assumptions/    # Financial assumptions
│   │   └── 📂 api/             # API routes
│   ├── 📂 components/          # React components
│   │   ├── 📂 ProjectForm/     # Project creation forms
│   │   ├── TimelineInputs.tsx  # Timeline input interface
│   │   └── TimelineGenerator.tsx # Timeline display
│   ├── 📂 lib/                 # Core libraries
│   │   ├── 📂 assumptions/     # Financial assumption files (10 files, 10k+ lines each)
│   │   ├── financial-formula-engine.ts  # Formula calculations
│   │   └── comprehensive-input-data.ts  # Data processing
│   └── 📂 hooks/               # Custom React hooks
├── 📄 Ahmed.xlsx              # Source Excel financial model
└── 📄 package.json            # Node.js dependencies
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.13+ with pip
- MongoDB (local or cloud)
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/m-ahmadaslam/Financial-Modeling-Dashboard.git
   cd Financial-Modeling-Dashboard
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```env
   # .env.local
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd backend
   python main.py
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📊 Core Functionality

### **Financial Model Analysis**
- **Excel Parsing**: Automated extraction of financial formulas and data structures
- **Real-time Calculations**: Live updates as users modify input parameters
- **Comprehensive Coverage**: Support for 85,569+ financial fields across multiple categories

### **Timeline Management**
- **Project Phases**: Construction, operation, and financial milestones
- **Monthly Granularity**: Detailed month-by-month project timelines
- **Financial Scheduling**: Debt service, tax obligations, and cash flow timing
- **Multi-dimensional Analysis**: Quarterly, semi-annual, and annual aggregations

### **User Interface Features**
- **Intuitive Forms**: Step-by-step project creation with validation
- **Interactive Tables**: Sortable, filterable data displays with export capabilities
- **Responsive Design**: Optimized for desktop and mobile usage
- **Real-time Feedback**: Immediate validation and calculation updates

## 🔧 API Endpoints

### **Timeline Generation**
```http
POST /generate-timelines
Content-Type: application/json

{
  "model_start_date": "2025-01-01",
  "construction_period": 25,
  "tenor_of_ppa": 25,
  "end_of_extension_period": "2053-01-31"
}
```

### **Excel Analysis**
```http
GET /analyze-excel/Ahmed.xlsx
POST /upload-excel (multipart/form-data)
GET /export-csv
```

### **Health Monitoring**
```http
GET /health
GET /
```

## 📈 Performance Metrics

- **Excel Processing**: 2.2M+ lines of financial data analyzed
- **Field Coverage**: 85,569 total fields (3,469 input + 82,100 calculated)
- **Timeline Scope**: 485+ monthly periods across 25-year project lifecycle
- **Response Time**: Sub-second API responses for complex calculations
- **Data Integrity**: Comprehensive validation and error handling

## 🔒 Security Features

- **Authentication**: Secure user login with NextAuth.js
- **Authorization**: Role-based access control for different user types
- **Data Protection**: Encrypted password storage and secure session management
- **API Security**: CORS protection and request validation

## 🤝 Contributing

This project is developed for Alfanar Company's internal use. For contributions or modifications:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/enhancement`)
5. Create a Pull Request

## 📄 License

This project is proprietary software developed for Alfanar Company. All rights reserved.

## 👥 Development Team

**Lead Developer**: Muhammad Ahmad Aslam  
**Company**: Alfanar Company  
**Project Type**: Financial Modeling & Analysis Platform  
**Development Period**: 2024-2025  

## 🏆 Project Achievements

- ✅ **Complete Excel Integration**: Successfully digitized complex financial models
- ✅ **Advanced Timeline System**: 164 comprehensive timeline fields implemented
- ✅ **Real-time Calculations**: Sub-second response times for complex formulas
- ✅ **Scalable Architecture**: Modern tech stack supporting future enhancements
- ✅ **User-Friendly Interface**: Intuitive design for financial professionals
- ✅ **Comprehensive Testing**: Robust validation and error handling systems

## 📞 Support

For technical support or questions regarding this financial modeling platform, please contact the development team or refer to the comprehensive API documentation available at `/docs` when running the backend server.

---

**Built with ❤️ for Alfanar Company's Financial Modeling Requirements**