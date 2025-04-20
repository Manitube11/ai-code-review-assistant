#!/bin/bash
set -e

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install development package
echo "Installing ai-review package in development mode..."
pip install -e .

# Copy environment variables example if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit .env file with your actual configuration"
fi

# Install dashboard dependencies
echo "Installing dashboard dependencies..."
cd dashboard
npm install
cd ..

echo ""
echo "Setup complete! To start the services:"
echo ""
echo "1. Start the API server:"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   uvicorn ai_review.api.main:app --reload"
echo ""
echo "2. Start the dashboard (in a separate terminal):"
echo "   cd dashboard"
echo "   npm start"
echo ""
echo "3. Use the CLI:"
echo "   ai-review ./your-code-file.py"
echo "" 