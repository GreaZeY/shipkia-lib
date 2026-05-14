import fs from 'fs';
import path from 'path';
import * as docgen from 'react-docgen-typescript';
import { glob } from 'glob';

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/ui');
const OUTPUT_FILE = path.join(process.cwd(), 'src/lib/docs/metadata.json');

const options = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('@types/react');
    }
    return true;
  },
};

const parser = docgen.withCustomConfig('./tsconfig.app.json', options);

async function generateDocs() {
  console.log('🔍 Scanning components in:', COMPONENTS_DIR);
  
  const files = await glob('**/*.tsx', { cwd: COMPONENTS_DIR, absolute: true });
  
  const metadata = {};

  for (const filePath of files) {
    if (filePath.toLowerCase().includes('test') || filePath.toLowerCase().includes('index')) continue;

    const componentName = path.basename(filePath, '.tsx');
    const parentDirName = path.basename(path.dirname(filePath));

    // Only generate docs for main component files (e.g., Select/Select.tsx)
    // Ignore subcomponents like Select/SelectItem.tsx
    // Whitelist specific compound components that should be documented standalone
    const whitelistedSubcomponents = ['EditableGrid', 'VirtualizedGrid'];
    if (componentName !== parentDirName && !whitelistedSubcomponents.includes(componentName)) {
      continue;
    }

    console.log(`📄 Parsing ${componentName}...`);

    try {
      const docs = parser.parse(filePath);
      
      if (docs.length > 0) {
        metadata[componentName.toLowerCase()] = {
          name: componentName,
          props: docs[0].props,
          description: docs[0].description,
          path: filePath.replace(process.cwd(), '')
        };
      }
    } catch (e) {
      console.warn(`⚠️ Could not parse ${componentName}:`, e.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
  console.log(`✅ Documentation metadata generated at ${OUTPUT_FILE}`);
}

generateDocs();
