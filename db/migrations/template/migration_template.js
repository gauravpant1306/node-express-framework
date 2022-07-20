const createTable = () => {
  return `CREATE TABLE IF NOT EXISTS {tableName}
  (
    {column}
  )`;
};

const dropTable = () => {
  return "DROP TABLE {tableName}";
};

module.exports = {
  createTable,
  dropTable,
};
