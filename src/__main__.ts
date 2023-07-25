import minimist from "minimist";

import {
    FormatDatasetAsMap,
    ILoadingOptions,
    LoadDatasetCSV,
    MergeDatasetRows,
} from "./dataset";
import { ReadJSON, WriteJSON } from "./file-io";
import { ITrainingOptions, TrainModel } from "./train";
import { testModel } from "./test";
import { PrintPredictResults } from "./print";

async function main() {
    const args = minimist(process.argv.slice(2), { string: ["dataset"] }); // Treat "dataset" argument as a string
    const train = args.train;
    const test = args.test;
    const dataset = args.dataset;

    try {
        if (train) {
            /**
             * Train the neural network using the provided dataset and save the model and feature-to-label map to JSON files.
             * @throws Error if any error occurs during training or file operations.
             */

            const datasetCSVFilepath = `./datasets/${dataset}/dataset.csv`; // original CSV dataset
            const datasetConfFilepath = `./datasets/${dataset}/datasetConfig.json`; // A name of target (label) column
            const datasetJSONFilepath = `./trained/${dataset}/input.json`; // converted dataset IDataRow[] interface
            const modelFilepath = `./trained/${dataset}/model.json`; // trained model of brain.js

            try {
                const datasetConfig = await ReadJSON(datasetConfFilepath);
                console.log(
                    `Configuration for dataset: ${datasetCSVFilepath}:`
                );
                console.log(datasetConfig);
                console.log(`\nTraining started..\n`);

                // Load dataset
                const options: ILoadingOptions = {
                    removeDuplicateTargets: true,
                    removeEmptyVals: true,
                    columnName: datasetConfig["label"],
                    targetType: datasetConfig["labelType"],
                };

                // 01/dataset.csv has veritcal attributes (unknown lentgh) at one column
                // 02/dataset.csv has horizontal attributes (known column's name)
                // We specify the name of a column and must autofill the rest.
                const attributeMap: { [key: string]: string } =
                    datasetConfig["attributeMap"];

                // Load dataset from CSV file
                let dataset = await LoadDatasetCSV(
                    datasetCSVFilepath,
                    attributeMap,
                    options
                );

                // Remove duplicates
                if (datasetConfig["attributeDir"] === "vertical") {
                    dataset = MergeDatasetRows(dataset);
                }

                // console.log(attrList);
                await WriteJSON(datasetJSONFilepath, dataset, true);

                // Define training options
                const trainingOptions: ITrainingOptions = {
                    iterations: 1000,
                    errorThresh: 0.00005,
                    log: true,
                    logPeriod: 100,
                    learningRate: 0.001,
                    momentum: 0.9,
                    callbackPeriod: 10,
                    timeout: Infinity,
                    hiddenLayers: [40],
                    activation: "leaky-relu",
                };

                // Format dataset to simple label-feature map
                const mappedDataset = FormatDatasetAsMap(dataset);

                // Train the neural network
                const trainedModel = TrainModel(mappedDataset, trainingOptions);

                // Save the trained neural network model to a JSON file
                await WriteJSON(modelFilepath, trainedModel, true);

                console.log(
                    "Training completed. Model saved to:",
                    modelFilepath
                );
            } catch (error: any) {
                throw new Error(
                    `Error during training model: ${error.message}`
                );
            }
            console.log(
                `Training complete using dataset file ${datasetCSVFilepath}`
            );
        } else if (test) {
            /**
             * Test the trained neural network with the provided test data and display predictions.
             * @throws Error if any error occurs during testing or file operations.
             */

            const datasetCSVFilepath = `./datasets/${dataset}/dataset.csv`; // original CSV dataset
            const modelFilepath = `./trained/${dataset}/model.json`;
            const datasetConfFilepath = `./datasets/${dataset}/datasetConfig.json`;
            const datasetJSONFilepath = `./trained/${dataset}/input.json`;

            try {
                const datasetConfig = await ReadJSON(datasetConfFilepath);
                console.log(
                    `Configuration for dataset: ${datasetCSVFilepath}:`
                );
                console.log(datasetConfig);
                console.log(`\nTesting started..\n`);

                // Load model from file
                const model = await ReadJSON(modelFilepath);
                // Load test from file
                let testJSONDataset = await ReadJSON(datasetJSONFilepath);

                // Remove duplicates
                if (datasetConfig["attributeDir"] === "vertical") {
                    testJSONDataset = MergeDatasetRows(testJSONDataset);
                }

                // Format dataset to simple label-feature map
                const mappedDataset = FormatDatasetAsMap(testJSONDataset);

                // Test model with test data
                const results = testModel(model, mappedDataset, 0, true);

                // Print result to CLI
                PrintPredictResults(results);
            } catch (error: any) {
                throw new Error(`Error during testing: ${error.message}`);
            }
        } else {
            console.log(`
Usage: run.cmd [options]

Options:
  --train          Train the neural network using the provided dataset.
  --test           Test the trained neural network with the provided test data.

Dataset Options:
  --dataset=01     Select dataset number 01.
  --dataset=02     Select dataset number 02.

Example usage:
  run.cmd --train --dataset=01
  run.cmd --test --dataset=02
`);
        }
    } catch (error: any) {
        console.error(error.message);
    }
}

// I want my `main` entry point in this language
main();
