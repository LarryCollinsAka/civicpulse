import sys
import os

# Add backend/ to path so 'app' package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app 
