import os
import sys

# 1. Manually add the backend directory to the Python path
# This allows 'from app.main import app' to work on Vercel's servers
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if path not in sys.path:
    sys.path.insert(0, path)

# 2. Import your FastAPI instance from your actual code
from backend.app.main import app

# 3. Vercel needs this 'app' object to exist at the top level of this file