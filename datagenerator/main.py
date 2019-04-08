import os
from dotenv import load_dotenv
from dbpopulator import db_populate


if __name__=="__main__":
    #Set HEROKU_SERVER to True to edit heroku postgresql
    HEROKU_SERVER = False

    load_dotenv(verbose=True)
    DATABASE_URL = os.getenv('DATABASE_URL')
    path = "../database.sql"
    if(HEROKU_SERVER):
        db_populate(10, script_path=path, url=DATABASE_URL)
    else:
        db_populate(10, script_path=path)

