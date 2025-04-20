from setuptools import setup, find_packages

setup(
    name="ai-review",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "typer>=0.9.0",
        "rich>=13.6.0",
        "openai>=1.2.4",
        "pydantic>=2.4.2",
        "httpx>=0.25.0",
        "python-dotenv>=1.0.0",
    ],
    entry_points={
        "console_scripts": [
            "ai-review=ai_review.cli.main:app",
        ],
    },
    python_requires=">=3.8",
    author="AI Review Team",
    author_email="example@example.com",
    description="AI-powered code review assistant",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/ai-review",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
) 