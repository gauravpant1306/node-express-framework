const createUserTable = () => {
  return `CREATE TABLE IF NOT EXISTS {tableName}
  (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  mobile INT UNIQUE, 
  first_name VARCHAR(100), 
  last_name VARCHAR(100), 
  password VARCHAR(100) NOT NULL,
  is_logged_in BOOLEAN,
  {columnName} {columnType} {allowedAsNULL}
  {columnName} {columnType} {allowedAsNULL}
  created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_on TIMESTAMP WITHOUT TIME ZONE )`;

  return pool.query(userCreateQuery);
};
