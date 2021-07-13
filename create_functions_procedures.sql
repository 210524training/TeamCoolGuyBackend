-----------------------------------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS registerPlayer;
CREATE PROCEDURE registerPlayer(
	username_in VARCHAR(255),
	password_in VARCHAR(255),
	first_name_in VARCHAR(255),
	last_name_in VARCHAR(255)
)
LANGUAGE SQL
AS $$
	INSERT INTO TCSwap_user(username, pass, first_name, last_name)
	VALUES (username_in, password_in, first_name_in, last_name_in);
 $$;

--CALL registerPlayer('bob99','pass','robert','young');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS registerStoreOwner;
CREATE PROCEDURE registerStoreOwner(
	username_in VARCHAR(255),
	password_in VARCHAR(255),
	first_name_in VARCHAR(255),
	last_name_in VARCHAR(255)
)
LANGUAGE SQL
AS $$
	INSERT INTO TCSwap_user(username, pass, first_name, last_name, role)
	VALUES (username_in, password_in, first_name_in, last_name_in, 'store owner');
 $$;

--CALL registerStoreOwner('billyman123','pass','buffalo','bill');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS verifyLogin;
CREATE FUNCTION  verifyLogin(
	username_in VARCHAR(255),
	pass_in VARCHAR(255)
)
RETURNS TABLE (username VARCHAR(255) , pass VARCHAR(255),first_name VARCHAR(255),last_name VARCHAR(255),role userRole)
LANGUAGE SQL
AS $$
	SELECT username,pass,first_name,last_name,role
	FROM TCSwap_user
	WHERE TCSwap_user.username = username_in AND TCSwap_user.pass = pass_in;
 $$;

-- SELECT * FROM verifyLogin('bob99', 'pass');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS addUserCard;
CREATE PROCEDURE addUserCard(
	card_owner_in VARCHAR(255),
	card_identifier_in VARCHAR(255),
	game_in VARCHAR(255),
	card_condition_in VARCHAR(255)
)
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	IF ((SELECT count(*) FROM card WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in)>0) THEN 
		UPDATE card
		SET num_owned = num_owned +1
		WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in;
	ELSE 
		INSERT INTO card(card_owner, card_identifier, game, card_condition, num_owned)
		VALUES (card_owner_in, card_identifier_in, game_in, card_condition_in, 1);
	END IF;
END 
 $$;

--CALL addUserCard('bob99','Blue-Eyes Alternative Ultimate Dragon','Yu-Gi-Oh!','good');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getUserCards;
CREATE FUNCTION  getUserCards(
	username_in VARCHAR(255)
)
RETURNS TABLE (id INTEGER ,card_identifier VARCHAR(255), game VARCHAR(255), card_condition VARCHAR(255), num_owned INTEGER)
LANGUAGE SQL
AS $$
	SELECT id, card_identifier, game, card_condition, num_owned
	FROM card
	JOIN TCSwap_user ON (TCSwap_user.username = card.card_owner)
	WHERE TCSwap_user.username = username_in;;
 $$;

--SELECT * from getUserCards('bob99');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS removeUserCard;
CREATE PROCEDURE removeUserCard(
	card_owner_in VARCHAR(255),
	card_identifier_in VARCHAR(255),
	card_condition_in VARCHAR(255)
)
LANGUAGE 'plpgsql'
AS $$
BEGIN 
	IF ((SELECT count(*) FROM card WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in)>0) THEN 
		
		IF ((SELECT num_owned FROM card WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in LIMIT 1)<=1) THEN 
			DELETE FROM card
			WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in;
		ELSE
			UPDATE card 
			SET num_owned = num_owned - 1
			WHERE card_owner = card_owner_in AND card_identifier = card_identifier_in AND card_condition = card_condition_in;
		END IF;
	END IF;
END 
$$;

--CALL removeUserCard('bob99','Meklord Army of Skiel','bad');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS createOffer;
CREATE PROCEDURE createOffer(
	requestor_in VARCHAR(255),
	decider_in VARCHAR(255)
)
LANGUAGE SQL
AS $$
	INSERT INTO offer(requestor, decider)
	VALUES (requestor_in, decider_in);
$$;

--CALL createOffer('charles99', 'bob99');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS addToOffer;
CREATE PROCEDURE addToOffer(
	offer_id_in INTEGER,
	card_id_in INTEGER,
	offer_side_in offer_side_type
)
LANGUAGE 'plpgsql'
AS $$
DECLARE 
	card_owner_in VARCHAR(255);
BEGIN
	
	IF (offer_side_in='requestor') THEN
		SELECT requestor 
		INTO card_owner_in 
		FROM offer 
		WHERE id = offer_id_in
		LIMIT 1;
	ELSE
		SELECT decider
		INTO card_owner_in 
		FROM offer 
		WHERE id = offer_id_in
		LIMIT 1;
	END IF;
	
	IF ((SELECT count(*) FROM card WHERE id = card_id_in AND card_owner = card_owner_in )>0) THEN
		INSERT INTO offer_item (offer_id, card_id, offer_side)
		VALUES (offer_id_in, card_id_in,offer_side_in);
	END IF;
END;
$$;

--CALL addToOffer(1,5,'requestor');
--CALL addToOffer(1,2,'decider');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS removeFromOffer;
CREATE PROCEDURE removeFromOffer(
	offer_item_id_in INTEGER
)
LANGUAGE SQL
AS $$
	DELETE FROM offer_item
	WHERE id = offer_item_id_in;
$$;

--CALL removeFromOffer(2);

-----------------------------------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS alterOfferStatus;
CREATE PROCEDURE alterOfferStatus(
	offer_id_in INTEGER,
	status_in offerStatus
)
LANGUAGE SQL
AS $$
	UPDATE offer
	SET status = status_in
	WHERE id = offer_id_in;
$$;

--CALL alterOfferStatus(1,'rejected');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS createStore;
CREATE PROCEDURE createStore(
	store_owner_in VARCHAR(255),
	store_name_in VARCHAR(255)
)
LANGUAGE SQL
AS $$
	INSERT INTO store(store_owner, store_name)
	VALUES (store_owner_in, store_name_in);
 $$;

--CALL createStore('bob99','robert's emporium of cards');

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS setFeatured;
CREATE PROCEDURE setFeatured(
	store_name_in VARCHAR(255),
	featured_card_id_in INTEGER
)
LANGUAGE SQL
AS $$
	UPDATE store
	SET featured_card_id = featured_card_id_in
	WHERE store_name = store_name_in;
$$;

--CALL setFeatured('robert's emporium of cards',1)

-----------------------------------------------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS unSetFeatured;
CREATE PROCEDURE unSetFeatured(
	store_name_in VARCHAR(255)
)
LANGUAGE SQL
AS $$
	UPDATE store
	SET featured_card_id = NULL
	WHERE store_name = store_name_in;
$$;

--CALL unSetFeatured('robert`s emporium of cards');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getStores;
CREATE FUNCTION  getStores(
)
RETURNS TABLE (	store_owner VARCHAR(255), store_name VARCHAR(255))
LANGUAGE SQL
AS $$
	SELECT store_owner, store_name 
	FROM store;
 $$;

--SELECT * from getStores();

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getUserStores;
CREATE FUNCTION  getUserStores(
	store_owner_in VARCHAR(255)
)
RETURNS TABLE (	store_owner VARCHAR(255), store_name VARCHAR(255))
LANGUAGE SQL
AS $$
	SELECT store_owner, store_name 
	FROM store
	WHERE store_owner = store_owner_in;
 $$;

-- SELECT * from getUserStores('bob99');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getUserOffers;
CREATE FUNCTION  getUserOffers(
	username_in VARCHAR(255)
)
RETURNS TABLE (id INTEGER, requestor VARCHAR(255), decider VARCHAR(255),status offerStatus)
LANGUAGE SQL
AS $$
	SELECT *
	FROM offer
	WHERE decider = username_in;
 $$;
 
--SELECT * FROM getUserOffers('bob99');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getUserRequests;
CREATE FUNCTION  getUserRequests(
	username_in VARCHAR(255)
)
RETURNS TABLE (id INTEGER, requestor VARCHAR(255), decider VARCHAR(255),status offerStatus)
LANGUAGE SQL
AS $$
	SELECT *
	FROM offer
	WHERE requestor = username_in;
 $$;
 
--SELECT * FROM getUserRequests('charles99');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS getOfferDetails;
CREATE FUNCTION  getOfferDetails(
	offer_id_in INTEGER
)
RETURNS TABLE (id INTEGER, card_identifier VARCHAR(255), game VARCHAR(255), card_condition VARCHAR(255),offer_side offer_side_type)
LANGUAGE SQL
AS $$
	SELECT offer_item.id, card.card_identifier, card.game, card.card_condition, offer_item.offer_side
	FROM offer
	JOIN offer_item ON (offer.id = offer_item.offer_id)
	JOIN card ON (card.id = offer_item.card_id)
	WHERE offer.id = offer_id_in;
 $$;
 
--SELECT * FROM getOfferDetails(1);

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS searchCards;
CREATE FUNCTION  searchCards(
	search_str VARCHAR(255)
)
RETURNS TABLE (card_id INTEGER ,card_owner VARCHAR(255),card_identifier VARCHAR(255), game VARCHAR(255), card_condition VARCHAR(255), num_owned INTEGER, role userRole)
LANGUAGE SQL
AS $$
	SELECT card.id, card.card_owner, card.card_identifier, card.game, card.card_condition, card.num_owned, role
	FROM card
	JOIN TCSwap_user ON (TCSwap_user.username = card.card_owner)
	WHERE LOWER(card_identifier) LIKE '%'||LOWER(search_str)||'%';
 $$;
 
--SELECT * FROM searchCards('ulti');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS searchUsers;
CREATE FUNCTION  searchUsers(
	search_str VARCHAR(255)
)
RETURNS TABLE (username VARCHAR(255),first_name VARCHAR(255),last_name VARCHAR(255),role userRole)
LANGUAGE SQL
AS $$
	SELECT username,first_name,last_name,role
	FROM TCSwap_user 
	WHERE LOWER(username) LIKE '%'||LOWER(search_str)||'%';
 $$;
 
--SELECT * FROM searchUsers('bob');

-----------------------------------------------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS searchStores;
CREATE FUNCTION  searchStores(
	search_str VARCHAR(255)
)
RETURNS TABLE (store_owner VARCHAR(255), store_name VARCHAR(255))
LANGUAGE SQL
AS $$
	SELECT store_owner , store_name 
	FROM store
	WHERE LOWER(store_name) LIKE '%'||LOWER(search_str)||'%';
 $$;
 
--SELECT * FROM searchStores('robert`s emporium');
