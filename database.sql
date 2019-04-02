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
	username	VARCHAR(32) NOT NULL UNIQUE,
	password	VARCHAR(500) NOT NULL,
	email		VARCHAR(128) NOT NULL UNIQUE,
	datejoined  date default CURRENT_DATE,
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
	sold        BOOLEAN DEFAULT false,
	FOREIGN KEY (seller) REFERENCES Accounts,
	FOREIGN KEY (catname) REFERENCES Categories
);


ALTER SEQUENCE Items_itemId_seq RESTART WITH 1000000;

--------------Entity------------------------
CREATE TABLE Images (
	imgURL		VARCHAR(256),
	itemId		INTEGER NOT NULL,
	imgNo		INTEGER DEFAULT 0,
	PRIMARY KEY (itemId, imgNo),
	FOREIGN KEY (itemId) REFERENCES Items ON DELETE CASCADE
);

-------------Relationship-----------------------
create table if not exists relationships (
	rid serial primary key,
	seller integer not null,
	buyer integer not null,
	itemid integer not null,
	foreign key (seller) references accounts (accountid),
	foreign key (buyer) references accounts(accountid),
	foreign key (itemid) references items on delete cascade,
	unique(seller,buyer,itemid),
	check(seller is distinct from buyer)
);

ALTER SEQUENCE relationships_rid_seq RESTART WITH 1000;

--------------Entity------------------------
create table if not exists messages (
	msgid serial primary key,
	userfrom integer,
	timestamp timestamp default now(),
	rid integer,
	foreign key (userfrom) references accounts (accountid),
	foreign key (rid) references relationships(rid)
);

--------------Entity------------------------
create table if not exists transactions(
	transactionid serial primary key,
	dateStart date default CURRENT_DATE,
	dateEnd date default CURRENT_DATE + 7,
	amount numeric(32, 2),
	rid integer not null
);

--------------Entity------------------------
create table if not exists reviews(
	reviewid serial primary key,
	itemid integer,
	transactionid integer,
	review text, 
	foreign key (itemid) references items on delete cascade,
	foreign key (transactionid) references transactions(transactionid)
);

--------------Entity------------------------
create table if not exists viewHistory(
	viewid serial primary key,
	itemid integer,
	timestamp timestamp default now(),
	userid integer,
	foreign key (itemid) references items on delete cascade,
	foreign key (userid) references accounts(accountid)
);

--------------Entity------------------------
create table if not exists qnas(
	commentid serial primary key,
	itemid integer,
	userid integer,
	comment text, 
	date date,
	foreign key (itemid) references items on delete cascade,
	foreign key (userid) references accounts(accountid)
);

--------------Entity------------------------
create table if not exists bids (
	bidid serial primary key,
	userid integer not null,
	rid integer not null,
	timestamp timestamp default now(),
	amount numeric(32, 2),
	foreign key (userid) references accounts(accountid)
);

alter sequence bids_bidid_seq restart with 10000; 


-------------Relationship-----------------------
create table if not exists blocks (
	blocker integer not null,
	blockee integer not null,
	primary key (blocker, blockee),
	foreign key (blocker) references accounts(accountid),
	foreign key (blockee) references accounts(accountid),
	check(blocker is distinct from blockee)
);

------------- Triggers-------------------------


------Trigger for inserting new views-------------
create or replace function checkSelleritem()
returns trigger as $$
declare itemseller integer; 
begin 
	itemseller := (select seller from items where items.itemid=new.itemid);
	raise exception 'seller %',new.itemid ;
	if(new.userid = itemseller) then raise exception 'same'; end if;
	return new;
end;
$$ language plpgsql;

create trigger viewhistorytrigger
before insert or update on viewhistory
for each row
execute procedure checkSelleritem();

drop trigger viewhistorytrigger on viewhistory;

select * from items;
select * from viewhistory;
select seller from items where items.itemid=1000001;

--insert into viewhistory(itemid,userid) values (1000001,101);


--create or replace function insertBidfunc()
--returns trigger as $$
--declare newSeller integer; newBuyer integer; newrid integer;
--begin 
--	newBuyer := new.userid;
--	newSeller := (select seller from Items where Items.itemid = new.itemid);
--	insert into relationships(seller,buyer,itemid) values (newSeller,newBuyer,new.itemid);
--	newrid := (select rid from relationships where seller=newSeller and buyer=newBuyer and relationships.itemid=new.itemid);
--	update Items set price = new.amount where Items.itemid = new.itemid;
--	insert into bids(userid,itemid,rid,amount) values (newBuyer,new.itemid,newrid,new.amount);
--	return null;
--end;
--$$ language plpgsql;
--
--
--ALTER table bids disable trigger insertbid;
--create trigger insertBid 
--before insert or update on bids 
--for each row
--execute procedure insertBidfunc();



--insert into bids(userid,itemid,amount) values (125,1000000,1000.00);
--insert into relationships(seller,buyer,itemid) values (101,123,1000000);
--select  * from relationships;
--select * from bids;
--select rid from relationships where buyer=123 and itemid=1000000;

create or replace function insertBidshortcut (newBuyer integer,bidPrice numeric, newitemid integer)
returns integer as $$
declare newSeller integer; newrid integer;
begin 
	newSeller := (select seller from Items where Items.itemid= newitemid);
	insert into relationships(seller,buyer,itemid) values (newSeller,newBuyer,newitemid) on conflict do nothing; 
	newrid := (select rid from relationships where buyer=newBuyer and itemid=newitemid);
	update Items set price = bidPrice where Items.itemid = newitemid;
	insert into bids(userid,rid,amount) values (newBuyer, newrid,bidPrice);
	return newrid;
end;
$$ language plpgsql;

create or replace function insertTransactionShortcut (item integer)
returns integer as $$ 
declare newseller integer; newbuyer integer;declare newrid integer; newamount integer;
begin
	newseller := (select seller from items where itemid = item);
	newbuyer  := (select b.userid from bids b join relationships r on b.rid = r.rid and r.itemid = item order by b.amount desc limit 1);
	newamount := (select price from items where itemid = item);
	if newbuyer = null then
		return 0;
	end if;
	newrid := (select rid from relationships where buyer = newbuyer and seller = newseller and itemid = item);
	update Items set sold = true where itemid = item;
	insert into transactions(amount, rid) values (newamount,newrid);
	return newrid;
end;
$$ language plpgsql;



 
select * from viewhistory;
select * from relationships;

--select * from bids;
--select * from relationships;
--select * from items;
--
--insert into bids(userid,,amount,)

-------------------------------------------------


delete from relationships;


insert into categories values ('Animals'),('Electronic'),('Automobile') ON CONFLICT DO NOTHING;

-- delete from items;
-- delete from images;

 insert into accounts values (110,1234,'$2a$10$0OwHhC5Pyu4E9aOwjQpSG.FdrgZa2wN.6FJFRusdgAt6OuvhO50gu','lol@me.com');
-- insert into items(title,description,price,seller) values ('Good doggo','Dogs for sharing','99',100);
-- insert into images(itemid,imgurl) values (1000000 ,'https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all');
-- insert into items(title,description,price,seller) values ('Cute cats', 'Cats for you to serve', '21',100);
-- insert into images(itemid,imgurl) values (1000001 ,'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=978&q=80');

select * from accounts;
select * from items;
select * from images;

SELECT * FROM (Items NATURAL JOIN Images) INNER JOIN Accounts on Items.seller = Accounts.accountid
WHERE seller = 100 AND imgno = 0
ORDER BY timeListed desc;

-------------------------------- Complex query ----------------------------------------
select r1.itemid,title,description,price,imgurl, count(distinct rid), count(distinct viewid) 
from (items natural join images) as r1 
left join relationships on r1.itemid=relationships.itemid 
left join viewhistory on r1.itemid = viewhistory.itemid
where imgno=0
group by r1.itemid,title,description,price,imgurl
order by count(rid) desc, count(viewid) desc;
----------------------------------------------------------------------------------------



