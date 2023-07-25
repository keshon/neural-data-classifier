# test.ts

The `test.ts` file contains TypeScript code that provides functions to test a trained neural network model with provided test data and store prediction results.

## Interfaces

### PredictionResult

An interface representing the prediction results for a single test case. It consists of the following properties:

- `label`: The label associated with the test case.
- `features`: An array of strings representing the features used for prediction.
- `predictions`: An array of prediction objects, each containing:
  - `feature`: The feature predicted by the model.
  - `score`: The score (probability) assigned to the prediction by the model.
  - `percentage`: The percentage of the prediction score relative to other contenders.

## Functions

### testModel

```typescript
export function testModel(
    model: NeuralNetwork<IInput, IOutput>,
    testData: { [label: string]: string[] },
    topN: number = 0,
    showPositiveOnly: boolean = false
): PredictionResult[]
```

Tests the trained neural network with the provided test data and stores prediction results.

- `model`: The trained neural network model of type `NeuralNetwork<IInput, IOutput>`.
- `testData`: An object representing the test data containing labels as keys and arrays of features as values.
- `topN` (optional): The number of top contenders to display. By default, all contenders are displayed.
- `showPositiveOnly` (optional): A boolean indicating whether to show only the predictions with a positive score. By default, all predictions are shown.

### mapFeaturesToInputData

```typescript
function mapFeaturesToInputData(features: string[]): IInput
```

A utility function to map features to input data.

- `features`: An array of strings representing the features to be mapped.
- Returns: The input data with binary representation for each feature.

### sortOutputDataByAbsoluteProbability

```typescript
function sortOutputDataByAbsoluteProbability(output: IOutput): [string, number][]
```

A utility function to sort output data by absolute probability.

- `output`: The output data to be sorted.
- Returns: An array of tuples containing feature and absolute probability pairs.

### calculateTotalProbabilitySum

```typescript
function calculateTotalProbabilitySum(sortedOutput: [string, number][]): number
```

A utility function to calculate the total sum of probabilities for normalization.

- `sortedOutput`: The sorted output data.
- Returns: The total sum of probabilities.

## Usage

```typescript
// Import the necessary types and functions from other modules
import { NeuralNetwork } from "brain.js";
import { IInput, IOutput } from "./train";

// Example usage to test the trained neural network model
const trainedModel = new NeuralNetwork<IInput, IOutput>();
// Assume the model has been trained and loaded with data

const testCases = {
    "case1": ["feature1", "feature2", "feature3"],
    "case2": ["feature2", "feature4"],
    "case3": ["feature1", "feature3", "feature5"],
};

try {
    const predictionResults = testModel(trainedModel, testCases, 3, true);
    console.log("Prediction Results:", predictionResults);
} catch (error) {
    console.error("Error testing predictions:", error.message);
}
```
