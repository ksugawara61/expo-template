-- @param {String} $1:id The tag ID
SELECT id, name, created_at, updated_at
FROM tags
WHERE id = $1