# train.ts

The `train.ts` file contains TypeScript code that provides a function to train a neural network model with the provided dataset and options using the Brain.js library.

## Interfaces

### IInput

An interface representing the input data for the neural network. It is defined as a dictionary with feature names as keys and numerical values.

### IOutput

An interface representing the output data for the neural network. It is defined as a dictionary with label names as keys and numerical values.

## Interfaces

### ITrainingSample

An interface representing a single training sample that Brain.js will understand. It consists of the following properties:

- `input`: An object representing the input data for the training sample, following the `IInput` interface.
- `output`: An object representing the output data for the training sample, following the `IOutput` interface.

### ITrainingOptions

An interface representing the options for training the neural network. It consists of the following properties:

- `iterations`: The number of training iterations.
- `errorThresh` (optional): The threshold for the error, training will stop when the error is below this threshold.
- `log` (optional): A boolean indicating whether to enable logging during training.
- `logPeriod` (optional): The period for logging, specifying how often to log progress during training.
- `learningRate`: The learning rate for the neural network.
- `momentum` (optional): The momentum for the neural network.
- `callbackPeriod` (optional): The period for callbacks, specifying how often to call the provided callback function during training.
- `timeout` (optional): The maximum training time in milliseconds. Training will stop if it exceeds this time.
- `hiddenLayers` (optional): An array representing the sizes of hidden layers in the neural network.
- `activation` (optional): The activation function to use for neurons in the neural network. Options include "sigmoid", "relu", "leaky-relu", and "tanh".

## Functions

### TrainModel

```typescript
export function TrainModel(
    dataset: { [label: string]: string[] },
    options: ITrainingOptions
): NeuralNetwork<any, any>
```

Trains the neural network model with the provided dataset and options.

- `dataset`: The training dataset containing labels as keys and arrays of features as values.
- `options`: The training options for the neural network.
- Returns: The trained neural network model of type `NeuralNetwork<any, any>`.

## Usage

```typescript
// Import the necessary types and functions from other modules
import { NeuralNetwork } from "brain.js";
import { IInput, IOutput } from "./train";

// Example usage to train the neural network model
const trainingData = {
    "cat": ["tail", "whiskers", "fur"],
    "dog": ["tail", "bark", "fur"],
    "bird": ["beak", "feathers"],
};

const trainingOptions = {
    iterations: 2000,
    errorThresh: 0.005,
    log: true,
    logPeriod: 100,
    learningRate: 0.3,
    momentum: 0.1,
    hiddenLayers: [3],
    activation: "sigmoid",
};

try {
    const trainedModel = TrainModel(trainingData, trainingOptions);
    console.log("Trained Model:", trainedModel);
} catch (error) {
    console.error("Error training the neural network:", error.message);
}
```
