/* ----- DROP TABLES ----- */
DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Items CASCADE;
DROP TABLE IF EXISTS Images CASCADE;



/* ----- CREATE TABLES ----- */
CREATE TABLE Accounts (
	accountId	SERIAL PRIMARY KEY,
	username	VARCHAR(16) NOT NULL UNIQUE,
	password	VARCHAR(500) NOT NULL,
	email		VARCHAR(30) NOT NULL UNIQUE,
	admin		BOOLEAN DEFAULT FALSE,
	status		VARCHAR(20) DEFAULT 'Active'
);

ALTER SEQUENCE Accounts_accountId_seq RESTART WITH 100;


CREATE TABLE Categories (
	-- catId		SERIAL PRIMARY KEY,
	-- catname		VARCHAR(80) UNIQUE
	catname		VARCHAR(80) PRIMARY KEY
);


CREATE TABLE Items (
	itemId		SERIAL PRIMARY KEY,
	title		VARCHAR(80),
	description	TEXT,
	price		NUMERIC(10,2),
	seller		INTEGER,
	timeListed	TIMESTAMP DEFAULT NOW(),
	bidEndTime	TIMESTAMP,
	-- catId		INTEGER,
	catname		VARCHAR(80),
	FOREIGN KEY (seller) REFERENCES Accounts(accountId),
	-- FOREIGN KEY (catId) REFERENCES Categories(catId)
	FOREIGN KEY (catname) REFERENCES Categories(catname)
);

ALTER SEQUENCE Items_itemId_seq RESTART WITH 1000000;


CREATE TABLE Images (
	imgURL		VARCHAR(267) PRIMARY KEY,
	itemId		INTEGER NOT NULL,
	FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);





/* ----- INSERT DATA ----- */
-- INSERT INTO Accounts(username, password, email)
-- VALUES ('qinjiang', 'qinjiang', 'qinjiang@gmail.com');

-- INSERT INTO Accounts(username, password, email)
-- VALUES ('perry', 'perry', 'perry@gmail.com');

-- INSERT INTO Accounts(username, password, email)
-- VALUES ('mingliang', 'mingliang',' mingliang@gmail.com');

-- INSERT INTO Accounts(username, password, email)
-- VALUES ('bowen', 'bowen', 'bowen@gmail.com');


INSERT INTO Categories(catname) VALUES ('Electronics');
INSERT INTO Categories(catname) VALUES ('Fashion');
INSERT INTO Categories(catname) VALUES ('Hobbies');
INSERT INTO Categories(catname) VALUES ('Home');


-- INSERT INTO Items(title, descr, price, accountId, catId)
-- VALUES ('MBP', 'MacBook Pro 15', 2000, 100, 1);

-- INSERT INTO Items(title, descr, price, accountId, catId)
-- VALUES ('iPhone X', 'iPhone X 2017', 999, 100, 1);


-- INSERT INTO Images(imgURL, itemId)
-- VALUES ('./public/images/mbp.jpg', 1000000);






/* ----- VIEW DATA ----- */
SELECT * FROM Accounts;
SELECT * FROM Categories;
SELECT * FROM Items;
SELECT * FROM Images;


/* Test for Item ON DELETE CASCADE to Images */
-- DELETE FROM Items WHERE itemId = 1000000;
-- SELECT * FROM Images;
