# print.ts

The `print.ts` file contains TypeScript code that provides a function to print prediction results to the command-line interface (CLI) in a human-readable format.

## Functions

### PrintPredictResults

```typescript
export function PrintPredictResults(predictionResults: PredictionResult[]): void
```

Prints prediction results to the CLI in a human-readable format.

- `predictionResults`: An array of `PredictionResult` objects representing the prediction results to print.

## Usage

```typescript
// Import the necessary types and function from other modules
import { PredictionResult } from "./test";

// Example usage to print prediction results
const samplePredictionResults: PredictionResult[] = [
    {
        label: "malignant neoplasm of lung",
        features: [
            "lesion",
            "cough",
            "lung nodule",
            "shortness of breath",
            "haemoptysis",
            "debilitation",
            "gurgle",
            "ache",
            "rale",
            "night sweat",
            "decreased translucency",
            "asthenia",
            "metastatic lesion",
            "agitation",
            "irritable mood",
        ],
        predictions: [
            { feature: "carcinoma of lung", score: 0.5056241, percentage: 50.57 },
            { feature: "malignant neoplasm of lung", score: 0.4893732, percentage: 48.94 },
            { feature: "malignant neoplasm of breast", score: 0.0034345, percentage: 0.34 },
            { feature: "chronic kidney failure", score: 0.0014383, percentage: 0.14 },
        ],
    },
    {
        label: "septicemia",
        features: [
            "fever",
            "distress respiratory",
            "hypotension",
            "tachypnea",
            "chill",
            "lethargy",
            "bradycardia",
            "breech presentation",
            "cyanosis",
            "spontaneous rupture of membranes",
            "haemorrhage",
            "unresponsiveness",
            "rale",
            "apyrexial",
        ],
        predictions: [
            { feature: "sepsis (invertebrate)", score: 0.3428331, percentage: 51.44 },
            { feature: "septicemia", score: 0.3175772, percentage: 47.65 },
            { feature: "manic disorder", score: 0.0030623, percentage: 0.46 },
            { feature: "gastritis", score: 0.0020814, percentage: 0.31 },
            { feature: "epilepsy", score: 0.0006794, percentage: 0.10 },
            { feature: "coronary arteriosclerosis", score: 0.0002808, percentage: 0.04 },
        ],
    },
];

// Print the prediction results
PrintPredictResults(samplePredictionResults);
```

Example Output:

```
========================
Label: malignant neoplasm of lung
Features: lesion, cough, lung nodule, shortness of breath, haemoptysis, debilitation, gurgle, ache, rale, night sweat, decreased translucency, asthenia, metastatic lesion, agitation, irritable mood
------------------------
Predicted Features:
------------------------
carcinoma of lung           : 0.5056241 - 50.57%
malignant neoplasm of lung  : 0.4893732 - 48.94%
malignant neoplasm of breast: 0.0034345 - 0.34%
chronic kidney failure      : 0.0014383 - 0.14%
========================

========================
Label: septicemia
Features: fever, distress respiratory, hypotension, tachypnea, chill, lethargy, bradycardia, breech presentation, cyanosis, spontaneous rupture of membranes, haemorrhage, unresponsiveness, rale, apyrexial
------------------------
Predicted Features:
------------------------
sepsis (invertebrate)    : 0.3428331 - 51.44%
septicemia               : 0.3175772 - 47.65%
manic disorder           : 0.0030623 - 0.46%
gastritis                : 0.0020814 - 0.31%
epilepsy                 : 0.0006794 - 0.10%
coronary arteriosclerosis: 0.0002808 - 0.04%
========================
```
