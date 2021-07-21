INSERT INTO users (name, email, password)
VALUES ('Arnold Armin', 'aarmin@gmail.com', 'aUb=DzdH$#6sUYVt'),
('Bernard Brassard', 'bbrassard@gmail.com', 'aUb=DzdH$#6sUYVt'),
('Carol Crimpian', 'ccrimpian@gmail.com', 'aUb=DzdH$#6sUYVt'),
('Demi Denetia', 'ddenetia@gmail.com', 'aUb=DzdH$#6sUYVt'),
('Eric Everard', 'eeverard@gmail.com', 'aUb=DzdH$#6sUYVt'),
('Frank Frum', 'ffrum@gmail.com', 'aUb=DzdH$#6sUYVt');

INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
  country, street, city, province, post_code, active
)
VALUES (1, 'Old mansion', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 350, 3, 2, 2,
  'Canada', '37 Grand Street', 'Toronto', 'ON', 'A1B 2C3', TRUE),
(1, 'Cabin in the woods', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 90, 1, 1, 1,
  'Canada', '22 Windy Trail', 'Nakusp', 'BC', 'A1B 2C3', TRUE),
(3, 'Rustic cottage', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 120, 1, 1, 2,
  'Canada', '83 Dundas Avenue', 'Truro', 'NS', 'A1B 2C3', TRUE),
(4, 'Condo in the sky', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 270, 0, 1, 1,
  'Canada', '2 Hastings Street', 'Vancouver', 'BC', 'A1B 2C3', TRUE),
(4, 'The ranch', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 150, 5, 2, 2,
  'Canada', '40 Oak Lane', 'Edmonton', 'AB', 'A1B 2C3', TRUE),
(5, 'Chalet on the slopes', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 180, 1, 1, 2,
  'Canada', '17 Sitka Crescent', 'Kimberley', 'BC', 'A1B 2C3', TRUE),
(6, 'Prairie house', 'description...',
  'https://thumbnail.jpg', 'https://cover.jpg', 140, 3, 2, 2,
  'Canada', '542 Red Fife Way', 'Regina', 'SK', 'A1B 2C3', TRUE);


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-01-23', '2021-01-27', 1, 4),
('2021-02-12', '2021-02-16', 3, 1),
('2021-03-08', '2021-03-14', 4, 6),
('2021-04-02', '2021-04-04', 1, 6),
('2021-05-28', '2021-05-30', 4, 2),
('2021-06-15', '2021-06-24', 5, 3),
('2021-07-19', '2021-07-22', 7, 2);

INSERT INTO property_reviews (
  reservation_id, property_id, guest_id, rating, message
)
VALUES(1, 1, 4, 5, 'fantastic'),
(2, 3, 1, 4, 'pretty good'),
(3, 4, 6, 3, 'a little expensive'),
(4, 1, 6, 5, 'wonderful'),
(5, 4, 2, 2, 'noisy'),
(6, 5, 3, 4, 'relaxing'),
(7, 7, 2, 4, 'sweet');