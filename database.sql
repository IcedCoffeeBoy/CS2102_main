/* ----- DROP TABLES ----- */
DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Items 	CASCADE;
DROP TABLE IF EXISTS Images CASCADE;
DROP TABLE IF EXISTS bids 	CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS qnas CASCADE;
DROP TABLE IF EXISTS relationships CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS viewhistory CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;

--------------Entity------------------------
CREATE TABLE Accounts (
	accountId	SERIAL PRIMARY KEY,
	username	VARCHAR(16) NOT NULL UNIQUE,
	password	VARCHAR(500) NOT NULL,
	email		VARCHAR(30) NOT NULL UNIQUE,
	admin		BOOLEAN DEFAULT FALSE,
	status		VARCHAR(20) DEFAULT 'Active'
);

ALTER SEQUENCE Accounts_accountId_seq RESTART WITH 100;

--------------Entity------------------------
CREATE TABLE Categories (
	catname		VARCHAR(80) PRIMARY KEY
);


--------------Entity------------------------
CREATE TABLE Items (
	itemId		SERIAL PRIMARY KEY,
	title		VARCHAR(80),
	description	TEXT,
	price		NUMERIC(10,2),
	seller		INTEGER,
	timeListed	TIMESTAMP DEFAULT NOW(),
	bidEndTime	TIMESTAMP,
	catname		VARCHAR(80),
	FOREIGN KEY (seller) REFERENCES Accounts,
	FOREIGN KEY (catname) REFERENCES Categories
);


ALTER SEQUENCE Items_itemId_seq RESTART WITH 1000000;

--------------Entity------------------------
create table if not exists images (
	imgurl varchar(256) primary key,
	itemid integer not null,
	foreign key (itemid) references items(itemid) on delete cascade   
);



-------------Relationship-----------------------
create table if not exists relationships (
	rid varchar(128) unique not null,
	seller integer not null,
	buyer integer not null,
	itemid integer not null,
	foreign key (seller) references accounts (accountid),
	foreign key (buyer) references accounts(accountid),
	foreign key (itemid) references items(itemid),
	primary key(seller, buyer, itemid),
	check(seller is distinct from buyer)
);


--------------Entity------------------------
create table if not exists messages (
	msgid serial primary key,
	userfrom integer,
	timestamp timestamp,
	rid varchar(128) not null,
	foreign key (userfrom) references accounts (accountid),
	foreign key (rid) references relationships(rid)
);

--------------Entity------------------------
create table if not exists transactions(
	transactionid serial primary key,
	dateStart date,
	dateEnd date,
	amount numeric(32, 2),
	rid varchar(128) not null
);

--------------Entity------------------------
create table if not exists reviews(
	reviewid serial primary key,
	itemid integer,
	transactionid integer,
	review text, 
	foreign key (itemid) references items(itemid),
	foreign key (transactionid) references transactions(transactionid)
);

--------------Entity------------------------
create table if not exists viewHistory(
	viewid serial primary key,
	itemid integer,
	timestamp timestamp,
	userid integer,
	foreign key (itemid) references items(itemid),
	foreign key (userid) references accounts(accountid)
);

--------------Entity------------------------
create table if not exists qnas(
	commentid serial primary key,
	itemid integer,
	userid integer,
	comment text, 
	date date,
	foreign key (itemid) references items(itemid),
	foreign key (userid) references accounts(accountid)
);

--------------Entity------------------------
create table if not exists bids (
	bidid integer primary key,
	userid integer not null,
	rid varchar(128) not null,
	timestamp timestamp,
	amount numeric(32, 2),
	foreign key (userid) references accounts(accountid) 
);


-------------Relationship-----------------------
create table if not exists blocks (
	blocker integer not null,
	blockee integer not null,
	primary key (blocker, blockee),
	foreign key (blocker) references accounts(accountid),
	foreign key (blockee) references accounts(accountid),
	check(blocker is distinct from blockee)
);

insert into accounts(username,password,email) values('1234','1234','dog@gmail.com');
insert into accounts(username,password,email) values('perry','wang','perrywang@gmail.com');

insert into categories values ('Animals'),('Electronic');


delete from items;
delete from images;
insert into items(title,description,price) values ('Good doggo','Dogs for sharing','99');
insert into images(itemid,imgurl) values (1000000 ,'https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all');
insert into items(title,description,price) values ('Cute cats', 'Cats for you to serve', '21');
insert into images(itemid,imgurl) values (1000001 ,'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=978&q=80');

select title, description, price, imgurl from items natural join images


