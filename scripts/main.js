let tables = [];
const tablesByName = {};
let currentTable = null;

function addColumn() {
  const container = document.getElementById('columns-container');

  const div = document.createElement('div');
  div.classList.add('column-row'); 

  const input = document.createElement('input');
  input.placeholder = 'Column name';

  const selectType = document.createElement('select');
  const types = ['INT', 'VARCHAR', 'DATE'];
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    selectType.appendChild(option);
  });

  const inputSize = document.createElement('input');
  inputSize.placeholder = 'Size (optional)';
  inputSize.type = 'number';
  inputSize.min = '1';

  div.appendChild(input);
  div.appendChild(selectType);
  div.appendChild(inputSize);

  container.appendChild(div);
}

function removeColumn(){
  const container = document.getElementById('columns-container');

  if(container.hasChildNodes){
    container.removeChild(container.lastChild);
  }
}

function finalizeTable() {
  const tableName = document.getElementById('table-name').value;
  const columnDivs = document.querySelectorAll('#columns-container .column-row');

  const columns = Array.from(columnDivs).map(div => {
    const name = div.querySelector('input[placeholder="Column name"]').value;
    const type = div.querySelector('select').value;
    const size = div.querySelector('input[placeholder="Size (optional)"]').value;

    return { name, type, size: size || null }; 
  });


  const table = {
    name: tableName,
    columns: columns,
    rows: []
  };

  tables.push(table);
  currentTable = table;
  alert(`Table "${tableName}" created!`);
  prepareDataInsertion(table);
  tablesByName[table.name] = table;
  renderColumnCheckboxes(table, 'columns-to-select');
}

function prepareDataInsertion(table) {
  document.getElementById('data-insertion').style.display = 'block';
  const insertFields = document.getElementById('insert-fields');
  insertFields.innerHTML = '';

  table.columns.forEach(col => {
    const input = document.createElement('input');
    const typeInfo = col.size ? `${col.type}(${col.size})` : col.type;
    input.placeholder = `${col.name} (${typeInfo})`;
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
  let text = `Table: ${table.name}\nColumns: ${table.columns.map(c => c.name).join(', ')}\n`;

  if (table.rows.length === 0) {
    text += "No data yet.";
  } else {
    table.rows.forEach((row, index) => {
      text += `${index + 1}: ${row.join(', ')}\n`;
    });
  }

  output.textContent = text;
}

function renderColumnCheckboxes(table, containerId) {
  const container = document.getElementById(containerId);

  // (1) Armazena a tabela no dicionário global
  tablesByName[table.name] = table;

  // (2) Cria o container específico pra essa tabela
  const tableContainer = document.createElement("div");
  tableContainer.id = `select-container-${table.name}`;
  tableContainer.style.marginBottom = "20px";
  tableContainer.style.border = "1px solid #ccc";
  tableContainer.style.padding = "10px";
  tableContainer.style.borderRadius = "8px";

  const title = document.createElement("h3");
  title.textContent = `Selecionar colunas da tabela "${table.name}"`;
  tableContainer.appendChild(title);

  // (3) Cria os checkboxes
  table.columns.forEach(column => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `${table.name}-checkbox`;
    checkbox.value = column;

    label.appendChild(checkbox);
    label.append(` ${column}`);
    tableContainer.appendChild(label);
  });

  // (4) Cria o botão SELECT com dataset
  const button = document.createElement("button");
  button.textContent = "Select";
  button.dataset.tableName = table.name;
  button.onclick = (event) => {
    const tableName = event.target.dataset.tableName;
    const tableRef = tablesByName[tableName];
    handleSelect(tableRef);
  };
  tableContainer.appendChild(button);

  // (5) Cria o output
  const output = document.createElement("pre");
  output.id = `select-output-${table.name}`;
  output.style.background = "#f0f0f0";
  output.style.padding = "10px";
  output.style.borderRadius = "5px";
  output.style.marginTop = "10px";
  tableContainer.appendChild(output);

  // (6) Adiciona no container principal
  container.appendChild(tableContainer);
}
