const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//------------------------------------------------------------------------------
// Users

/**-----------------------------------------------------------------------------
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = (email) =>
  pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((res) => res.rows[0] || null)
    .catch((err) => console.error('query error', err.stack));

exports.getUserWithEmail = getUserWithEmail;

/**-----------------------------------------------------------------------------
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) =>
  pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((res) => res.rows[0] || null)
    .catch((err) => console.error('query error', err.stack));

exports.getUserWithId = getUserWithId;

/**-----------------------------------------------------------------------------
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = (user) =>
  pool
    .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [user.name, user.email, user.password]
    )
    .then((res) => res.rows[0] || null)
    .catch((err) => console.error('query error', err.stack));

exports.addUser = addUser;

//------------------------------------------------------------------------------
// Reservations

/**-----------------------------------------------------------------------------
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = (guest_id, limit = 10) =>
  pool
    .query(
      `SELECT reservations.*, properties.*, avg(rating) AS average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      ORDER BY start_date
      LIMIT $2;`,
      [guest_id, limit]
    )
    .then((res) => res.rows)
    .catch((err) => console.error('query error', err.stack));

exports.getAllReservations = getAllReservations;

//------------------------------------------------------------------------------
// Properties

/**-----------------------------------------------------------------------------
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  // SELECT ... FROM ... JOIN ...
  let queryString = `
    SELECT properties.*, avg(rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id `;

  // WHERE
  const whereStrings = [];
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereStrings.push(`city LIKE $${queryParams.length}`);
  }
  if (options.minimum_price_per_night) {
    queryParams.push(100 * options.minimum_price_per_night);
    whereStrings.push(`properties.cost_per_night >= $${queryParams.length}`);
  }
  if (options.maximum_price_per_night) {
    queryParams.push(100 * options.maximum_price_per_night);
    whereStrings.push(`properties.cost_per_night <= $${queryParams.length}`);
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereStrings.push(`properties.owner_id = $${queryParams.length}`);
  }
  if (whereStrings.length) {
    queryString += `
    WHERE ${whereStrings.join('\n AND ')}`;
  }

  // GROUP BY
  queryString += `
    GROUP BY properties.id`;

  // HAVING
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(rating) >= $${queryParams.length}`;
  }

  // ORDER BY ... LIMIT ...
  queryParams.push(limit);
  queryString += `
    ORDER BY properties.cost_per_night
    LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => console.error('query error', err.stack));
};

exports.getAllProperties = getAllProperties;

/**-----------------------------------------------------------------------------
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const tokens = (props) => props.map((_, index) => '$' + (index + 1)).join(', ');

const params = (obj, props) => props.map((prop) => obj[prop]);

const addProperty = (property) => {
  const props = [
    'owner_id',
    'title',
    'description',
    'thumbnail_photo_url',
    'cover_photo_url',
    'cost_per_night',
    'parking_spaces',
    'number_of_bathrooms',
    'number_of_bedrooms',
    'country',
    'street',
    'city',
    'province',
    'post_code',
  ];

  return pool
    .query(
      `INSERT INTO properties (${props.join(', ')})
      VALUES (${tokens(props)})
      RETURNING *;`,
      params(property, props)
    )
    .then((res) => res.rows[0] || null)
    .catch((err) => console.error('query error', err.stack));
};

exports.addProperty = addProperty;

/**-----------------------------------------------------------------------------
 * Add a reservation to the database
 * @param {{}} property An object containing all of the reservation details.
 * @return {Promise<{}>} A promise to the reservation.
 */

const reserveProperty = (reservation) => {
  const props = ['start_date', 'end_date', 'property_id', 'guest_id'];
  return pool
    .query(
      `INSERT INTO reservations (${props.join(', ')})
      VALUES (${tokens(props)})
      RETURNING *;`,
      params(reservation, props)
    )
    .then((res) => res.rows[0] || null)
    .catch((err) => console.error('query error', err.stack));
};

exports.reserveProperty = reserveProperty;
