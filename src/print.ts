import { PredictionResult } from "./test";

/**
 * Print prediction results to the CLI in a human-readable format.
 * @param {PredictionResult[]} predictionResults - The array of prediction results to print.
 */
export function PrintPredictResults(
    predictionResults: PredictionResult[]
): void {
    predictionResults.forEach((result) => {
        console.log("========================");
        console.log("Label:", result.label);
        console.log("Features:", result.features.join(", "));
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
