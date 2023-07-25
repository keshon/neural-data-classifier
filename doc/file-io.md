# file-io.ts

The `file-io.ts` file contains TypeScript code that provides functions to read and write data from and to CSV and JSON files using the PapaParse library.

## Table of Contents

- [Functions](#functions)
  - [ReadCSV](#readcsv)
  - [WriteCSV](#writecsv)
  - [ReadJSON](#readjson)
  - [WriteJSON](#writejson)

## Functions

### ReadCSV

```typescript
async function ReadCSV(filePath: string): Promise<any>
```

Reads data from a CSV file using PapaParse.

- `filePath`: The path to the CSV file.
- Returns: A Promise that resolves to an array of objects representing the CSV data.

### WriteCSV

```typescript
async function WriteCSV(filePath: string, data: any): Promise<void>
```

Writes data to a CSV file.

- `filePath`: The path to the CSV file.
- `data`: The data to be written to the file in the form of an array of objects representing CSV rows.
- Returns: A Promise that resolves when the data is successfully written to the file.

### ReadJSON

```typescript
async function ReadJSON(filePath: string): Promise<any>
```

Reads data from a JSON file.

- `filePath`: The path to the JSON file.
- Returns: A Promise that resolves to the parsed JSON data.

### WriteJSON

```typescript
async function WriteJSON(
    filePath: string,
    data: any,
    minify?: boolean
): Promise<void>
```

Writes data to a JSON file.

- `filePath`: The path to the JSON file. Nested directories will be created if they don't exist.
- `data`: The data to be written to the file. Should be JSON-serializable.
- `minify` (optional): Optional parameter to minify or not save JSON. If `true`, the JSON data will be minified.
- Returns: A Promise that resolves when the data is successfully written to the file.

## Usage

```typescript
// Example usage for reading and writing CSV and JSON files

// Read data from a CSV file
const csvFilePath = "./data/sample.csv";
try {
    const csvData = await ReadCSV(csvFilePath);
    console.log("CSV Data:", csvData);
} catch (error) {
    console.error("Error reading CSV file:", error.message);
}

// Write data to a CSV file
const csvDataToWrite = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "San Francisco" },
];
const csvOutputFilePath = "./data/output.csv";
try {
    await WriteCSV(csvOutputFilePath, csvDataToWrite);
    console.log("CSV data has been written to the file successfully.");
} catch (error) {
    console.error("Error writing to CSV file:", error.message);
}

// Read data from a JSON file
const jsonFilePath = "./data/sample.json";
try {
    const jsonData = await ReadJSON(jsonFilePath);
    console.log("JSON Data:", jsonData);
} catch (error) {
    console.error("Error reading JSON file:", error.message);
}

// Write data to a JSON file
const jsonDataToWrite = { name: "John Doe", age: 30, city: "New York" };
const jsonOutputFilePath = "./data/output.json";
try {
    await WriteJSON(jsonOutputFilePath, jsonDataToWrite, true); // Minify JSON
    console.log("JSON data has been written to the file successfully.");
} catch (error) {
    console.error("Error writing to JSON file:", error.message);
}
```
