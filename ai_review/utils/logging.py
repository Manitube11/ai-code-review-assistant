import logging
import os
import sys
from logging.handlers import RotatingFileHandler


def setup_logger(name: str = __name__) -> logging.Logger:
    """
    Set up and configure logger with file and console output.
    
    Args:
        name: Name of the logger, usually __name__
        
    Returns:
        Configured logger instance
    """
    # Get log level from env var or default to INFO
    log_level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_name, logging.INFO)
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    
    # Avoid adding handlers multiple times
    if logger.hasHandlers():
        logger.handlers.clear()
    
    # Log format
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (if LOG_FILE env var is set)
    log_file = os.getenv("LOG_FILE")
    if log_file:
        try:
            file_handler = RotatingFileHandler(
                log_file, 
                maxBytes=10 * 1024 * 1024,  # 10 MB
                backupCount=5
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            logger.error(f"Failed to set up file logging: {e}")
    
    return logger 