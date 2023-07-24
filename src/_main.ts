import { NeuralNetwork } from "brain.js";
import { INeuralNetworkData } from "brain.js/dist/neural-network";
import minimist from "minimist";
import fs from "fs/promises";

import { readCSVPapa, readJSON, writeCSV, writeJSON } from "./fileio";

import { loadDataset } from "./load/listed";
import { TrainedModel, trainModel } from "./train/listed";
import { printPredictionResults, testModel } from "./test/listed";

const DATASET_FILEPATH = "./datasets/03/dataset.csv";
const MODEL_FILEPATH = "./trained/model-03.json";
const MAP_FILEPATH = "./trained/map-03.json";

/**
 * Train the neural network using the provided dataset and save the model and feature-to-label map to JSON files.
 * @throws Error if any error occurs during training or file operations.
 */
async function trainAndSaveModel(): Promise<void> {
    try {
        const dataset = await loadDataset(DATASET_FILEPATH, true);
        // const dataset = await loadDataset(DATASET_FILEPATH, "stroke");

        console.log(dataset);

        // Train model based on dataset
        const model: TrainedModel = await trainModel(dataset);

        // Save model and feature-to-label mappings as files
        await writeJSON(MODEL_FILEPATH, model.model, true);
        await writeJSON(MAP_FILEPATH, model.map);
    } catch (error: any) {
        throw new Error(
            `Error during training and saving model: ${error.message}`
        );
    }
}

/**
 * Test the trained neural network with the provided test data and display predictions.
 * @throws Error if any error occurs during testing or file operations.
 */
async function testTrainedModel(): Promise<void> {
    try {
        // Check if model file exists
        await fs.access(MODEL_FILEPATH);

        // Check if map file exists
        await fs.access(MAP_FILEPATH);

        // Load model from file
        const model: NeuralNetwork<INeuralNetworkData, INeuralNetworkData> =
            await readJSON(MODEL_FILEPATH);

        // Load map from file
        const map = await readJSON(MAP_FILEPATH);
        const tests = map; // Use the feature-to-label map as test data

        // Test model with test data
        const results = testModel(model, tests, 0, true);

        printPredictionResults(results);
    } catch (error: any) {
        throw new Error(`Error during testing predictions: ${error.message}`);
    }
}

/**
 * Save the map data to the dataset CSV file after sanitizing and cleaning the strings.
 * @returns Promise<void> - A Promise that resolves when the data is successfully saved to the dataset CSV file.
 * @throws Error if an error occurs during reading or writing.
 */
export async function saveMapToDataset(): Promise<void> {
    try {
        // Check if the map file exists
        fs.access(DATASET_FILEPATH);

        // Load map from file
        const data = await readCSVPapa(DATASET_FILEPATH);

        // Sanitize and clean the strings in the data
        const sanitizedData: any[] = data.map((row: any) => {
            const sanitizedRow: any = {};
            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    // Sanitize and clean each value in the row
                    sanitizedRow[key] = row[key]
                        .replace(/[^\w\s-]/g, "")
                        .toLowerCase();
                }
            }
            return sanitizedRow;
        });

        // Save the sanitized data to the dataset CSV file
        await writeCSV(DATASET_FILEPATH + "_cleaned.csv", sanitizedData);
    } catch (error: any) {
        throw new Error(`Error saving map to dataset: ${error.message}`);
    }
}

async function main() {
    const args = minimist(process.argv.slice(2));
    const train = args.t || args.train;
    const clean = args.c || args.clean;
    const test = args.v || args.test;

    try {
        if (train) {
            // Training
            await trainAndSaveModel();
            console.log(
                `Training complete using dataset file ${DATASET_FILEPATH}`
            );
        } else if (clean) {
            // Clean-up
            await saveMapToDataset();
            console.log(
                "Feature-to-label map has been saved to the dataset CSV file."
            );
        } else if (test) {
            // Testing
            await testTrainedModel();
        } else {
            // Testing by default
            await testTrainedModel();
            console.log(`Testing complete using test file ${MAP_FILEPATH}`);
        }
    } catch (error: any) {
        console.error(error.message);
    }
}

// Run the main function
main();
