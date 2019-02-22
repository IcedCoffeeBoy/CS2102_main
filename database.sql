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



