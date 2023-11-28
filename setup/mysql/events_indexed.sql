CREATE TABLE events_indexed (
  event_id varchar(20) NOT NULL,
  product varchar(30) NOT NULL,
  rating int(10) NOT NULL,
  city varchar(30),
  status varchar(30),
  balance int(10),
  last_updated datetime NOT NULL,
  PRIMARY KEY (event_id),
  INDEX idx1 (product, rating),
  INDEX idx2 (city, status),
  INDEX idx3 (status, last_updated)
);

