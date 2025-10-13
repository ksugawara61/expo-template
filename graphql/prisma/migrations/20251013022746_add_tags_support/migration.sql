-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "bookmark_tags" (
    "bookmark_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    PRIMARY KEY ("bookmark_id", "tag_id"),
    CONSTRAINT "bookmark_tags_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "bookmarks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookmark_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
