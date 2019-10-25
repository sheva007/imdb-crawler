module.exports = {
    "name": "default",
    "type": "sqlite",
    "database": "db.sqlite3",
    "synchronize": true,
    "entities": [
        "js/entities/*.js"
    ],
    "subscribers": [
        "js/subscriber/*.js"
    ],
    "migrations": [
        "js/migration/*.js"
    ],
    "cli": {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}