@echo off
echo Setting up AI Code Review Assistant...

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Install development package
echo Installing ai-review package in development mode...
pip install -e .

REM Copy environment variables example if .env doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo Please edit .env file with your actual configuration
)

REM Install dashboard dependencies
echo Installing dashboard dependencies...
cd dashboard
call npm install
cd ..

echo.
echo Setup complete! To start the services:
echo.
echo 1. Start the API server:
echo    call venv\Scripts\activate
echo    uvicorn ai_review.api.main:app --reload
echo.
echo 2. Start the dashboard (in a separate terminal):
echo    cd dashboard
echo    npm start
echo.
echo 3. Use the CLI:
echo    ai-review ./your-code-file.py
echo. 