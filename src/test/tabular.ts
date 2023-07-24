import { NeuralNetwork } from "brain.js";
import { INeuralNetworkData } from "brain.js/dist/neural-network";
import { DatasetNamedRow } from "../load/tabular";

// Define the interface for input and output data types for the neural network
interface InputData {
    [feature: string]: number;
}

interface OutputData {
    [feature: string]: number;
}

interface PredictionResult {
    feature: { [key: string]: string };
    labels: string[];
    predictions: {
        feature: string;
        score: number;
        percentage: number;
    }[];
}

/**
 * Test the trained neural network with the provided test data and store prediction results.
 * @param model - The trained neural network model.
 * @param testData - The test data containing labels and features to predict.
 * @param topN - The number of top contenders to display (optional, default: 0, display all).
 * @param showPositiveOnly - Whether to show only the predictions with a positive score (optional, default: false).
 * @param showPercentage - Whether to show the percentage of each score across contenders (optional, default: false).
 * @returns An array containing the prediction results.
 */
export function testNamedModel(
    model: NeuralNetwork<INeuralNetworkData, INeuralNetworkData>,
    testData: DatasetNamedRow[],
    topN: number = 0, // Default to 0 (display all contenders)
    showPositiveOnly: boolean = false, // Default to false (show all predictions)
    showPercentage: boolean = false // Default to false (do not show percentage)
): PredictionResult[] {
    const predictionResults: PredictionResult[] = [];

    try {
        // Test the trained network with test data
        testData.forEach((data) => {
            const feature = data.feature;
            const label = data.label;

            const input: InputData = mapFeaturesToInputData(feature);

            const neuralNetwork: NeuralNetwork<InputData, OutputData> =
                new NeuralNetwork();
            neuralNetwork.fromJSON(JSON.parse(JSON.stringify(model)));

            const output: OutputData = neuralNetwork.run(input);

            const sortedOutput: [string, number][] =
                sortOutputDataByAbsoluteProbability(output);

            // Filter predictions with positive score if showPositiveOnly is true
            const filteredOutput: [string, number][] = showPositiveOnly
                ? sortedOutput.filter((entry) => entry[1] > 0)
                : sortedOutput;

            // Limit the number of matches to the topN closest matches
            const limitedOutput: [string, number][] =
                topN > 0 ? filteredOutput.slice(0, topN) : filteredOutput;

            const totalSum: number =
                calculateTotalProbabilitySum(filteredOutput);

            const predictionResult: PredictionResult = {
                feature,
                labels: [label],
                predictions: limitedOutput.map(
                    ([feature, score]: [string, number]) => {
                        const percentage: number = (score / totalSum) * 100;
                        return {
                            feature,
                            score,
                            percentage,
                        };
                    }
                ),
            };

            predictionResults.push(predictionResult);
        });
    } catch (error: any) {
        throw new Error(`Error testing predictions: ${error.message}`);
    }

    return predictionResults;
}

// Utility function to sort output data by absolute probability
function sortOutputDataByAbsoluteProbability(
    output: OutputData
): [string, number][] {
    return Object.entries(output).sort(
        (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    );
}

// Utility function to calculate total sum of probabilities for normalization
function calculateTotalProbabilitySum(
    sortedOutput: [string, number][]
): number {
    return sortedOutput.reduce((acc, entry) => acc + entry[1], 0);
}

// Utility function to map features to input data
function mapFeaturesToInputData(features: {
    [key: string]: string;
}): InputData {
    return Object.entries(features).reduce((acc, [key, value]) => {
        acc[key.toLowerCase()] = Number(value) || 0; // Convert to number, default to 0 if NaN
        return acc;
    }, {} as InputData);
}

/**
 * Print prediction results to the CLI in a human-readable format.
 * @param predictionResults - The array of prediction results to print.
 */
export function printPredictionResults(
    predictionResults: PredictionResult[]
): void {
    predictionResults.forEach((result) => {
        console.log("========================");
        console.log("Feature:", result.feature);
        console.log("Labels:", result.labels.join(", "));
        console.log("------------------------");
        console.log("Predicted Features:");
        console.log("------------------------");

        // Find the maximum length of the feature names for padding
        const maxLength = Math.max(
            ...result.predictions.map((prediction) => prediction.feature.length)
        );

        result.predictions.forEach((prediction) => {
            const feature = prediction.feature;
            const paddedFeature = feature.padEnd(maxLength, " ");
            const score = prediction.score.toFixed(7);
            const percentage = prediction.percentage.toFixed(2);

            console.log(`${paddedFeature}: ${score} - ${percentage}%`);
        });

        console.log("========================\n");
    });
}
