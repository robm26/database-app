CREATE TABLE customers (
  cust_id varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  city varchar(30),
  last_updated datetime NOT NULL,
  credit_rating int(10) NOT NULL,
  PRIMARY KEY (cust_id)
);

