import os
from sqlalchemy.engine.url import URL

class Config:
    SECRET_KEY = os.urandom(32)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or URL(
        drivername='postgresql',
        username=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        database=os.getenv('DB_NAME')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False