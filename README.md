# Machine Learning with Brain.js - Research Project

This is a personal research project exploring the use of machine learning with Brain.js. The project focuses on the feature-label scenario and demonstrates how to train and test a neural network using Brain.js. Two differently formatted datasets are used, which are loaded into a common interface using attribute mapping to ensure consistent processing.

## Documentation (doc folder)

The project includes a /doc folder, where you can find individual markdown files named after the source files. These files provide detailed information about the methods and interfaces present in each source file. This documentation aims to help to understand the purpose and usage of different functions and interfaces in the codebase.

## Features

-   Loading and preprocessing datasets from CSV files.
-   Formatting datasets to a common feature-label map for training and testing.
-   Training a neural network using Brain.js with configurable options.
-   Testing the trained model with new data and obtaining prediction results.
-   Outputting prediction results in a human-readable format.

## Datasets

Two datasets with different formats are used in this project. These datasets are loaded and preprocessed using the provided tools to ensure compatibility with the neural network model. Attribute mapping is employed to convert the datasets into a common interface for easy processing.

## Installation

To run this project, make sure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in the terminal.
3. Install the required dependencies using npm:

```bash
npm install
```

## Usage

The project can be used to train a neural network with one of the datasets and then test the trained model with the other dataset. The command-line interface is used to trigger the training and testing processes.

### Using the "run.cmd" wrapper (on Windows only)

For simplicity there is a wrapper named "run.cmd" that is provided to run the project. It wraps `ts-node src/__main__.ts` commands and accepts arguments.

### Training

To train the neural network using one of the datasets, use the following command:

```bash
run --train --dataset=<dataset_number>
```

Replace `<dataset_number>` with the dataset number you want to use for training (e.g., `01` or `02` - correspoding subfolders inside `/datasets`). The trained model and other intermediate files will be saved in the `/trained` directory.

Example of training output:

```
run --train --dataset=01
iterations: 100, training error: 0.005161096035617374
iterations: 200, training error: 0.005141267007658591
iterations: 300, training error: 0.005074350162723186
iterations: 400, training error: 0.004915941659087565
iterations: 500, training error: 0.00467786168269278
iterations: 600, training error: 0.004370577895463286
iterations: 700, training error: 0.004003078114147197
iterations: 800, training error: 0.00370858469302403
iterations: 900, training error: 0.0033748814914147714
iterations: 1000, training error: 0.0029539210783946675
Training completed. Model saved to: ./trained/01/model.json
Training complete using dataset file ./datasets/01/dataset.csv
```

### Testing

To test the trained model with the other dataset, use the following command:

```bash
run --test --dataset=<dataset_number>
```

Replace `<dataset_number>` with the dataset number you want to use for testing (e.g., "01" or "02"). The testing results will be displayed in the terminal.

Example of testing output:

```
run --test --dataset=01
========================
Label: carcinoma breast
Features: mass in breast, mass of body structure, paresthesia, retropulsion, erythema, difficulty, lesion, estrogen use, burning sensation, dyspnea, swelling, formication
------------------------
Predicted Labels:
------------------------
carcinoma breast            : 0.5013131 - 47.47%
malignant neoplasm of breast: 0.4962638 - 46.99%
myocardial infarction       : 0.0434024 - 4.11%
pneumonia aspiration        : 0.0061305 - 0.58%
delusion                    : 0.0040335 - 0.38%
anxiety state               : 0.0030150 - 0.29%
melanoma                    : 0.0019802 - 0.19%
========================

========================
Label: hepatitis B
Features: inappropriate affect, tachypnea, yellow sputum, projectile vomiting, poor feeding, pain abdominal, abdominal tenderness, wheelchair bound, moan
------------------------
Predicted Labels:
------------------------
hepatitis B   : 0.9908005 - 95.07%
cholelithiasis: 0.0347123 - 3.33%
kidney disease:

 0.0167040 - 1.60%
========================
```

### How to read it

`Label` in the example is a name of the disease and `Features` are complete list of symptoms of that disease - it's our reference. By submitting this list (Features) to a trained model we expect to predict the very same Label that should match the reference one.

## Credits

This project utilizes the following libraries:

-   [Brain.js](https://github.com/BrainJS/brain.js) - A JavaScript library for building and training neural networks.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is intended for research and educational purposes and may not be suitable for production use. Use at your own risk.

## Author

Me and my new best friend ChatGPT
