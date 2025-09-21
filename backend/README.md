# Financial Dashboard FastAPI Backend

This FastAPI backend is designed to parse Excel files and extract comprehensive financial data, formulas, and assumptions for the financial dashboard frontend.

## Features

- **Excel Parsing**: Comprehensive analysis of all Excel sheets
- **Formula Analysis**: Advanced formula pattern recognition
- **Field Extraction**: Automatic detection of input and calculated fields
- **Section Detection**: Intelligent section and heading identification
- **CSV Export**: Export analysis results to CSV format
- **CORS Support**: Ready for frontend integration

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### Excel Analysis
- `POST /upload-excel` - Upload and analyze Excel file
- `GET /analyze-excel/{filename}` - Analyze Excel file from project root
- `GET /get-analysis` - Get current analysis result
- `GET /export-csv` - Export analysis to CSV format

## Usage

### Analyze Excel File
```bash
curl -X GET "http://localhost:8000/analyze-excel/Ahmed.xlsx"
```

### Upload Excel File
```bash
curl -X POST "http://localhost:8000/upload-excel" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/file.xlsx"
```

### Get Analysis Results
```bash
curl -X GET "http://localhost:8000/get-analysis"
```

## Data Structure

The API returns comprehensive analysis including:

- **Sections**: Hierarchical organization of data
- **Fields**: Individual input and calculated fields
- **Formulas**: Pattern analysis and formula extraction
- **Metadata**: Statistics and analysis information

## Integration with Frontend

The backend is configured with CORS to work with the Next.js frontend running on `http://localhost:3000`.

## Development

To run in development mode with auto-reload:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Dependencies

- FastAPI: Web framework
- pandas: Data manipulation
- openpyxl: Excel file processing
- pydantic: Data validation
- uvicorn: ASGI server
