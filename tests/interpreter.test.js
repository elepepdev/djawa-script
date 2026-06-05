import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

// The directory containing our .jawa test files
const featuresDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'features');

// Get all .jawa files from the features directory
const jawaTestFiles = fs.readdirSync(featuresDir).filter(file => file.endsWith('.jawa')).sort();

describe('JawaScript Interpreter Feature Tests', () => {
  jawaTestFiles.forEach(file => {
    test(`should correctly execute ${file}`, async () => {
      const filePath = path.join(featuresDir, file);
      const jawaCode = fs.readFileSync(filePath, 'utf8');
      
      const outputs = [];
      const mockPrint = (val) => outputs.push(val);
      const mockPrompt = (msg) => "Mock Input";

      try {
        const lexer = new Lexer(jawaCode);
        const tokens = lexer.scanTokens();
        const parser = new Parser(tokens);
        const statements = parser.parse();
        
        const interpreter = new Interpreter({ 
          print: mockPrint,
          prompt: mockPrompt 
        });
        await interpreter.interpret(statements);
        
        const combinedOutput = outputs.join('\n');
        
        // Use toMatchSnapshot() for everything, as it is robust for multi-line output.
        // For Math functions, if the order of output is consistent, snapshot should be fine.
        // If not, we might need to be more clever, but let's try strict snapshot matching
        // to ensure deterministic behavior first.
        expect(combinedOutput).toMatchSnapshot();
      } catch (error) {
        // Some tests expect errors to be printed as part of the output
        console.error(`Error executing ${file}: ${error.message}`);
        throw error;
      }
    });
  });
});
