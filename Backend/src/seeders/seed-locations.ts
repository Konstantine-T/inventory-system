import { Location } from "../models";
import { LocationCreationAttributes } from "../types";

const locationData: LocationCreationAttributes[] = [
  { name: "მთავარი ოფისი" },
  { name: "კავეა გალერია" },
  { name: "კავეა თბილისი მოლი" },
  { name: "კავეა ისთ ფოინთი" },
  { name: "კავეა სითი მოლი" },
];

async function seedLocations(): Promise<void> {
  try {
    console.log("🌱 Seeding locations...");

    // Check if locations already exist
    const existingCount = await Location.count();
    if (existingCount > 0) {
      console.log("⚠️  Locations already exist, skipping seed");
      return;
    }

    // Bulk create locations
    const locations = await Location.bulkCreate(locationData);
    console.log(`✅ Created ${locations.length} locations`);
  } catch (error) {
    console.error("❌ Error seeding locations:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const { sequelize } = require("../models");

  seedLocations()
    .then(() => {
      console.log("✅ Seeding completed");
      return sequelize.close();
    })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export default seedLocations;
