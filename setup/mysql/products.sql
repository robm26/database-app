CREATE TABLE products (
  prod_id varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  category varchar(20) NOT NULL,
  list_price decimal(6,2) NOT NULL,
  image_url varchar(80),
  review_rating decimal(4,2),
  last_updated date NOT NULL,
  PRIMARY KEY (prod_id)
);

