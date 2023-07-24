import { readCSVPapa } from "../fileio";

// Interface representing a single row in the dataset
export interface DatasetRow {
    feature: string;
    label: string;
}

export async function loadDataset(
    filePath: string,
    isHorizonal: boolean
): Promise<DatasetRow[]> {
    try {
        const csvData = await readCSVPapa(filePath);
        const nestedArray: DatasetRow[] = [];
        let flatArray: DatasetRow[] = [];
        if (isHorizonal) {
            // console.log(csvData);
            for (const row of csvData) {
                if (row.length == 0) {
                    continue;
                }
                // console.log(row);
                nestedArray.push({
                    feature: row[0],
                    label: row
                        .slice(1)
                        .filter((item: string) =>
                            item.replace("_", " ").trim()
                        ),
                });
            }

            for (const item of nestedArray) {
                const { feature, label } = item;
                for (const singleLabel of label) {
                    flatArray.push({
                        feature: feature,
                        label: singleLabel,
                    });
                }
            }
        } else {
            flatArray = csvData;
        }

        const filteredDataset = removeDuplicateLabels(flatArray);
        return filteredDataset;
    } catch (error: any) {
        throw new Error(`Error loading dataset from CSV: ${error.message}`);
    }
}

function removeDuplicateLabels(dataset: DatasetRow[]): DatasetRow[] {
    const uniqueLabelsMap: Map<string, Set<string>> = new Map();

    const filteredDataset: DatasetRow[] = [];
    for (const row of dataset) {
        const { feature, label } = row;
        const featureLabels = uniqueLabelsMap.get(feature) || new Set();

        if (!featureLabels.has(label)) {
            featureLabels.add(label);
            uniqueLabelsMap.set(feature, featureLabels);
            filteredDataset.push({ feature, label });
        }
    }

    return filteredDataset;
}

// Interface representing a single row in the dataset
export interface DatasetNamedRow {
    feature: { [key: string]: string };
    label: string;
}
