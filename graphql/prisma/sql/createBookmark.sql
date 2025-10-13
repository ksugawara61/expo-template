-- @param {String} $1:id The bookmark ID
-- @param {String} $2:title The bookmark title
-- @param {String} $3:url The bookmark URL
-- @param {String} $4:description? The bookmark description (nullable)
INSERT INTO bookmarks (id, title, url, description, created_at, updated_at)
VALUES ($1, $2, $3, $4, datetime('now'), datetime('now'))
RETURNING id, title, url, description, created_at, updated_at