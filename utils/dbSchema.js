const { pool, poolConnect } = require('../config/db');

const getModelsFromDatabase = async () => {
  await poolConnect;

  const tablesResult = await pool.request().query(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
  `);

  const models = [];
  for (const table of tablesResult.recordset) {
    const columnsResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${table.TABLE_NAME}'
    `);

    models.push({
      name: table.TABLE_NAME,
      fields: columnsResult.recordset.map((column) => ({
        name: column.COLUMN_NAME,
        type: column.DATA_TYPE,
      })),
    });
  }

  return models;
};

module.exports = { getModelsFromDatabase };
