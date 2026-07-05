const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_fFh8GC7aQSBE@ep-dawn-dew-ahkh077o-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log("✅ Connected to Neon successfully"))
    .catch(err => console.error("❌ Connection Error:", err));

module.exports = pool;