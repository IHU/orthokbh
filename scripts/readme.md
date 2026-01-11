# Default behavior (assumes ./baseline exists)

npx ts-node .\create-startup-kit.ts

# Specify source baseline, new name, and destination root

npx ts-node .\create-startup-kit.ts --source ../client-app --name umbraco-starter --dest ../kits

# Use a custom exclusion config

npx ts-node .\create-startup-kit.ts --config ./scripts/startup-kit.config.json
