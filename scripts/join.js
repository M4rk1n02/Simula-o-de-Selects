class Table {
  constructor(name, columns, primaryKey) {
    this.name = name; 
    this.columns = columns; 
    this.primaryKey = primaryKey; 
    this.records = []; 
  }

  insert(record) {
    if (this.records.some(r => r[this.primaryKey] === record[this.primaryKey])) {
      throw new Error(`Chave primária duplicada na tabela ${this.name}!`);
    }
    this.records.push(record);
  }
}

function innerJoin(table1, table2, t1Key, t2Key) {
  return table1.records.flatMap(record1 =>
    table2.records
      .filter(record2 => record1[t1Key] === record2[t2Key])
      .map(record2 => ({ ...record1, ...record2 }))
  );
}

function project(data, fields) {
  return data.map(record => {
    const projected = {};
    fields.forEach(field => {
      if (record[field] !== undefined) {
        projected[field] = record[field];
      }
    });
    return projected;
  });
}

export { Table, innerJoin, project };