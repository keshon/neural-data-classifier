import { ReadCSV } from "./file-io";

export interface IDataRow {
    target: string | number;
    column?: string;
    attr: { [key: string]: string | number | boolean };
}

export interface ILoadingOptions {
    removeDuplicateTargets?: boolean;
    removeEmptyVals?: boolean;
    columnName: string;
    targetType?: "string" | "number";
}

/**
 * Loads a dataset from a CSV file and converts it to an array of data rows.
 * @param filepath The path to the CSV file to load.
 * @param attrMap A mapping of CSV header names to IDataRow attribute names and types.
 * @param opts Options to configure the data loading process.
 * @returns A Promise that resolves to an array of IDataRow objects representing the loaded data.
 * @throws An error if the target column specified in the options is not found in the CSV.
 */
export async function LoadDatasetCSV(
    filepath: string,
    attrMap: {
        [key: string]:
            | string
            | { name: string; type: "string" | "number" | "boolean" };
    },
    opts: ILoadingOptions
): Promise<IDataRow[]> {
    const dataRows: IDataRow[] = [];

    try {
        // Read the CSV file
        const data = await ReadCSV(filepath);

        // Get the index of the target column (our feature) in the header row
        const headerIndex = 0; // CSV header at line 0 (always!)
        const headers = data[headerIndex];
        const targetIndex = headers.indexOf(opts.columnName);

        // Throw an error if the target column is not found
        if (targetIndex === -1) {
            throw new Error(
                `Target attr "${opts.columnName}" not found in the CSV.`
            );
        }

        // Loop through each row (excluding the header) to create data rows
        for (let i = headerIndex + 1; i < data.length; i++) {
            const row = data[i];
            let targetValue = row[targetIndex];

            const attrs: { [key: string]: string | number | boolean } = {};

            // Loop through each column in the row to populate attrs
            for (let j = 0; j < headers.length; j++) {
                const attrName = headers[j];
                const attrValue = row[j];

                // Skip empty values if removeEmptyVals option is enabled
                if (
                    opts.removeEmptyVals &&
                    (attrValue === "" || attrValue === null)
                ) {
                    continue;
                }

                // Map the attr name according to the attrMap
                if (attrMap[attrName] !== undefined) {
                    const attrMapping = attrMap[attrName];
                    const attrNameForData =
                        typeof attrMapping === "string"
                            ? attrMapping
                            : attrMapping.name;
                    const attrType =
                        typeof attrMapping === "string"
                            ? "string"
                            : attrMapping.type;

                    // Trim spaces for string attrs
                    if (attrType === "string") {
                        attrs[attrNameForData] = attrValue?.trim() ?? "";
                    } else if (attrType === "number") {
                        const parsedValue = parseFloat(attrValue);
                        attrs[attrNameForData] = isNaN(parsedValue)
                            ? 0
                            : parsedValue;
                    } else if (attrType === "boolean") {
                        attrs[attrNameForData] = attrValue === "true";
                    }
                }
            }

            // Skip rows with empty target values
            if (
                opts.removeEmptyVals &&
                (targetValue === "" || targetValue === null)
            ) {
                continue;
            }

            // Convert the target value to the appropriate data type based on targetType
            if (opts.targetType === "number") {
                targetValue = Number(targetValue);
            } else {
                targetValue = String(targetValue);
            }

            // Push the data row into the dataRows array
            dataRows.push({
                target: targetValue,
                column: opts.columnName,
                attr: attrs,
            });
        }
    } catch (error: any) {
        throw new Error(
            `Error loading CSV file at '${filepath}': ${error.message}`
        );
    }

    return dataRows;
}

/**
 * Merges data rows with the same target value, combining their attribute values into one data row.
 * @param dataRows An array of IDataRow objects representing the dataset.
 * @returns An array of IDataRow objects with merged attribute values for the same target.
 */
export function MergeDatasetRows(dataRows: IDataRow[]): IDataRow[] {
    // Helper function to merge symptom attributes from two rows into one
    const mergeSymptoms = (
        targetAttrs: { [key: string]: string | number | boolean },
        newAttrs: { [key: string]: string | number | boolean }
    ) => {
        for (const [symptomKey, symptomValue] of Object.entries(newAttrs)) {
            let mergedSymptomKey = symptomKey;
            let index = 1;
            while (targetAttrs.hasOwnProperty(mergedSymptomKey)) {
                index++;
                mergedSymptomKey = `${symptomKey}_${index}`;
            }
            targetAttrs[mergedSymptomKey] = symptomValue;
        }
    };

    const mergedRows: { [target: string]: IDataRow } = {};

    for (const row of dataRows) {
        const target = row.target;
        if (mergedRows.hasOwnProperty(target)) {
            // Merge symptom attributes with the existing merged row
            mergeSymptoms(mergedRows[target].attr, row.attr);
        } else {
            // Add the row as a new merged row
            mergedRows[target] = { ...row };
        }
    }

    // Convert the merged rows back to an array
    const mergedDataRows = Object.values(mergedRows);

    return mergedDataRows;
}

/**
 * Extracts unique attribute values from a dataset.
 * @param dataRows An array of IDataRow objects representing the dataset.
 * @param attributeNames An optional array of attribute names to consider. If provided, only attributes with these names will be processed.
 * @param mergeIntoOneList If set to true, all unique attribute values will be merged into a single list. Otherwise, the result will be an object with attribute names as keys and arrays of unique attribute values as values.
 * @returns An array of unique attribute values or an object with attribute names and their unique values, depending on the mergeIntoOneList parameter.
 */
export function ExtractUniqueAttributes(
    dataRows: IDataRow[],
    attributeNames?: string[],
    mergeIntoOneList: boolean = true
): string[] | { [key: string]: string[] } {
    const uniqueAttributes: { [key: string]: Set<string> } = {};

    for (const row of dataRows) {
        const attrs = row.attr;
        const attrsToProcess = attributeNames
            ? attributeNames.filter((name) => attrs.hasOwnProperty(name))
            : Object.keys(attrs);

        for (const attrKey of attrsToProcess) {
            const attrValue = String(attrs[attrKey]);
            if (!uniqueAttributes.hasOwnProperty(attrKey)) {
                uniqueAttributes[attrKey] = new Set<string>();
            }
            uniqueAttributes[attrKey].add(attrValue);
        }
    }

    if (mergeIntoOneList) {
        const mergedUniqueList: string[] = [];
        for (const attrValuesSet of Object.values(uniqueAttributes)) {
            attrValuesSet.forEach((value) => {
                if (!mergedUniqueList.includes(value)) {
                    mergedUniqueList.push(value);
                }
            });
        }
        return mergedUniqueList;
    }

    const uniqueAttributesArray: { [key: string]: string[] } = {};
    for (const [attrKey, attrValuesSet] of Object.entries(uniqueAttributes)) {
        uniqueAttributesArray[attrKey] = Array.from(attrValuesSet);
    }

    return uniqueAttributesArray;
}

/**
 * Convert the dataset from an array of IDataRow to a map of labels to features.
 * @param dataset - The dataset in the form of an array of IDataRow.
 * @returns A map containing labels as keys and arrays of features as values.
 */
export function FormatDatasetAsMap(dataset: IDataRow[]): {
    [label: string]: string[];
} {
    const formattedData: { [key: string]: string[] } = {};

    for (const dataRow of dataset) {
        const label = dataRow.target as string;
        const featuresArray = Object.values(dataRow.attr) as string[];
        formattedData[label] = featuresArray;
    }

    return formattedData;
}

// Examples of usage
// Fill the options params
const options: ILoadingOptions = {
    removeDuplicateTargets: true,
    removeEmptyVals: true,
    columnName: "Disease", // Column name that is our target or feature
    targetType: "string",
};

// Create attr map from CSV (key name - CSV header name, value - IDataRow attr name and type)
// change targetName: "Disease"
const attrMap_02: {
    [key: string]:
        | string
        | { name: string; type: "string" | "number" | "boolean" };
} = {
    Symptom_1: "Symptom_1",
    Symptom_2: "Symptom_2",
    Symptom_3: "Symptom_3",
    Symptom_4: "Symptom_4",
    Symptom_5: "Symptom_5",
    Symptom_6: "Symptom_6",
    Symptom_7: "Symptom_7",
    Symptom_8: "Symptom_8",
    Symptom_9: "Symptom_9",
    Symptom_11: "Symptom_11",
    Symptom_12: "Symptom_12",
    Symptom_13: "Symptom_13",
    Symptom_14: "Symptom_14",
    Symptom_15: "Symptom_15",
    Symptom_16: "Symptom_16",
    Symptom_17: "Symptom_17",
};

// change targetName: "stroke"
const attrMap_04: {
    [key: string]:
        | string
        | { name: string; type: "string" | "number" | "boolean" };
} = {
    gender: "gender",
    age: "age",
    hypertension: { name: "hypertension", type: "boolean" },
    heart_disease: { name: "heart_disease", type: "boolean" },
    ever_married: "ever_married",
    work_type: "work_type",
    Residence_type: "Residence_type",
    avg_glucose_level: { name: "avg_glucose_level", type: "number" },
    bmi: { name: "bmi", type: "number" },
    smoking_status: "smoking_status",
};

async function main() {
    const data = await LoadDatasetCSV(
        "./datasets/02/dataset.csv",
        attrMap_02,
        options
    );

    // console.log(data);

    const mergedData = MergeDatasetRows(data);
    //   console.log(mergedData);

    // Extract unique values for specific attributes
    const specificAttributes = ExtractUniqueAttributes(mergedData);
    console.log("Specific Unique Attributes:");
    console.log(specificAttributes);
}

// Uncomment to for test and run this file ts-node load-dataset.ts
//main();
