import { NeuralNetwork } from "brain.js";
import { IInput, IOutput } from "./train";

// Interface for storing the prediction results
export interface PredictionResult {
    label: string;
    features: string[];
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
export function testModel(
    model: NeuralNetwork<IInput, IOutput>,
    testData: { [label: string]: string[] },
    topN: number = 0, // Default to 0 (display all contenders)
    showPositiveOnly: boolean = false // Default to false (show all predictions)
): PredictionResult[] {
    const predictionResults: PredictionResult[] = [];

    try {
        // Test the trained network with test data
        Object.entries(testData).forEach(
            ([label, features]: [string, string[]]) => {
                // Convert the features to input data format
                const input: IInput = mapFeaturesToInputData(features);

                // Clone the model to avoid modifying the original model
                const neuralNetwork: NeuralNetwork<IInput, IOutput> =
                    new NeuralNetwork();
                neuralNetwork.fromJSON(JSON.parse(JSON.stringify(model)));

                // Get the output from the neural network based on the input data
                const output: IOutput = neuralNetwork.run(input);

                // Sort the output data by absolute probability for better visualization
                const sortedOutput: [string, number][] =
                    sortOutputDataByAbsoluteProbability(output);

                // Filter predictions with positive score if showPositiveOnly is true
                const filteredOutput: [string, number][] = showPositiveOnly
                    ? sortedOutput.filter((entry) => entry[1] > 0)
                    : sortedOutput;

                // Limit the number of matches to the topN closest matches
                const limitedOutput: [string, number][] =
                    topN > 0 ? filteredOutput.slice(0, topN) : filteredOutput;

                // Calculate the total sum of probabilities for normalization
                const totalSum: number =
                    calculateTotalProbabilitySum(filteredOutput);

                // Store the prediction results for the current label
                const predictionResult: PredictionResult = {
                    label,
                    features,
                    predictions: limitedOutput.map(
                        ([feature, score]: [string, number]) => {
                            // Calculate the percentage of each score across contenders
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
            }
        );
    } catch (error: any) {
        throw new Error(`Error testing predictions: ${error.message}`);
    }

    return predictionResults;
}

/**
 * Utility function to map features to input data.
 * @param {string[]} features - The features to be mapped.
 * @returns {InputData} The input data with binary representation for each feature.
 */
function mapFeaturesToInputData(features: string[]): IInput {
    return features.reduce((acc, feature) => {
        acc[feature.toLowerCase()] = 1; // Use binary representation for features (present or absent)
        return acc;
    }, {} as IInput);
}

/**
 * Utility function to sort output data by absolute probability.
 * @param {OutputData} output - The output data to be sorted.
 * @returns {[string, number][]} An array of tuples containing feature and absolute probability pairs.
 */
function sortOutputDataByAbsoluteProbability(
    output: IOutput
): [string, number][] {
    return Object.entries(output).sort(
        (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    );
}

/**
 * Utility function to calculate the total sum of probabilities for normalization.
 * @param {[string, number][]} sortedOutput - The sorted output data.
 * @returns {number} The total sum of probabilities.
 */
function calculateTotalProbabilitySum(
    sortedOutput: [string, number][]
): number {
    return sortedOutput.reduce((acc, entry) => acc + entry[1], 0);
}
