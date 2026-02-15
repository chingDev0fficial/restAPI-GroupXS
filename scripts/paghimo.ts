import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const [, , type, name] = process.argv;

if (!type || !name) {
  console.error("Usage: npm run make <type> <Name>");
  console.error("Example: npm run make controller UserController");
  process.exit(1);
}

const templates: Record<string, (name: string) => string> = {
  controller: (name) => `import type { Request, Response } from "express";
import Controller from "./Controller";

export default class ${name} extends Controller {
    // Implement the logic for the ${name} controller
    // This could include methods for creating, updating, deleting, and retrieving users
    // Each method will typically take a Request and Response object, and return a Promise
    // The Promise will resolve to the data to be sent in the response
    // The Promise will reject with an error if there is an issue
    // The Promise will resolve to the data to be sent in the response
    
}
`,
  route: (name) => {
    // const controllerName = name.replace("Routes", "Controller");
    // const prefix = name.replace("Routes", "").toLowerCase();
    return `import { Router } from "express";
// import the target controller here
// e.g. import NameController from "../Controllers/NameController";

const router = Router();
// create a new instance of the target controller here
// e.g. const NameController = new NameController();

// Add your routes here

export default router;
`;
  },

  // more templates here
  // add your templates here
  // add your templates here
};

const dirs: Record<string, string> = {
  controller: "src/Api/V1/Controllers",
  route: "src/Api/V1/Routes",
};

if (!templates[type]) {
  console.error(
    `Unknown type: "${type}". Available: ${Object.keys(templates).join(", ")}`
  );
  process.exit(1);
}

const dir = dirs[type]!;
const filePath = join(dir, `${name}.ts`);

if (existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

writeFileSync(filePath, templates[type]!(name));
console.log(`Created: ${filePath}`);
