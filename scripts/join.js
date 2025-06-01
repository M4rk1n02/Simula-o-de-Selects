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
  const result = [];

  for (const row1 of table1.records) {
    for (const row2 of table2.records) {
      if (row1[t1Key] === row2[t2Key]) {
        const combined = {};

        
        table1.columns.forEach((col) => {
          combined[`${table1.name}.${col.name}`] = row1[col.name];
        });

       
        table2.columns.forEach((col) => {
          combined[`${table2.name}.${col.name}`] = row2[col.name];
        });

        result.push(combined);
      }
    }
  }

  return result;
}


window.innerJoin = innerJoin;

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

window.Table = Table;
window.innerJoin = innerJoin;