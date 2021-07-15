DROP TABLE IF EXISTS TCSwap_user CASCADE;

DROP TYPE IF EXISTS userRole CASCADE;
CREATE TYPE userRole AS ENUM ('player', 'store owner');

CREATE TABLE TCSwap_user (
	username VARCHAR(255) PRIMARY KEY,
	pass VARCHAR(255) NOT NULL CHECK (LENGTH(pass) > 0),
	first_name VARCHAR(255) NOT NULL CHECK (LENGTH(first_name) > 0),
	last_name VARCHAR(255) NOT NULL CHECK (LENGTH(last_name) > 0),
	role userRole NOT NULL DEFAULT 'player'  
);


DROP TYPE IF EXISTS offerStatus CASCADE;
CREATE TYPE offerStatus AS ENUM ('accepted', 'rejected', 'pending');

DROP TABLE IF EXISTS offer CASCADE;
CREATE TABLE offer (
	id SERIAL PRIMARY KEY,
	requestor VARCHAR(255) NOT NULL CHECK (LENGTH(requestor) > 0),
	decider VARCHAR(255) NOT NULL CHECK (LENGTH(decider) > 0),
	status offerStatus DEFAULT 'pending',
	CONSTRAINT requestor_con
      FOREIGN KEY(requestor) 
	  REFERENCES TCSwap_user(username)
	  ON DELETE CASCADE,
	CONSTRAINT decider_con
      FOREIGN KEY(decider) 
	  REFERENCES TCSwap_user(username)
	  ON DELETE CASCADE
);
 
DROP TABLE IF EXISTS card CASCADE;
CREATE TABLE card (
	id SERIAL PRIMARY KEY,
	card_owner VARCHAR(255) NOT NULL CHECK (LENGTH(card_owner) > 0),
	card_identifier VARCHAR(255) NOT NULL,
	game VARCHAR(255) NOT NULL,
	card_condition VARCHAR(255) NOT NULL,
	num_owned INTEGER DEFAULT 0,
	CONSTRAINT card_owner_con
      FOREIGN KEY(card_owner) 
	  REFERENCES TCSwap_user(username)
	  ON DELETE CASCADE
);

DROP TYPE IF EXISTS offer_side_type CASCADE;
CREATE TYPE offer_side_type AS ENUM ('requestor', 'decider');

DROP TABLE IF EXISTS offer_item CASCADE;
CREATE TABLE offer_item (
	id SERIAL PRIMARY KEY,
	card_id INTEGER NOT NULL,
	offer_id INTEGER NOT NULL,
	offer_side offer_side_type NOT NULL,
	CONSTRAINT card_con
      FOREIGN KEY(card_id) 
	  REFERENCES card(id)
	  ON DELETE CASCADE,
	CONSTRAINT offer_con
      FOREIGN KEY(offer_id) 
	  REFERENCES offer(id)
	  ON DELETE CASCADE
);

DROP TABLE IF EXISTS store CASCADE;
CREATE TABLE store (
	store_name VARCHAR(255) PRIMARY KEY,
	store_owner VARCHAR(255) NOT NULL CHECK (LENGTH(store_owner)>0),
	featured_card_id INTEGER,
	CONSTRAINT featured_card_con
      FOREIGN KEY(featured_card_id) 
	  REFERENCES card(id)
	  ON DELETE CASCADE,
	CONSTRAINT store_owner_con
      FOREIGN KEY(store_owner) 
	  REFERENCES TCSwap_user(username)
	  ON DELETE CASCADE
);
