DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS admins;

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title VARCHAR(255),
	content TEXT,
	posted DATETIME DEFAULT(datetime('now')),
	modified DATETIME DEFAULT(datetime('now'))
);

CREATE TABLE comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	post_id INTEGER NOT NULL,
	content TEXT,
	author VARCHAR(255),
	commented DATETIME DEFAULT(datetime('now')),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE admins (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	`password` VARCHAR(255) NOT NULL,
	salt VARCHAR(255) NOT NULL
);

-- Default admin account so that there is always at least one.
INSERT INTO admins (id,`password`, salt) VALUES (1,'3031363367a96566bcab97a978a0b9a3f3dfbf688a730285129c5387349449ec6784714a3ae9c989ec2e01eff575d7ce96cc335f1bee3158cccc95182c63c2d3','88d0682061d0539e');