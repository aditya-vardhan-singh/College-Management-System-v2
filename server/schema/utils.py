### IMPORTS ###

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os


### ENVIRONMENT VARIABLES ###

load_dotenv()

DBUSER = os.getenv('DBUSER')
DBPASS = os.getenv('DBPASS')
DBHOST = os.getenv('DBHOST')
DBPORT = os.getenv('DBPORT')
DATABASE = os.getenv('DATABASE')


### DB ENGINE SETUP ###

database_url = f'postgresql://{DBUSER}:{DBPASS}@{DBHOST}:{DBPORT}/{DATABASE}'
engine = create_engine(database_url)


### ORM SESSION ###

class Base(DeclarativeBase):
    pass

Session = sessionmaker(bind=engine)
