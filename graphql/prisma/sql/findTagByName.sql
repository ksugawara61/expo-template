-- @param {String} $1:name The tag name
SELECT id, name, created_at, updated_at
FROM tags
WHERE name = $1