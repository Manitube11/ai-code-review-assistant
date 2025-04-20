import os
import sys
import json
from typing import Optional, List, Dict, Any
from pathlib import Path

import typer
from rich.console import Console
from rich.table import Table
from rich.syntax import Syntax
from rich.panel import Panel
from rich import print as rprint
import httpx

from ai_review.models.review import SeverityLevel

# Initialize Typer CLI app
app = typer.Typer(
    help="AI-powered code review tool",
    add_completion=False,
)

console = Console()


@app.command()
def review(
    path: str = typer.Argument(
        ".", help="File or directory to review"
    ),
    severity: SeverityLevel = typer.Option(
        SeverityLevel.LOW, help="Minimum severity level to report"
    ),
    format: str = typer.Option(
        "text", help="Output format (text, json, markdown)"
    ),
    api_url: str = typer.Option(
        None, help="Custom API URL (default: use local or environment variable)"
    ),
    recursive: bool = typer.Option(
        False, help="Recursively scan directories"
    ),
    ignore: List[str] = typer.Option(
        ["venv", "node_modules", ".git"], help="Directories to ignore"
    ),
):
    """Review code for issues and suggestions."""
    
    # Determine API URL
    api_url = api_url or os.getenv("AI_REVIEW_API_URL", "http://localhost:8000")
    
    # Check if path exists
    target_path = Path(path)
    if not target_path.exists():
        console.print(f"[bold red]Error:[/] Path '{path}' does not exist")
        raise typer.Exit(code=1)
    
    # Process files
    if target_path.is_file():
        files = [target_path]
    else:
        # Directory mode
        files = []
        if recursive:
            for file_path in target_path.rglob("*"):
                if _should_process_file(file_path, ignore):
                    files.append(file_path)
        else:
            for file_path in target_path.iterdir():
                if file_path.is_file() and _should_process_file(file_path, ignore):
                    files.append(file_path)
    
    if not files:
        console.print("[yellow]No files to review[/]")
        raise typer.Exit(code=0)
    
    # Review each file
    results = []
    with console.status(f"[bold green]Reviewing {len(files)} files..."):
        for file_path in files:
            try:
                result = _review_file(file_path, api_url, severity)
                if result:
                    results.append(result)
            except Exception as e:
                console.print(f"[bold red]Error reviewing {file_path}:[/] {str(e)}")
    
    # Display results
    if format == "json":
        print(json.dumps(results, default=str, indent=2))
    elif format == "markdown":
        _print_markdown_report(results)
    else:
        _print_text_report(results)


def _should_process_file(file_path: Path, ignore: List[str]) -> bool:
    """Check if file should be processed based on ignore patterns."""
    
    # Skip directories
    if file_path.is_dir():
        return False
    
    # Skip binary files and files without extensions
    if not file_path.suffix or file_path.suffix in [".pyc", ".so", ".dll", ".exe"]:
        return False
    
    # Check ignore patterns
    for pattern in ignore:
        if pattern in str(file_path):
            return False
    
    return True


def _review_file(file_path: Path, api_url: str, min_severity: SeverityLevel) -> Optional[Dict[str, Any]]:
    """Send file for review and return results."""
    
    try:
        # Read file content
        code = file_path.read_text(encoding="utf-8", errors="replace")
        
        # Call API
        response = httpx.post(
            f"{api_url}/review",
            json={
                "code": code,
                "file_path": str(file_path),
                "settings": {"min_severity": min_severity}
            },
            timeout=60.0
        )
        
        # Handle error
        if response.status_code != 200:
            console.print(f"[bold red]API Error ({response.status_code}):[/] {response.text}")
            return None
        
        return response.json()
    
    except Exception as e:
        console.print(f"[bold red]Error:[/] {str(e)}")
        return None


def _print_text_report(results: List[Dict[str, Any]]) -> None:
    """Print review results in text format."""
    
    total_issues = sum(len(result["suggestions"]) for result in results)
    
    if not total_issues:
        console.print("\n[bold green]✓ No issues found![/]")
        return
    
    console.print(f"\n[bold yellow]Found {total_issues} issues across {len(results)} files[/]\n")
    
    for result in results:
        if not result["suggestions"]:
            continue
        
        file_path = result["suggestions"][0]["file_path"] if result["suggestions"] else "Unknown"
        
        # Print file header
        console.print(f"[bold blue]File:[/] {file_path}")
        console.print(result["summary"])
        
        # Create table for suggestions
        table = Table(show_header=True, header_style="bold")
        table.add_column("Lines")
        table.add_column("Severity")
        table.add_column("Category")
        table.add_column("Message")
        
        for suggestion in result["suggestions"]:
            lines = f"{suggestion['line_start']}-{suggestion['line_end']}"
            severity_color = {
                "low": "green",
                "medium": "yellow",
                "high": "red",
                "critical": "bold red"
            }.get(suggestion["severity"], "white")
            
            table.add_row(
                lines,
                f"[{severity_color}]{suggestion['severity']}[/]",
                suggestion["category"],
                suggestion["message"]
            )
            
            if suggestion["suggested_fix"]:
                syntax = Syntax(
                    suggestion["suggested_fix"],
                    "python",
                    theme="monokai",
                    line_numbers=True,
                    start_line=suggestion["line_start"]
                )
                table.add_row("", "", "", Panel(syntax, title="Suggested Fix"))
        
        console.print(table)
        console.print("")


def _print_markdown_report(results: List[Dict[str, Any]]) -> None:
    """Print review results in markdown format."""
    
    total_issues = sum(len(result["suggestions"]) for result in results)
    
    if not total_issues:
        print("# Code Review Results\n\n✅ No issues found!")
        return
    
    print(f"# Code Review Results\n\n🔍 Found {total_issues} issues across {len(results)} files\n")
    
    for result in results:
        if not result["suggestions"]:
            continue
        
        file_path = result["suggestions"][0]["file_path"] if result["suggestions"] else "Unknown"
        
        print(f"## {file_path}\n\n{result['summary']}\n")
        
        for suggestion in result["suggestions"]:
            severity_marker = {
                "low": "ℹ️",
                "medium": "⚠️",
                "high": "🔴",
                "critical": "🚨"
            }.get(suggestion["severity"], "")
            
            print(f"### {severity_marker} {suggestion['category'].title()} (Lines {suggestion['line_start']}-{suggestion['line_end']})\n")
            print(f"**Severity:** {suggestion['severity'].upper()}\n")
            print(f"{suggestion['message']}\n")
            
            if suggestion["suggested_fix"]:
                print("#### Suggested Fix\n")
                print(f"```{file_path.split('.')[-1]}")
                print(suggestion["suggested_fix"])
                print("```\n")


if __name__ == "__main__":
    app() 