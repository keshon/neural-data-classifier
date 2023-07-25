import { NeuralNetwork } from "brain.js";
import { IDataRow } from "./dataset";

// Define the interface for input and output data types for the neural network
export interface IInput {
    [feature: string]: number;
}

export interface IOutput {
    [label: string]: number;
}

// Interface representing the training data that Brain.js will understand
interface ITrainingSample {
    input: IInput;
    output: IOutput;
}

// Define the interface for the training options
export interface ITrainingOptions {
    iterations: number;
    errorThresh?: number;
    log?: boolean;
    logPeriod?: number;
    learningRate: number;
    momentum?: number;
    callbackPeriod?: number;
    timeout?: number;
    hiddenLayers?: number[];
    activation?: "sigmoid" | "relu" | "leaky-relu" | "tanh";
}

/**
 * Train the neural network model with the provided dataset and options.
 * @param dataset - The training dataset containing labels as keys and arrays of features as values.
 * @param options - The training options for the neural network.
 * @returns The trained neural network model.
 */
export function TrainModel(
    dataset: { [label: string]: string[] },
    options: ITrainingOptions
): NeuralNetwork<any, any> {
    const net = new NeuralNetwork(options);

    // Prepare training data
    const uniqueFeatures: string[] = Array.from(
        new Set(Object.values(dataset).flat())
    );

    // Create an input lookup table
    const inputLookup: { [feature: string]: number } = {};
    uniqueFeatures.forEach((feature, index) => {
        inputLookup[feature] = index;
    });

    const trainingData: ITrainingSample[] = Object.entries(dataset).map(
        ([label, features]) => {
            const input: { [feature: string]: number } = {};
            const output: { [label: string]: number } = {};

            // Initialize input and output objects
            uniqueFeatures.forEach((feature) => {
                input[feature] = 0;
            });
            Object.keys(dataset).forEach((d) => {
                output[d] = 0;
            });

            features.forEach((feature) => {
                const index = inputLookup[feature];
                input[feature] = 1; // Set the corresponding feature input to 1
            });
            output[label] = 1; // Set the corresponding label output to 1

            return { input, output };
        }
    );

    // Train the model
    net.train(trainingData, options);

    return net;
}
