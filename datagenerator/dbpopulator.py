import sys
import psycopg2
import random
import itemdata
from faker import Faker


def db_populate(n=100, add_users=True, add_items=True, add_reviews=True):
    db = DBConnector(dbname="postgres", user="postgres", host="localhost", pw="123")

    # Instantiate data generator
    gen = DataGenerator()

    # --------- Add users ---------
    base_sql_insert = ("INSERT INTO Accounts (username, password, email, admin, status) VALUES "
                       + build_empty_sql_insert(5))
    for i in range(n):
        u = gen.create_user_profile()
        db.cursor.execute(base_sql_insert, (u["user"], 123, u["email"], False, "Active"))

    db.commit()

    # --------- Add items ---------
    # Obtain list of user IDs
    db.cursor.execute("SELECT accountid FROM Accounts")
    uid = [row[0] for row in db.cursor.fetchall()]

    # Obtain list of categories
    db.cursor.execute("SELECT * FROM categories")
    cats = [row[0] for row in db.cursor.fetchall()]

    # Generate and insert item entries
    base_sql_insert = ("INSERT INTO Items (title, description, price, seller, catname) VALUES "
                       + build_empty_sql_insert(5))
    for i in range(n):
        item = gen.create_item()
        itemdesc = "I'm selling {}. This is my {}. Hope you like it!".format(
            item["catname"].lower(), item["title"].lower())

        db.cursor.execute(base_sql_insert,
                          (item["title"], itemdesc, random.randint(1,1000), random.choice(uid), random.choice(cats)))

    db.commit()

    # --------- Add images ---------
    # Obtain list of item ids
    db.cursor.execute("SELECT DISTINCT itemid, title FROM Items")
    items = db.cursor.fetchall()

    # Generate and insert image entries
    base_sql_img_insert = "INSERT INTO Images (itemid, imgurl, imgno) VALUES " + build_empty_sql_insert(3)

    for i in range(n):
        idx = random.randint(0, len(items) - 1)
        item = items.pop(idx)

        for inum in range(random.randint(1, 4)):
            # Image titles are of the format (adj noun). The img url is created from the noun only.
            db.cursor.execute(base_sql_img_insert, (item[0], gen.create_imgurl(item[1].split(" ")[-1], inum), inum))

    db.commit()
    db.close()


def build_empty_sql_insert(n_attr):
    if n_attr <= 0:
        return "()"
    # Leave out the last extra ','
    return "(" + ("%s," * n_attr)[:-1] + ")"


class DBConnector:
    def __init__(self, dbname, user, host, pw):
        str_connection = "dbname = '{}' user = '{}' host = '{}' password = '{}' port = '5432'".format(dbname, user, host, pw)
        try:
            self.conn = psycopg2.connect(str_connection)
        except psycopg2.DatabaseError as ex:
            print("Connection to database failed: {}".format(ex))
            sys.exit(1)

        self.cursor = self.conn.cursor()

    def commit(self):
        '''
        Commits current changes and instantiates a new DB cursor
        '''
        self.conn.commit()
        self.cursor = self.conn.cursor()

    def close(self):
        self.cursor.close()
        self.conn.close()


class DataGenerator:
    def __init__(self):
        self.fake = Faker()

    def create_user_profile(self):
        gen = self.fake.simple_profile()
        return {"user": gen["username"],
                "email": gen["mail"]}

    def create_item(self):
        return {"catname": random.choice(itemdata.CATEGORIES),
                "title": (random.choice(itemdata.POLITE_ADJECTIVES).capitalize()
                          + " " + random.choice(itemdata.ANIMALS))}

    def create_imgurl(self, itemtype, imgno):
        return "https://loremflickr.com/400/240/" + itemtype + "?random=" + str(imgno)

