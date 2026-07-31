import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Configure Logging
logger = logging.getLogger("backend.database")
logging.basicConfig(level=logging.INFO)

# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

# Database Connection Credentials from Environment
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "dna_analysis_db")

DEFAULT_MYSQL_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}" if DB_PASS else f"mysql+pymysql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

def auto_create_mysql_database():
    """Ensures MySQL database exists before SQLAlchemy engine connects."""
    try:
        import pymysql
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            port=int(DB_PORT)
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` DEFAULT CHARACTER SET utf8mb4;")
        conn.commit()
        conn.close()
        logger.info(f"Ensured MySQL database '{DB_NAME}' exists on {DB_HOST}:{DB_PORT}")
    except Exception as e:
        logger.warning(f"Could not auto-create MySQL database via PyMySQL: {e}")

def create_db_engine():
    """
    Connects to MySQL via PyMySQL after ensuring DB exists.
    If MySQL is unreachable, falls back cleanly to SQLite for seamless local execution.
    """
    auto_create_mysql_database()

    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600
        )
        with engine.connect() as conn:
            pass
        logger.info("Successfully connected to MySQL database.")
        return engine
    except Exception as e:
        logger.warning(f"Unable to connect to MySQL database ({e}). Falling back to SQLite for local development.")
        sqlite_url = "sqlite:///./dna_analysis_db.db"
        engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False}
        )
        logger.info(f"Connected to fallback SQLite database at {sqlite_url}")
        return engine

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
