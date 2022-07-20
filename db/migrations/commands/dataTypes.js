exports.withoutInput = [
  "smallint",
  "int",
  "integer",
  "bigint",
  "decimal",
  "real",
  // "double precision",
  "smallserial",
  "serial",
  "bigserial",
  "text",
  "boolean",
  "float8",
  "real",
  "date",
  "time",
  "timestamp",
  "timestampz",
  "interval",
  "uuid",
  "json",
  "jsonb",
  "box",
  "point",
  "lseg",
  "polygon",
  "inet",
  "macaddr",
];

exports.oneInput = ["char", "varchar", "float"];

exports.twoInput = ["numeric"]; // N(d,p), d number of digits and p number of decimal points after
