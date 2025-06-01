let tables = [];
const tablesByName = {};
let currentTable = null;

function addColumn() {
    const container = document.getElementById('columns-container');

    const div = document.createElement('div');
    div.classList.add('column-row');

    const input = document.createElement('input');
    input.placeholder = 'Nome da coluna';

    const selectType = document.createElement('select');
    const types = ['INT', 'VARCHAR', 'DATE'];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selectType.appendChild(option);
    });

    const inputSize = document.createElement('input');
    inputSize.placeholder = 'Tamanho (opcional)';
    inputSize.type = 'number';
    inputSize.min = '1';

    div.appendChild(input);
    div.appendChild(selectType);
    div.appendChild(inputSize);

    container.appendChild(div);
}

function removeColumn() {
    const container = document.getElementById('columns-container');

    if (container.hasChildNodes) {
        container.removeChild(container.lastChild);
    }
}

function finalizeTable() {
    const tableName = document.getElementById('table-name').value;
    const columnDivs = document.querySelectorAll('#columns-container .column-row');

    const columns = Array.from(columnDivs).map(div => {
        const name = div.querySelector('input[placeholder="Nome da coluna"]').value;
        const type = div.querySelector('select').value;
        const size = div.querySelector('input[placeholder="Tamanho (opcional)"]').value;

        return {name, type, size: size || null};
    });


    const table = {
        name: tableName,
        columns: columns,
        rows: []
    };

    tables.push(table);
    currentTable = table;
    alert(`Tabela "${tableName}" criada!`);
    prepareDataInsertion(table);
    tablesByName[table.name] = table;
    renderColumnCheckboxes(table, 'columns-to-select');
    populateJoinTableOptions();
}

function prepareDataInsertion(table) {
    const containerGroup = document.getElementById("data-insertion-group");

    // Cria um container individual por tabela
    const tableInsertContainer = document.createElement("div");
    tableInsertContainer.id = `data-insertion-${table.name}`;
    tableInsertContainer.classList.add("data-insertion");

    // Título da tabela
    const title = document.createElement("h2");
    title.textContent = `Inserção de dados na tabela "${table.name}"`;
    tableInsertContainer.appendChild(title);

    // Container dos inputs
    const insertFields = document.createElement("div");
    insertFields.classList.add("insert-fields");
    insertFields.dataset.tableName = table.name;

    table.columns.forEach(col => {
        const input = document.createElement("input");
        const typeInfo = col.size ? `${col.type}(${col.size})` : col.type;
        input.placeholder = `${col.name} (${typeInfo})`;
        input.name = col.name;
        input.style.display = "block";
        
        if (col.type === "DATE") {
            input.type = "date";
        }

        insertFields.appendChild(input);
    });

    tableInsertContainer.appendChild(insertFields);

    // Botões de controle
    const addBtn = document.createElement("button");
    addBtn.textContent = "Adicionar Linha";
    addBtn.onclick = () => addRow(table.name);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover Linha";
    removeBtn.onclick = () => removeRow(table.name);

    const resultPre = document.createElement("pre");
    resultPre.id = `table-data-${table.name}`;

    tableInsertContainer.appendChild(addBtn);
    tableInsertContainer.appendChild(removeBtn);
    // tableInsertContainer.appendChild(resultPre);

    containerGroup.appendChild(tableInsertContainer);
}

function addRow(tableName) {
    const table = tablesByName[tableName];
    if (!table) {
        alert("Tabela não encontrada.");
        return;
    }

    const inputs = document.querySelectorAll(`#data-insertion-${tableName} .insert-fields input`);
    const row = [];

    let errorMessage = null;

    inputs.forEach((input, index) => {
        const col = table.columns[index];
        let value = input.value.trim();

        // Validação: INT
        if (col.type === "INT") {
            if (value === "" || isNaN(value)) {
                errorMessage = `O campo ${col.name} deve ser um número.`;
                return;
            }
            if (col.size && value.length > col.size) {
                errorMessage = `O campo ${col.name} excede o tamanho permitido (${col.size} dígitos).`;
                return;
            }
        }

        // Validação: VARCHAR
        if (col.type === "VARCHAR") {
            if (col.size && value.length > col.size) {
                errorMessage = `O campo ${col.name} excede o tamanho permitido (${col.size} caracteres).`;
                return;
            }
        }

        row.push(value);
    });

    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    if (row.some(value => value === '')) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    table.rows.push(row);
    inputs.forEach(input => input.value = '');

    // updateTableDataDisplay(table);
}

function removeRow(tableName) {
    const table = tablesByName[tableName];
    if (!table) {
        alert("Tabela não encontrada.");
        return;
    }

    if (table.rows.length === 0) {
        alert("Nenhuma linha para remover.");
        return;
    }

    table.rows.pop();
    // updateTableDataDisplay(table);
}

function displayTableData(table) {
    const output = document.getElementById(`table-data-${table.name}`);
    if (!output) return;

    let text = `Tabela: ${table.name}\nColunas: ${table.columns.map(c => c.name).join(', ')}\n`;

    if (table.rows.length === 0) {
        text += "Sem dados ainda.";
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
    tableContainer.classList.add("select-container");

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
        checkbox.value = column.name;

        label.appendChild(checkbox);
        label.append(` ${column.name}`);
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

function performJoin() {
    const table1Name = document.getElementById('join-table1').value;
    const table2Name = document.getElementById('join-table2').value;
    const key1 = document.getElementById('join-key1').value.trim();
    const key2 = document.getElementById('join-key2').value.trim();

    const table1 = tablesByName[table1Name];
    const table2 = tablesByName[table2Name];

    if (!table1 || !table2) {
        alert("Selecione duas tabelas válidas.");
        return;
    }

    if (!key1 || !key2) {
        alert("Informe as chaves para o JOIN.");
        return;
    }

    try {
        // Aqui converte as rows em records para o innerJoin entender
        const table1Records = {
            name: table1.name,
            columns: table1.columns,
            records: convertRowsToRecords(table1)
        };

        const table2Records = {
            name: table2.name,
            columns: table2.columns,
            records: convertRowsToRecords(table2)
        };

        const result = innerJoin(table1Records, table2Records, key1, key2);
        document.getElementById('join-output').textContent = JSON.stringify(result, null, 2);
    } catch (err) {
        alert(err.message);
    }
}

function populateJoinTableOptions() {
    const select1 = document.getElementById('join-table1');
    const select2 = document.getElementById('join-table2');

    select1.innerHTML = '';
    select2.innerHTML = '';

    tables.forEach(table => {
        const option1 = document.createElement('option');
        option1.value = table.name;
        option1.textContent = table.name;

        const option2 = option1.cloneNode(true);

        select1.appendChild(option1);
        select2.appendChild(option2);
    });
}

function convertRowsToRecords(table) {
    return table.rows.map(row => {
        const record = {};
        table.columns.forEach((col, index) => {
            record[col.name] = row[index];
        });
        return record;
    });
}
