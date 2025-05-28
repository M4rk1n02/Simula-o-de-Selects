/**
 * Select.js
 * Etapas da operação de select:
 * 1 - Verifica se a tabela existe.
 *  \
 *   2 - Obtém o objeto.
 *    \
 *     3 - Verifica se as colunas desejadas existem na tabela.
 *      \
 *       4 - Relacionar os índices das colunas da tabela com as desejadas.
 *       |
 *       5 - Juntar os dados em um array multi dimensional com colunas e registros.
 */

/**
 * Busca pela tabela na variável tables e retorna um erro caso não exista.
 * @param tableName
 * @returns {*}
 */
function getTableObject(tableName) {
    const table = tables.find((table) => table.name === tableName);
    if(!table) {
        throw new Error(`ERROR: The table '${tableName}' does not exists.`);
    }
    return table;
}

/**
 * Gera um array com as diferenças entre as colunas da tabela e as desejadas
 * e retorna se ele está vazio, ou seja, sem diferenças.
 * @param table
 * @param targetColumns
 * @returns {boolean}
 */
function tableHasTargetColumns(table, targetColumns) {
    return table.columns.filter(column => targetColumns.includes(column)).length === targetColumns.length;
}

function getDataFromTable(table, targetColumns) {
    const targetColumnsIndexes = targetColumns.map(column => table.columns.indexOf(column));
    return table.rows.map(row => {
        const result = {};
        targetColumnsIndexes.forEach((index, position) => {
            result[targetColumns[position]] = row[index];
        });
        return result;
    })
}

/**
 * TODO: Resta tratar exceção de colunas-alvo inexistentes.
 * @param tableName
 * @param targetColumns
 * @returns {*|boolean}
 */
function select(tableName, targetColumns) {
    try {
        const table = getTableObject(tableName);
        if(!tableHasTargetColumns(table, targetColumns)) {
            throw new Error(`Columns (${targetColumns.join(', ')}) does not exists on table '${table.name}'`);
        }
        return getDataFromTable(table, targetColumns);

    } catch(error) {
        alert(error.message);
        return false;
    }
}