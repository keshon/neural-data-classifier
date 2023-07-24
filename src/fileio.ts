import fs from "fs";
import path from "path";
import * as papa from "papaparse";

/**
 * Read data from a CSV file using PapaParse.
 * @param filePath - The path to the CSV file.
 * @param skipHeaderLines - The number of header lines to skip. Defaults to 0.
 * @returns Promise<CSVRow[]> - A Promise that resolves to an array of objects representing the CSV data.
 * @throws Error if the file doesn't exist or an error occurs during reading.
 */
export async function readCSVPapa(filePath: string): Promise<any> {
    try {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");

        return new Promise<any>((resolve, reject) => {
            papa.parse(fileContent, {
                complete: (results) => {
                    resolve(results.data as any);
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    } catch (error: any) {
        throw new Error(
            `Error reading CSV file at '${filePath}': ${error.message}`
        );
    }
}

/**
 * Write data to a CSV file.
 * @param filePath - The path to the CSV file.
 * @param data - The data to be written to the file in the form of an array of objects representing CSV rows.
 * @returns Promise<void> - A Promise that resolves when the data is successfully written to the file.
 * @throws Error if an error occurs during writing.
 */
export async function writeCSV(filePath: string, data: any): Promise<void> {
    try {
        if (data.length === 0) {
            throw new Error("Data array is empty. Nothing to write.");
        }

        const headers = Object.keys(data[0]);

        const csvContent = [
            headers.join(";"), // Write the headers as the first line
            ...data.map((row: any) =>
                headers.map((header) => row[header] || "").join(";")
            ),
        ].join("\n");

        await fs.promises.writeFile(filePath, csvContent, "utf-8");
    } catch (error: any) {
        throw new Error(
            `Error writing to CSV file at '${filePath}': ${error.message}`
        );
    }
}

/**
 * Read data from a JSON file.
 * @param filePath - The path to the JSON file.
 * @returns Promise<any> - A Promise that resolves to the parsed JSON data.
 * @throws Error if the file doesn't exist or an error occurs during reading or JSON parsing.
 */
export async function readJSON(filePath: string): Promise<any> {
    try {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error: any) {
        throw new Error(
            `Error reading JSON file at '${filePath}': ${error.message}`
        );
    }
}

/**
 * Write data to a JSON file.
 * @param filePath - The path to the JSON file. Nested directories will be created if they don't exist.
 * @param data - The data to be written to the file. Should be JSON-serializable.
 * @param minify - Optional parameter to  minify or not saved JSON.
 * @returns Promise<void> - A Promise that resolves when the data is successfully written to the file.
 * @throws Error if an error occurs during writing or JSON stringification.
 */
export async function writeJSON(
    filePath: string,
    data: any,
    minify?: boolean
): Promise<void> {
    try {
        const jsonData = minify
            ? JSON.stringify(data)
            : JSON.stringify(data, null, 4);

        // Ensure that the parent directories exist before writing the file
        const parentDir = path.dirname(filePath);
        await fs.promises.mkdir(parentDir, { recursive: true });

        await fs.promises.writeFile(filePath, jsonData, "utf-8");
    } catch (error: any) {
        throw new Error(
            `Error writing to JSON file at '${filePath}': ${error.message}`
        );
    }
}
