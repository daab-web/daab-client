import Nedb from "@seald-io/nedb"

const db = new Nedb({ filename: "./local.db", autoload: true })

await db.ensureIndexAsync({ fieldName: "locale" })

export default db;

