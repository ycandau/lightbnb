SELECT properties.*, avg(rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%Vancouver'
GROUP BY properties.id
HAVING avg(rating) >= 4
ORDER BY properties.cost_per_night
LIMIT 10;