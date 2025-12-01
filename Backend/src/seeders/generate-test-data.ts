import { sequelize, Inventory, Location } from "../models";
import { InventoryCreationAttributes } from "../types";

interface GenerateOptions {
  count?: number;
  batchSize?: number;
  verbose?: boolean;
}

async function generateTestData(options: GenerateOptions = {}): Promise<void> {
  const { count = 500000, batchSize = 1000, verbose = true } = options;

  if (verbose) {
    console.log(
      `Starting to generate ${count.toLocaleString()} test records...`
    );
    console.log(`Batch size: ${batchSize.toLocaleString()}`);
  }

  try {
    // Get all locations
    const locations = await Location.findAll();
    if (locations.length === 0) {
      throw new Error("No locations found. Please run seeders first.");
    }

    const locationIds = locations.map((l) => l.id);
    if (verbose) {
      console.log(`Found ${locations.length} locations`);
    }

    // Calculate batches
    const batches = Math.ceil(count / batchSize);
    const startTime = Date.now();

    for (let i = 0; i < batches; i++) {
      const records: InventoryCreationAttributes[] = [];
      const currentBatchSize = Math.min(batchSize, count - i * batchSize);

      // Generate batch data
      for (let j = 0; j < currentBatchSize; j++) {
        const itemNumber = i * batchSize + j + 1;
        records.push({
          name: `Product ${itemNumber}`,
          price: parseFloat((Math.random() * 1000).toFixed(2)),
          locationId:
            locationIds[Math.floor(Math.random() * locationIds.length)],
        });
      }

      // Bulk insert
      await Inventory.bulkCreate(records, {
        validate: false,
        logging: false,
      });

      if (verbose) {
        const progress = (((i + 1) / batches) * 100).toFixed(2);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = Math.round(((i + 1) * batchSize) / parseFloat(elapsed));

        console.log(
          `📊 Progress: ${progress}% | ` +
            `Batch ${i + 1}/${batches} | ` +
            `Elapsed: ${elapsed}s | ` +
            `Rate: ${rate.toLocaleString()} items/sec`
        );
      }
    }

    if (verbose) {
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      const finalCount = await Inventory.count();
      console.log(`Test data generation completed!`);
      console.log(`Total time: ${totalTime} seconds`);
      console.log(`Total items in database: ${finalCount.toLocaleString()}`);
    }
  } catch (error) {
    console.error("Error generating test data:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateTestData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default generateTestData;
