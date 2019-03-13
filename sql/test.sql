truncate table transactions, reviews;

insert into transactions(transactionid, dateStart, dateEnd, amount, rid)
values (1, '1-1-2019', '1-3-2019', 100.00, 1), (2, '3-1-2019', '4-1-2019', 200.02, 2);

insert into reviews(reviewid, itemid, transactionid, review)
values (1, 1000000, 1, 'Testing review text!'), (2, 1000000, 2, 'More review text');

