import { NeuralNetwork } from "brain.js";
import { DatasetNamedRow } from "../load/tabular";

// Interface representing a single training example for the neural network
interface TrainingExample {
    input: { [label: string]: number };
    output: { [feature: string]: number };
}

// Interface representing the trained model and its associated feature-to-label mapping
export interface TrainedModel {
    model: NeuralNetwork<any, any>;
    map: DatasetNamedRow[]; // Store the dataset for reference during testing
}

// Interface representing the mapping of features to labels
interface FeatureToLabelMap {
    [feature: string]: string[];
}

// Default options for the neural network training
const DEFAULT_TRAINING_OPTIONS = {
    iterations: 1000,
    errorThresh: 0.00005,
    log: true,
    logPeriod: 100,
    learningRate: 0.001,
    momentum: 0.9,
    callbackPeriod: 10,
    timeout: Infinity,
    invalidTrainOptsShouldThrow: true,
    hiddenLayers: [20],
    activation: "sigmoid",
};

/**
 * Train a neural network with the provided data and options.
 * @param dataset - The training dataset containing features and labels.
 * @param options - Options for training the neural network (optional).
 * @returns The trained model and the feature-to-label mapping.
 */
export async function trainModel(
    dataset: DatasetNamedRow[],
    options?: any
): Promise<TrainedModel> {
    if (dataset.length === 0) {
        throw new Error("The dataset is empty.");
    }

    // Step 1: Convert the data into training examples for the neural network
    const trainingData: TrainingExample[] = dataset.map((data) => {
        const feature = data.feature;
        const label = data.label;

        const input: { [label: string]: number } = {};
        for (const [key, value] of Object.entries(feature)) {
            input[key] = Number(value) || 0; // Convert to number, default to 0 if NaN
        }

        return {
            input,
            output: { [label]: Number(label) }, // Convert label to number
        };
    });

    // Step 2: Train the neural network
    const neuralNetOptions = {
        ...DEFAULT_TRAINING_OPTIONS,
        ...options, // Override default options with custom options if provided
    };

    const net = new NeuralNetwork(neuralNetOptions);
    net.train(trainingData);

    // Step 3: Create the feature-to-label mapping
    const featureToLabelMap: FeatureToLabelMap =
        createFeatureToLabelMap(dataset);

    // Return the trained model and an empty map (as we don't have feature-to-label mapping in this format)
    return {
        model: net,
        map: [...dataset], // Make a copy of the dataset to avoid reference issues
    };
}

/**
 * Create a mapping of features to labels based on the provided dataset.
 * @param dataset - The training dataset containing features and labels.
 * @returns The mapping of features to their corresponding labels.
 */
function createFeatureToLabelMap(
    dataset: DatasetNamedRow[]
): FeatureToLabelMap {
    const featureToLabelMap: FeatureToLabelMap = {};
    for (const { feature, label } of dataset) {
        const featureKey = JSON.stringify(feature);
        const labelKey = label.trim().toLowerCase();

        if (!featureToLabelMap[featureKey]) {
            featureToLabelMap[featureKey] = [];
        }
        featureToLabelMap[featureKey].push(labelKey);
    }
    return featureToLabelMap;
}
