import { NeuralNetwork } from "brain.js";
import { DatasetRow } from "../load/listed";

// Interface representing a single training example for the neural network
interface TrainingExample {
    input: { [label: string]: number };
    output: { [feature: string]: number };
}

// Interface representing the trained model and its associated feature-to-label mapping
export interface TrainedModel {
    model: NeuralNetwork<any, any>;
    map: FeatureToLabelMap;
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
    hiddenLayers: [40],
    activation: "leaky-relu",
};

/**
 * Create a mapping of features to labels based on the provided dataset.
 * @param dataset - The training dataset containing features and labels.
 * @returns The mapping of features to their corresponding labels.
 */
function createFeatureToLabelMap(dataset: DatasetRow[]): FeatureToLabelMap {
    const featureToLabelMap: FeatureToLabelMap = {};
    for (const { feature, label } of dataset) {
        const featureKey = (feature ?? "").trim().toLowerCase();
        const labelKey = (label ?? "").trim().toLowerCase();

        if (!featureToLabelMap[featureKey]) {
            featureToLabelMap[featureKey] = [];
        }
        featureToLabelMap[featureKey].push(labelKey);
    }
    return featureToLabelMap;
}

/**
 * Convert the feature-to-label mapping into an array of training examples for Brain.js.
 * @param featureToLabelMap - The mapping of features to their corresponding labels.
 * @returns An array of training examples for the neural network.
 */
function createTrainingData(
    featureToLabelMap: FeatureToLabelMap
): TrainingExample[] {
    const trainingData: TrainingExample[] = [];
    for (const [feature, labels] of Object.entries(featureToLabelMap)) {
        const input: { [label: string]: number } = {};
        for (const label of labels) {
            input[label] = 1;
        }
        trainingData.push({ input, output: { [feature]: 1 } });
    }
    return trainingData;
}

/**
 * Train a neural network with the provided data and options.
 * @param dataset - The training dataset containing features and labels.
 * @param options - Options for training the neural network (optional).
 * @returns The trained model and the feature-to-label mapping.
 */
export async function trainModel(
    dataset: DatasetRow[],
    options?: any
): Promise<TrainedModel> {
    if (dataset.length === 0) {
        throw new Error("The dataset is empty.");
    }

    console.log(dataset);
    // Step 1: Create a mapping of features to labels based on the dataset
    const featureToLabelMap: FeatureToLabelMap =
        createFeatureToLabelMap(dataset);

    // Step 2: Convert the data into training examples for the neural network
    const trainingData: TrainingExample[] =
        createTrainingData(featureToLabelMap);

    // Step 3: Train the neural network
    const neuralNetOptions = {
        ...DEFAULT_TRAINING_OPTIONS,
        ...options, // Override default options with custom options if provided
    };

    const net = new NeuralNetwork(neuralNetOptions);
    net.train(trainingData);

    // Return the trained model and the associated feature-to-label mapping (deep copy)
    return {
        model: net,
        map: { ...featureToLabelMap },
    };
}
