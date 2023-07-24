import { readCSVPapa } from "../fileio";

// Interface representing a single row in the dataset
export interface DatasetNamedRow {
    feature: { [key: string]: string };
    label: string;
}

/**
 * Load a dataset from a CSV file with options to select the target column and exclude specific columns.
 * @param filePath - The path to the CSV file.
 * @param targetColumn - The name of the target column (e.g., "stroke").
 * @param excludeColumns - An array of column names to be excluded from the dataset (e.g., ["id"]).
 * @returns Promise<DatasetNamedRow[]> - A Promise that resolves to the loaded dataset.
 * @throws Error if the file doesn't exist or an error occurs during reading.
 */
export async function loadDataset(
    filePath: string,
    targetColumn: string,
    excludeColumns: string[] = []
): Promise<DatasetNamedRow[]> {
    try {
        const csvData = await readCSVPapa(filePath);
        const dataset: DatasetNamedRow[] = [];

        // Find the index of the target column and excluded columns
        const headerRow = csvData[0];
        const targetColumnIndex = headerRow.indexOf(targetColumn);
        const excludedColumnIndices = excludeColumns.map((col) =>
            headerRow.indexOf(col)
        );

        for (let i = 1; i < csvData.length; i++) {
            const rowData = csvData[i];

            // Exclude the specified columns
            const filteredData = rowData.filter(
                (_: any, index: any) => !excludedColumnIndices.includes(index)
            );

            // Extract the target label
            const targetLabel = filteredData[targetColumnIndex];

            // Remove the target label from the filtered data
            filteredData.splice(targetColumnIndex, 1);

            // Create the dataset row object
            const datasetRow: DatasetNamedRow = {
                feature: {},
                label: targetLabel,
            };

            // Assign feature names to corresponding values
            for (let j = 0; j < headerRow.length; j++) {
                if (
                    !excludedColumnIndices.includes(j) &&
                    j !== targetColumnIndex
                ) {
                    const columnName = headerRow[j];
                    const columnValue = filteredData[j];
                    datasetRow.feature[columnName] = columnValue;
                }
            }

            dataset.push(datasetRow);
        }

        return dataset;
    } catch (error: any) {
        throw new Error(
            `Error loading classification dataset from CSV: ${error.message}`
        );
    }
}
