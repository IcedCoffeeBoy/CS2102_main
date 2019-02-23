create sequence accountsid_seq start 1000; 

create table accounts (
	accountid integer NOT NULL DEFAULT nextval('accountsid_seq') primary key,
	username varchar(16) not null unique,
	password varchar(16) not null,
	email varchar(30) not null unique,
	admin boolean default false
);

ALTER SEQUENCE accountsid_seq OWNED BY accounts.accountid;

insert into accounts(username,password,email) values('1234','1234','dog@gmail.com');
insert into accounts(username,password,email) values('perry','wang','perrywang@gmail.com');


create table items(
	itemid serial primary key,
	title varchar(80),
	description text, 
	price integer, 
	img varchar(200),
);

insert into items(title,description,price,img) values ('Good doggo','Dogs for sharing','99','https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all');
insert into items(title,description,price,img) values ('Cute cats', 'Cats for you to serve', '21', 'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=978&q=80');

