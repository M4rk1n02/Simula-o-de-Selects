let tables = [];
let currentTable = null;

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
  currentTable = table;
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
   if (!currentTable) {
    alert("No table selected.");
    return;
  }

  const inputs = document.querySelectorAll('#insert-fields input');
  const row = Array.from(inputs).map(input => input.value.trim());

  if (row.some(value => value === '')) {
    alert("Please fill in all fields before adding a row.");
    return;
  }

  currentTable.rows.push(row);
  inputs.forEach(input => input.value = '');

  displayTableData(currentTable);
}

function removeRow() {
  if (!currentTable) {
    alert("No table selected.");
    return;
  }

  if (currentTable.rows.length === 0) {
    alert("No rows to remove.");
    return;
  }

  currentTable.rows.pop();
  displayTableData(currentTable);
}

function displayTableData(table) {
  const output = document.getElementById('table-data');
  let text = `Table: ${table.name}\nColumns: ${table.columns.join(', ')}\n`;

  if (table.rows.length === 0) {
    text += "No data yet.";
  } else {
    table.rows.forEach((row, index) => {
      text += `${index + 1}: ${row.join(', ')}\n`;
    });
  }

  output.textContent = text;
}
