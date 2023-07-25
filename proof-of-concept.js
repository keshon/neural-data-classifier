import { NeuralNetwork } from "brain.js";
import { writeFileSync, readFile, existsSync, readFileSync } from "fs";
import { parse } from "csv-parse";

const inputFile = "data_map.json";
const modelFile = "trained_model.json";

function trainAndSaveModel(parsedData) {
    // Step 2: Create a mapping of inputs to outputs (features to labels)
    const featureToLabel = {};
    parsedData.forEach((row) => {
        const feature = row[0].trim().toLowerCase();
        const label = row[1].trim().toLowerCase();

        if (!featureToLabel[feature]) {
            featureToLabel[feature] = [];
        }
        featureToLabel[feature].push(label);
    });

    // Step 3: Convert the data into training examples for Brain.js
    const trainingData = [];
    Object.entries(featureToLabel).forEach(([feature, labels]) => {
        const input = {};
        labels.forEach((label) => {
            input[label] = 1;
        });
        trainingData.push({ input, output: { [feature]: 1 } });
    });

    // Step 4: Train the neural network
    const net = new NeuralNetwork({
        learningRate: 0.01,
        hiddenLayers: [10, 5],
        iterations: 1000,
        errorThresh: 0.001,
        activation: "tanh", // 'sigmoid', 'relu', 'tanh'
    });
    net.train(trainingData);

    // Save the trained data to files
    writeFileSync(modelFile, JSON.stringify(net.toJSON()));
    writeFileSync(inputFile, JSON.stringify(featureToLabel));
}

function testPredictions(trainedNet, testData) {
    // Step 5: Test the trained network with test data
    Object.entries(testData).forEach(([label, features]) => {
        const input = {};
        features.forEach((feature) => {
            input[feature.toLowerCase()] = 1;
        });

        const output = trainedNet.run(input);
        const sortedOutput = Object.entries(output).sort((a, b) => b[1] - a[1]);

        console.log("Label:", label);
        console.log("Features:", JSON.stringify(features));

        // Calculate total sum of probabilities for normalization
        const totalSum = sortedOutput.reduce((acc, entry) => acc + entry[1], 0);

        sortedOutput.forEach((entry) => {
            const predictedFeature = entry[0];
            const probability = (entry[1] / totalSum) * 100;
            console.log(`${predictedFeature}: ${probability.toFixed(2)}%`);
        });

        console.log("------------------------");
    });
}

readFile("dataset.csv", "utf8", (err, data) => {
    if (err) throw err;
    parse(data, { delimiter: ";" }, (err, csvData) => {
        if (err) throw err;

        if (process.argv.includes("-train")) {
            trainAndSaveModel(csvData.slice(1)); // Skip the header row
        } else {
            // Check if model file exists
            if (existsSync(modelFile)) {
                const modelData = readFileSync(modelFile, "utf8");
                const trainedNet = new NeuralNetwork();
                trainedNet.fromJSON(JSON.parse(modelData));

                // Load input to output test data synchronously
                try {
                    const inputData = readFileSync(
                        inputFile,
                        "utf8"
                    );
                    const testData = JSON.parse(inputData);
                    testPredictions(trainedNet, testData);
                } catch (error) {
                    console.error("Error loading test data:", error.message);
                }
            } else {
                trainAndSaveModel(csvData.slice(1)); // Train and save data to file
            }
        }
    });
});
