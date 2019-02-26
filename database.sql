--------------Entity------------------------
create sequence accountsid_seq start 1000; 

create table if not exists accounts (
	accountid integer NOT NULL DEFAULT nextval('accountsid_seq') primary key,
	username varchar(16) not null unique,
	password varchar(16) not null,
	email varchar(30) not null unique,
	admin boolean default false,
	status integer not null
);

ALTER SEQUENCE accountsid_seq OWNED BY accounts.accountid;

--------------Entity------------------------
create table if not exists items(
	itemid serial primary key,
	title varchar(80),
	description text, 
	price integer,
	seller integer,
	bidEndDate date,
	catname varchar(80),
	unique(title,description,price,img),
	foreign key (seller) references accounts(accountid),
	foreign key (catname) references categories(catname)
);

--------------Entity------------------------
create table if not exists categories (
catname varchar(80) primary key
);

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
)


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
create table if not exists reviews(
	reviewid serial primary key,
	itemid integer,
	transactionid integer,
	review text, 
	foreign key (itemid) references items(itemid),
	foreign key (transactionid) references transactions(transactionid)
)

--------------Entity------------------------
create table if not exists viewHistory(
	viewid serial primary key,
	itemid integer,
	timestamp timestamp,
	userid integer,
	foreign key (itemid) references items(itemid),
	foreign key (userid) references accounts(accountid)
)

--------------Entity------------------------
create table if not exists qnas(
	commentid serial primary key,
	itemid integer,
	userid integer,
	comment text, 
	date date,
	foreign key (itemid) references items(itemid),
	foreign key (userid) references accounts(accountid)
)

--------------Entity------------------------
create table if not exists bids (
	bidid integer primary key,
	userid integer not null,
	rid varchar(128) not null,
	timestamp timestamp,
	amount numeric(32, 2),
	foreign key (userid) references accounts(accountid) 
);

--------------Entity------------------------
create table if not exists transactions(
	transactionid serial primary key,
	dateStart date,
	dateEnd date,
	amount numeric(32, 2),
	rid varchar(128) not null
);


-------------Relationship-----------------------
create table blocks (
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

insert into items(title,description,price,img) values ('Good doggo','Dogs for sharing','99','https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all');
insert into items(title,description,price,img) values ('Cute cats', 'Cats for you to serve', '21', 'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=978&q=80');




