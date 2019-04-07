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
drop table if exists likes cascade;


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
	sold        INTEGER DEFAULT 0,
	loanStart	TIMESTAMP default now(),
	loanEnd		TIMESTAMP default now() + interval '168 hour',
	location	VARCHAR(128) default '4 Engineering Drive 4, Singapore 117585',
	views		INTEGER DEFAULT 0,
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
	msg text,
	foreign key (userfrom) references accounts (accountid),
	foreign key (rid) references relationships(rid)
);

--------------Entity------------------------
create table if not exists transactions(
	transactionid serial primary key,
	dateStart timestamp not null,
	dateEnd timestamp not null,
	amount numeric(32, 2) not null,
	rid integer not null unique
);

--------------Entity------------------------
create table if not exists reviews(
	reviewid serial primary key,
	reviewerid integer,
	revieweeid integer,
	transactionid integer not null,
	review text not null, 
	star integer not null,
	timestamp timestamp default now(),
	foreign key (transactionid) references transactions(transactionid),
	unique(reviewerid, transactionid)
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

alter sequence viewHistory_viewid_seq restart with 10;

--------------Entity------------------------
create table if not exists qnas(
	commentid serial primary key,
	itemid integer,
	userid integer,
	comment text, 
	timestamp timestamp default now(),
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

--------------Entity------------------------
create table if not exists likes (
	likeid serial primary key,
	likerid integer not null,
	itemid integer not null,
	timestamp timestamp default now(),
	foreign key (likerid) references accounts(accountid),
	foreign key (itemid) references items on delete cascade,
	unique(likerid, itemid)
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

------------- Triggers-------------------------


------Trigger for inserting new views-------------
create or replace function checkSelleritem()
returns trigger as $$
declare itemseller integer; 
begin 
	itemseller := (select seller from items where items.itemid=new.itemid);
	if(new.userid = itemseller) then return null; end if;
	return new;
end;
$$ language plpgsql;

create trigger viewhistorytrigger
before insert or update on viewhistory 
for each row
execute procedure checkSelleritem();

------Trigger for inserting new bids-------------
create or replace function checkBids()
returns trigger as $$ 
declare itemseller integer; declare itemprice integer; declare lastbidtime timestamp;
begin
	itemseller := (select i.seller from items i join relationships r on i.itemid = r.itemid where r.rid = new.rid);
	if (new.userid = itemseller) then raise exception 'Please do not bid your own item'; return null; end if;
	itemprice  := (select price from items i  join relationships r on i.itemid = r.itemid where r.rid = new.rid);
	if (new.amount <= itemprice) then raise exception 'Please bid higher than current price'; return null; end if;
	lastbidtime:= (select timestamp from bids where rid = new.rid order by timestamp desc limit 1);
	if (lastbidtime + interval '00:00:20' > now()) then raise exception 'Please bid after 20 seconds'; return null; end if;
	return new;
end;
$$ language plpgsql;

create trigger biddingtrigger
before insert or update on bids
for each row
execute procedure checkBids();

------Trigger for inserting new comments-------------
create or replace function checkComments()
returns trigger as $$ 
declare lastcommenttime timestamp;
begin
	lastcommenttime:= (select timestamp from comment where itemid = new.itemid and userid = new.userid order by timestamp desc limit 1);
	if (lastcommenttime + interval '00:00:20' > now()) then raise exception 'Please comment after 20 seconds'; return null; end if;
	return new;
end;
$$ language plpgsql;

create trigger commenttrigger
before insert or update on qnas
for each row
execute procedure checkComments();


---------------------------------- Function ----------------------------------------------
create or replace function insertBidshortcut (newBuyer integer,bidPrice numeric, newitemid integer)
returns integer as $$
declare newSeller integer; newrid integer;
begin 
	newSeller := (select seller from Items where Items.itemid= newitemid);
	insert into relationships(seller,buyer,itemid) values (newSeller,newBuyer,newitemid) on conflict do nothing; 
	newrid := (select rid from relationships where buyer=newBuyer and itemid=newitemid);
	insert into bids(userid,rid,amount) values (newBuyer, newrid,bidPrice);
	update Items set price = bidPrice where Items.itemid = newitemid;
	return newrid;
	exception 
	when others then
		raise exception 'Please bid after 20 seconds';
		return newrid;
end;
$$ language plpgsql;

create or replace function insertTransactionShortcut (item integer)
returns integer as $$ 
declare newseller integer; newbuyer integer;declare newrid integer; newamount integer; datestart timestamp; dateend timestamp;
begin
	newseller := (select seller from items where itemid = item);
	newbuyer  := (select b.userid from bids b join relationships r on b.rid = r.rid and r.itemid = item order by b.amount desc limit 1);
	newamount := (select price from items where itemid = item);
	datestart := (select loanstart from items where itemid = item);
	dateend   := (select loanend   from items where itemid = item);
	if newbuyer = null then
		return 0;
	end if;
	newrid := (select rid from relationships where buyer = newbuyer and seller = newseller and itemid = item);
	update Items set sold = newrid where itemid = item;
	insert into transactions(datestart, dateend, amount, rid) values (datestart, dateend, newamount,newrid);
	return newrid;
end;
$$ language plpgsql;

create or replace function insertReviewShortcutB (star integer, review text, tid integer, reviewer integer)
returns integer as $$ 
declare reviewee integer;
begin
	reviewee := (select seller from transactions natural join relationships where tid = transactionid);
	insert into reviews(reviewerid, revieweeid, transactionid, review, star) values (reviewer, reviewee, tid, review, star);
	return (select reviewid from reviews where transactionid = tid and reviewerid = reviewer);
end;
$$ language plpgsql;

create or replace function insertReviewShortcutS (star integer, review text, tid integer, reviewer integer)
returns integer as $$ 
declare reviewee integer;
begin
	reviewee := (select buyer from transactions natural join relationships where tid = transactionid);
	insert into reviews(reviewerid, revieweeid, transactionid, review, star) values (reviewer, reviewee, tid, review, star);
	return (select reviewid from reviews where transactionid = tid and reviewerid = reviewer);
end;
$$ language plpgsql;

DROP function if exists insertmessageshortcut(integer,integer,integer,integer,text);

create or replace function insertMessageShortcut (fromId integer, buyerId integer, sellerId integer, relItemId integer, msgContent text)
returns integer as $$
declare relId integer;
begin
	insert into relationships(seller,buyer,itemid) values (sellerId, buyerId, relItemId) on conflict do nothing; 
	relId := (select rid from relationships where buyer = buyerId and seller = sellerId);
	insert into messages(userfrom, rid, msg) values (fromId, relId, msgContent);
	return relId;
end;
$$ language plpgsql;


------------------------Insert mocking data -------------------------
insert into categories values ('Animals'),('Electronic'),('Automobile'),('Household') ON CONFLICT DO NOTHING;
insert into accounts values (201,1234,'$2a$10$0OwHhC5Pyu4E9aOwjQpSG.FdrgZa2wN.6FJFRusdgAt6OuvhO50gu','lol@me.com');
insert into accounts values (202,'bob','$2a$10$0OwHhC5Pyu4E9aOwjQpSG.FdrgZa2wN.6FJFRusdgAt6OuvhO50gu','bob@me.com');
update accounts set password = '$2a$10$0OwHhC5Pyu4E9aOwjQpSG.FdrgZa2wN.6FJFRusdgAt6OuvhO50gu';

-------------------------------- Complex query ----------------------------------------
select r1.itemid,title,description,price,imgurl, count(distinct rid), count(distinct viewid) 
from (items natural join images) as r1 
left join relationships on r1.itemid=relationships.itemid 
left join viewhistory on r1.itemid = viewhistory.itemid
where imgno=0
group by r1.itemid,title,description,price,imgurl
order by count(rid) desc, count(viewid) desc;
----------------------------------------------------------------------------------------

