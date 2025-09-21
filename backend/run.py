#!/usr/bin/env python3

import uvicorn
import os
import sys

def main():
    """Main function to run the FastAPI server"""
    print("🚀 Starting Financial Dashboard FastAPI Backend...")
    print("📊 Excel parsing and formula analysis ready")
    print("🌐 Server will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("-" * 50)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
