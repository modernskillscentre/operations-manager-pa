import os
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

EXCEL_FILE = os.path.join(os.path.dirname(__file__), "operations_log.xlsx")

def init_excel():
    """Initializes operations_log.xlsx with headers and styling if it doesn't exist."""
    if not os.path.exists(EXCEL_FILE):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Operations Plan"
        
        headers = [
            "ID", "Date & Time", "Title", "Category", "Alignment Score",
            "When", "Where", "Step 1 (Kickoff)", "Step 2 (Core)", "Step 3 (Done)",
            "Manager's Verdict", "Raw Idea", "Status"
        ]
        
        ws.append(headers)
        
        # Style headers
        header_fill = PatternFill(start_color="1E1B4B", end_color="1E1B4B", fill_type="solid")
        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        thin_border = Border(
            left=Side(style='thin', color='CCCCCC'),
            right=Side(style='thin', color='CCCCCC'),
            top=Side(style='thin', color='CCCCCC'),
            bottom=Side(style='thin', color='CCCCCC')
        )
        
        for col_idx, cell in enumerate(ws[1], 1):
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = thin_border
            
        # Set column widths
        col_widths = {
            'A': 18, 'B': 20, 'C': 26, 'D': 16, 'E': 14,
            'F': 25, 'G': 20, 'H': 30, 'I': 30, 'J': 30,
            'K': 35, 'L': 40, 'M': 14
        }
        for col, width in col_widths.items():
            ws.column_dimensions[col].width = width
            
        wb.save(EXCEL_FILE)

def append_idea_to_excel(idea):
    """Appends an idea dictionary as a new styled row in operations_log.xlsx."""
    init_excel()
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb["Operations Plan"] if "Operations Plan" in wb.sheetnames else wb.active
    
    created_at = idea.get("created_at", datetime.now().isoformat())
    formatted_date = created_at.replace("T", " ")[:19]
    
    steps = idea.get("how", [])
    step1 = steps[0] if len(steps) > 0 else ""
    step2 = steps[1] if len(steps) > 1 else ""
    step3 = steps[2] if len(steps) > 2 else ""
    
    row_data = [
        idea.get("id", ""),
        formatted_date,
        idea.get("title", ""),
        idea.get("category", "SOMEDAY"),
        idea.get("alignment_score", 5),
        idea.get("when", ""),
        idea.get("where", ""),
        step1,
        step2,
        step3,
        idea.get("manager_verdict", ""),
        idea.get("raw", ""),
        "Completed" if idea.get("completed") else "Active"
    ]
    
    ws.append(row_data)
    row_idx = ws.max_row
    
    # Category color styling
    category = str(idea.get("category", "")).upper()
    cat_colors = {
        "DO_NOW": "DCFCE7",      # Light emerald
        "SOMEDAY": "CFFAFE",     # Light cyan
        "DELEGATE": "F3E8FF",    # Light purple
        "DISTRACTION": "FFE4E6"  # Light rose
    }
    fill_color = cat_colors.get(category, "FFFFFF")
    cat_fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type="solid")
    
    for col_idx in range(1, 14):
        cell = ws.cell(row=row_idx, column=col_idx)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        if col_idx == 4: # Category column
            cell.fill = cat_fill
            cell.font = Font(bold=True)
            cell.alignment = Alignment(horizontal="center", vertical="top")
        elif col_idx in (1, 2, 5, 13):
            cell.alignment = Alignment(horizontal="center", vertical="top")
            
    wb.save(EXCEL_FILE)
    print(f"[*] Appended idea to Excel: {idea.get('title')}")

class BrainDumpServerHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS so the app can talk to this local server from anywhere
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/sync-excel':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode('utf-8'))
                append_idea_to_excel(data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "file": EXCEL_FILE}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=8080):
    init_excel()
    server_address = ('', port)
    httpd = HTTPServer(server_address, BrainDumpServerHandler)
    print("=" * 60)
    print(f"🚀 Operations Manager & PA running at http://localhost:{port}")
    print(f"📊 Auto-syncing to Excel file: {EXCEL_FILE}")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")

if __name__ == '__main__':
    run_server()
