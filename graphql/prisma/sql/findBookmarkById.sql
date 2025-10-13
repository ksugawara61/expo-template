-- @param {String} $1:id The bookmark ID
SELECT
    b.id,
    b.title,
    b.url,
    b.description,
    b.created_at,
    b.updated_at,
    t.id as tag_id,
    t.name as tag_name,
    t.created_at as tag_created_at,
    t.updated_at as tag_updated_at
FROM bookmarks b
LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
LEFT JOIN tags t ON bt.tag_id = t.id
WHERE b.id = $1