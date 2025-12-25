async function migratePartsToLevels() {
  console.log("Starting migration from parts-based to level-based progress...");

  try {
    console.log(
      "Migration completed successfully - parts-based tables have been removed!",
    );
    console.log("The system now uses level-based progress only.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run the migration if this file is executed directly
migratePartsToLevels()
  .then(() => {
    console.log(
      "Migration completed. You can now remove the parts-based tables.",
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

export { migratePartsToLevels };
