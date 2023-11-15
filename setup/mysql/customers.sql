CREATE TABLE customers (
  cust_id varchar(20) NOT NULL,
  contact varchar(30) NOT NULL,
  city varchar(30),
  balance int(10) NOT NULL,
  last_updated datetime NOT NULL,
  PRIMARY KEY (cust_id, contact)
);

