DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS admins;

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
	content TEXT,
	posted DATETIME DEFAULT(datetime('now')),
    author VARCHAR(255)
);

CREATE TABLE admins (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	`password` VARCHAR(255) NOT NULL,
	salt VARCHAR(255) NOT NULL
)