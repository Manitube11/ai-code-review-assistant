import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add project root to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from ai_review.db.models import Base
from ai_review.db.database import get_db


@pytest.fixture(scope="function")
def db_engine():
    """Create a test database engine."""
    # Use in-memory SQLite for testing
    test_db_url = "sqlite:///:memory:"
    engine = create_engine(test_db_url)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a test database session."""
    Session = sessionmaker(bind=db_engine)
    session = Session()
    yield session
    session.close()


@pytest.fixture
def override_get_db(db_session):
    """Override the get_db dependency for testing."""
    def _get_db():
        try:
            yield db_session
        finally:
            pass
    return _get_db 