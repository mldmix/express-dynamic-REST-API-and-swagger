const sql = require('mssql');

const config = {
  user: <your-db-username>,
  password: <your-db-password>,
  server: <your-db-host>, // e.g., localhost or IP address
  database: <your-db-name>,
  options: {
    encrypt: false, // Required for Azure
    trustServerCertificate: true, // Change to false for production
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = { sql, pool, poolConnect };
