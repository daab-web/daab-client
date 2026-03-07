import Nedb from "@seald-io/nedb"
import path from "path"

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve("./local.db")

const db = new Nedb({ filename: dbPath, autoload: true })

await db.ensureIndexAsync({ fieldName: "locale" })

export default db;

