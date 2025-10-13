-- @param {String} $1:bookmarkId The bookmark ID
-- @param {String} $2:tagId The tag ID
INSERT INTO bookmark_tags (bookmark_id, tag_id)
VALUES ($1, $2)