-- @param {String} $1:id The tag ID
-- @param {String} $2:name The tag name
INSERT INTO tags (id, name, created_at, updated_at)
VALUES ($1, $2, datetime('now'), datetime('now'))
RETURNING id, name, created_at, updated_at