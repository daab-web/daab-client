import Nedb from "@seald-io/nedb"

const dbPath = process.env.DB_PATH

if (!dbPath) { throw new Error("AUTH_DB_PATH not specified") }

const db = new Nedb({ filename: dbPath, autoload: true })

await db.ensureIndexAsync({ fieldName: "locale" })

export default db;

