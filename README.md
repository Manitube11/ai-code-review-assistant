# 🤖 AI Code Review Assistant

<div align="center">
  
  ![AI Code Review Banner](https://img.shields.io/badge/AI-Code%20Review-blue?style=for-the-badge&logo=openai&logoColor=white)
  
  <h3>Elevate your code quality with AI-powered insights</h3>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat-square&logo=react&logoColor=white)](https://reactjs.org)
  [![OpenAI](https://img.shields.io/badge/OpenAI-API-83EBE8.svg?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
  
  <br>
  <i>Created with ❤️ by <a href="https://github.com/ManiTube11">ManiTube</a></i>
</div>

---

## ✨ Features

- 🧠 **AI-powered Code Analysis**: Leverages OpenAI models to provide intelligent code reviews
- 🔤 **Multi-language Support**: Automatically detects and reviews code in various programming languages
- 🚨 **Severity Levels**: Categorizes issues by severity (low, medium, high, critical)
- 🏷️ **Categories**: Organizes suggestions by type (lint, security, performance, style, refactor, documentation, test)
- 🖥️ **Web Dashboard**: Easy-to-use interface for submitting code and viewing reviews
- 📟 **Command-line Interface**: Review files directly from your terminal
- 🎮 **Mock Mode**: Built-in demo mode that works without an OpenAI API key

## 📸 Screenshots

(Add screenshots of your application here)

## 🏗️ Architecture

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=AI+Code+Review+Architecture" alt="Architecture Diagram" width="700px">
</div>

The project consists of three main components:

1. 🔄 **API Server**: A FastAPI backend that handles code review requests and database operations
2. 🎨 **Web Dashboard**: A React frontend for interacting with the API
3. ⌨️ **CLI Tool**: A command-line interface for quick code reviews

## 🛠️ Technologies Used

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, TypeScript, Material-UI
- **AI Integration**: OpenAI API (GPT-4)
- **Testing**: Pytest

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm/yarn

### Installation

<details>
<summary>Click to expand installation steps</summary>

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-code-review-assistant.git
   cd ai-code-review-assistant
   ```

2. Run the setup script:
   
   **For Windows:**
   ```bash
   .\init.bat
   ```
   
   **For Linux/macOS:**
   ```bash
   ./init.sh
   ```

   This will:
   - Create a virtual environment
   - Install Python dependencies
   - Install the package in development mode
   - Create a `.env` file from the example
   - Install dashboard dependencies

3. Configure your OpenAI API key:
   
   Edit the `.env` file in the root directory and replace `your_real_api_key_here` with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key
   ```

   > **Note**: If you don't have an OpenAI API key, the system will run in mock mode, providing sample reviews for testing.
</details>

### Running the Application

<details>
<summary>Click to expand application setup</summary>

1. Start the API server:
   ```bash
   # Activate the virtual environment
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   
   # Start the server
   python -m uvicorn ai_review.api.main:app --reload
   ```

2. Start the dashboard (in a separate terminal):
   ```bash
   cd dashboard
   npm start
   ```

3. Access the web interface:
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
</details>

### Using the CLI

Review a file directly from the command line:
```bash
# Activate the virtual environment first
ai-review ./path/to/your/file.py
```

## 📚 API Documentation

Once the server is running, API documentation is available at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🌟 Key Features Explained

### AI Code Analysis

<div align="center">
  <img src="https://via.placeholder.com/800x300?text=AI+Code+Analysis" alt="AI Code Analysis Flow" width="700px">
</div>

The system uses OpenAI's GPT-4 model to analyze code and provide suggestions. The analysis includes:

- ✅ Code style and formatting issues
- 🐛 Potential bugs and logic errors
- 🔒 Security vulnerabilities
- ⚡ Performance optimizations
- 🔄 Refactoring opportunities
- 📝 Documentation improvements

### Re-run Reviews

You can re-run previous reviews to get updated suggestions based on the latest AI model without having to re-submit the code.

### Severity Levels

<div align="center">
  
| Severity | Description | Visual Indicator |
|----------|-------------|------------------|
| **Low** | Minor improvements that don't affect functionality | 🟢 |
| **Medium** | Issues that may cause problems in some situations | 🟡 |
| **High** | Important issues that should be addressed | 🟠 |
| **Critical** | Critical bugs or security vulnerabilities | 🔴 |

</div>

## ⚙️ Running Tests

```bash
# Activate the virtual environment
pytest
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- OpenAI for their powerful language models
- FastAPI for the efficient API framework
- React and Material-UI for the frontend components

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/ManiTube11">ManiTube</a></sub>
</div> # My Project
