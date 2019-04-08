import os
from dotenv import load_dotenv
from dbpopulator import db_populate


if __name__=="__main__":
    load_dotenv(verbose=True)
    DATABASE_URL = os.getenv('DATABASE_URL')
    path = "../database.sql"
    db_populate(10, script_path=path)

