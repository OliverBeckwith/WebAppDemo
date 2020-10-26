DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
	content TEXT,
	posted DATETIME DEFAULT(datetime('now')),
    author VARCHAR(255)
);