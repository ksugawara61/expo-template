-- @param {String} $1:id The bookmark ID
-- @param {String} $2:title The bookmark title
-- @param {String} $3:url The bookmark URL
-- @param {String} $4:description? The bookmark description (nullable)
UPDATE bookmarks
SET
    title = $2,
    url = $3,
    description = $4,
    updated_at = datetime('now')
WHERE id = $1
RETURNING id, title, url, description, created_at, updated_at