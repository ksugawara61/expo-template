-- @param {String} $1:id The tag ID
-- @param {String} $2:name? The tag name (nullable)
UPDATE tags
SET
    name = COALESCE($2, name),
    updated_at = datetime('now')
WHERE id = $1
RETURNING id, name, created_at, updated_at