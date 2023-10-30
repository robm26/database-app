
CREATE DATABASE IF NOT EXISTS database_app;
USE database_app;

-- DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id varchar(20) NOT NULL,
  firstname varchar(20) NOT NULL,
  lastname varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  city varchar(30),
  dob varchar(10),
  credit_rating int(10) NOT NULL,
  PRIMARY KEY (user_id)
);


CREATE TABLE activity (
  account_id varchar(20) NOT NULL,
  event_id int(15) NOT NULL,
  event_category varchar(20) NOT NULL,
  amt int(15) NOT NULL,
  user_id varchar(20) NOT NULL,
  notes varchar(500),
  PRIMARY KEY (account_id,event_id),
  CONSTRAINT activity_fk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

