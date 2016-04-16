CREATE TABLE IF NOT EXISTS establishment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    latitude REAL NOT NULL
        CHECK(-90<=latitude AND latitude<=90) DEFAULT 0,
    longitude REAL NOT NULL
        CHECK(-180<=longitude AND longitude<=180) DEFAULT 0,

    name TEXT NOT NULL,

    address_street TEXT NOT NULL,
    address_town TEXT NOT NULL,
    address_number INTEGER NOT NULL,
    address_zip INTEGER NOT NULL,

    phone_number VARCHAR(20) NOT NULL,

    website TEXT,

    picture BLOB,

    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,

    CONSTRAINT USER_EXIST
        FOREIGN KEY (created_by) REFERENCES account (username)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE(latitude, longitude)
);


CREATE TABLE IF NOT EXISTS restaurant (
    id INTEGER PRIMARY KEY NOT NULL,

    price INTEGER NOT NULL,

    seat_number INTEGER NOT NULL,

    takeaway BOOLEAN NOT NULL,

    delivery BOOLEAN NOT NULL,

    timetable INTEGER, 

    CONSTRAINT ESTABLISHEMENT_EXIST
        FOREIGN KEY (id) REFERENCES establishment(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bar (
    id INTEGER PRIMARY KEY NOT NULL,

    smokers BOOLEAN,

    snacks BOOLEAN,

    CONSTRAINT ESTABLISHEMENT_EXIST
        FOREIGN KEY (id) REFERENCES establishment(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotel (
    id INTEGER PRIMARY KEY NOT NULL,

    stars INTEGER NOT NULL
        CHECK(0<=stars AND stars<=5),

    room_number INTEGER NOT NULL,

    price INTEGER NOT NULL,

    CONSTRAINT ESTABLISHEMENT_EXIST
        FOREIGN KEY (id) REFERENCES establishment(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
    username TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,

    admin BOOL DEFAULT 0,

    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL,

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    establishment_id INTEGER NOT NULL,

    rating INTEGER NOT NULL
        CHECK(0<rating AND rating<=5),
    
    comment_text TEXT NOT NULL,

    picture_attached BLOB,
    
    CONSTRAINT ESTABLISHEMENT_EXIST
        FOREIGN KEY (establishment_id) REFERENCES establishment (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT USER_EXIST
        FOREIGN KEY (username) REFERENCES account (username)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE(username, timestamp)
);

CREATE TABLE IF NOT EXISTS label (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    username TEXT NOT NULL,

    establishment_id INTEGER NOT NULL,

    CONSTRAINT ESTABLISHEMENT_EXIST
        FOREIGN KEY (establishment_id) REFERENCES establishment (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT USER_EXIST
        FOREIGN KEY (username) REFERENCES account (username)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE (name, establishment_id, username)
);
