# dataset.ts

The `dataset.ts` file contains TypeScript code that provides functionality to load and manipulate datasets from CSV files. It exports several functions to handle data loading, merging, and attribute extraction.

## Table of Contents

- [Interfaces](#interfaces)
- [Functions](#functions)
  - [LoadDatasetCSV](#loaddatasetcsv)
  - [MergeDatasetRows](#mergedatasetrows)
  - [ExtractUniqueAttributes](#extractuniqueattributes)
  - [FormatDatasetAsMap](#formatdatasetasmap)

## Interfaces

### IDataRow

Represents a single data row in the dataset. It consists of the following properties:

- `target`: The target value of the data row, which can be either a string or a number.
- `column` (optional): An optional column name associated with the target value.
- `attr`: A dictionary representing attribute-value pairs for the data row.

### ILoadingOptions

Options to configure the data loading process. It includes the following properties:

- `removeDuplicateTargets` (optional): If set to true, duplicate target values will be removed during data loading.
- `removeEmptyVals` (optional): If set to true, rows with empty attribute values will be skipped during data loading.
- `columnName`: The name of the column that represents the target attribute in the CSV file.
- `targetType` (optional): The target type to convert the target values. Supported values are "string" or "number".
- `attrLayout` (optional): The layout of attributes in the IDataRow object. Supported values are "vertical" or "horizontal".

## Functions

### LoadDatasetCSV

```typescript
async function LoadDatasetCSV(
    filepath: string,
    attrMap: { [key: string]: string | { name: string; type: "string" | "number" | "boolean" } },
    opts: ILoadingOptions
): Promise<IDataRow[]>
```

Loads a dataset from a CSV file and converts it to an array of data rows.

- `filepath`: The path to the CSV file to load.
- `attrMap`: A mapping of CSV header names to IDataRow attribute names and types.
- `opts`: Options to configure the data loading process.

### MergeDatasetRows

```typescript
function MergeDatasetRows(dataRows: IDataRow[]): IDataRow[]
```

Merges data rows with the same target value, combining their attribute values into one data row.

- `dataRows`: An array of IDataRow objects representing the dataset.

### ExtractUniqueAttributes

```typescript
function ExtractUniqueAttributes(
    dataRows: IDataRow[],
    attributeNames?: string[],
    mergeIntoOneList: boolean = true
): string[] | { [key: string]: string[] }
```

Extracts unique attribute values from a dataset.

- `dataRows`: An array of IDataRow objects representing the dataset.
- `attributeNames` (optional): An optional array of attribute names to consider. If provided, only attributes with these names will be processed.
- `mergeIntoOneList` (optional): If set to true, all unique attribute values will be merged into a single list. Otherwise, the result will be an object with attribute names as keys and arrays of unique attribute values as values.

### FormatDatasetAsMap

```typescript
function FormatDatasetAsMap(dataset: IDataRow[]): { [label: string]: string[] }
```

Converts a dataset from an array of IDataRow to a map of labels to features.

- `dataset`: The dataset in the form of an array of IDataRow.

## Usage

```typescript
// Examples of usage
const options: ILoadingOptions = {
    removeDuplicateTargets: true,
    removeEmptyVals: true,
    columnName: "Disease", // Column name that is our target or feature
    targetType: "string",
};

const attrMap_02: {
    [key: string]: string | { name: string; type: "string" | "number" | "boolean" };
} = {
    // Attribute mappings for the CSV headers
};

const data = await LoadDatasetCSV(
    "./datasets/02/dataset.csv",
    attrMap_02,
    options
);

const mergedData = MergeDatasetRows(data);

const specificAttributes = ExtractUniqueAttributes(mergedData);
console.log("Specific Unique Attributes:");
console.log(specificAttributes);
```
