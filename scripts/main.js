let tables = [];

function addColumn() {
  const container = document.getElementById('columns-container');
  const input = document.createElement('input');
  input.placeholder = 'Column name';
  container.appendChild(input);
}

function removeColumn(){
  const container = document.getElementById('columns-container');

  if(container.hasChildNodes){
    container.removeChild(container.lastChild);
  }
}

function finalizeTable() {
  const tableName = document.getElementById('table-name').value;
  const columnInputs = document.querySelectorAll('#columns-container input');
  const columns = Array.from(columnInputs).map(input => input.value);

  const table = {
    name: tableName,
    columns: columns,
    rows: []
  };

  tables.push(table);
  alert(`Table "${tableName}" created!`);
  prepareDataInsertion(table);
}

function prepareDataInsertion(table) {
  document.getElementById('data-insertion').style.display = 'block';
  const insertFields = document.getElementById('insert-fields');
  insertFields.innerHTML = '';

  table.columns.forEach(col => {
    const input = document.createElement('input');
    input.placeholder = col;
    insertFields.appendChild(input);
  });
}

function addRow() {
  const table = tables[tables.length - 1]; // Get the last table created
  const inputs = document.querySelectorAll('#insert-fields input');
  const row = Array.from(inputs).map(input => input.value);

  table.rows.push(row);
  displayTableData(table);
}

function removeRow() {
  const table = tables[tables.length - 1];
  table.rows.pop();
  displayTableData(table);
}

function displayTableData(table) {
  const output = document.getElementById('table-data');
  let text = `${table.name}\nColumns: ${table.columns.join(', ')}\n`;

  table.rows.forEach((row, index) => {
    text += `${index + 1}: ${row.join(', ')}\n`;
  });

  output.textContent = text;
}
