import { readFileSync } from 'fs';
import { performance } from 'perf_hooks';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import { Interpreter } from '../src/interpreter.js';

class BenchmarkRunner {
  constructor() {
    this.results = [];
  }

  async runBenchmark(name, filePath, iterations = 1) {
    console.log(`\n📊 Running: ${name}`);
    console.log('─'.repeat(60));

    const source = readFileSync(filePath, 'utf-8');
    const times = [];
    const memoryBefore = process.memoryUsage();

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      try {
        const lexer = new Lexer(source);
        const tokens = lexer.scanTokens();
        const parser = new Parser(tokens);
        const statements = parser.parse();

        let output = '';
        const interpreter = new Interpreter({
          print: (msg) => { output += msg + '\n'; }
        });

        await interpreter.interpret(statements);
        interpreter.destroy();

        const elapsed = performance.now() - start;
        times.push(elapsed);

        if (i === 0) {
          process.stdout.write(`   Iteration 1: ${elapsed.toFixed(2)}ms`);
        } else if (i === iterations - 1) {
          process.stdout.write(` | Final: ${elapsed.toFixed(2)}ms\n`);
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return null;
      }
    }

    const memoryAfter = process.memoryUsage();
    const memoryDelta = (memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];

    const result = {
      name,
      iterations,
      avg: avg.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      median: median.toFixed(2),
      memoryDelta: memoryDelta.toFixed(2)
    };

    this.results.push(result);

    console.log(`   ✓ Average: ${result.avg}ms`);
    console.log(`   ✓ Min: ${result.min}ms | Max: ${result.max}ms | Median: ${result.median}ms`);
    console.log(`   ✓ Memory Δ: ${result.memoryDelta}MB`);

    return result;
  }

  printSummary() {
    console.log('\n' + '═'.repeat(60));
    console.log('📈 BENCHMARK SUMMARY');
    console.log('═'.repeat(60));
    console.log();
    console.log('Benchmark'.padEnd(30) + 'Avg Time'.padEnd(15) + 'Memory Δ');
    console.log('─'.repeat(60));

    for (const result of this.results) {
      const name = result.name.padEnd(30);
      const time = (result.avg + 'ms').padEnd(15);
      const mem = result.memoryDelta + 'MB';
      console.log(name + time + mem);
    }

    console.log('═'.repeat(60));
  }

  async exportBaseline(filename = 'baseline.json') {
    const baseline = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      results: this.results
    };

    const fs = await import('fs');
    fs.writeFileSync(filename, JSON.stringify(baseline, null, 2));
    console.log(`\n💾 Baseline saved to ${filename}`);
  }
}

// Main execution
async function main() {
  console.log('🚀 JPL Performance Benchmark Suite');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🔧 Node ${process.version}`);

  const runner = new BenchmarkRunner();

  // Run all benchmarks
  await runner.runBenchmark(
    'Loop Iteration (100k)',
    './benchmarks/loops.jawa',
    3
  );

  await runner.runBenchmark(
    'Function Calls (1M)',
    './benchmarks/function-calls.jawa',
    3
  );

  await runner.runBenchmark(
    'Array Operations (10k)',
    './benchmarks/array-operations.jawa',
    3
  );

  await runner.runBenchmark(
    'Recursive Fibonacci',
    './benchmarks/recursive.jawa',
    3
  );

  await runner.runBenchmark(
    'Object Methods',
    './benchmarks/object-methods.jawa',
    3
  );

  await runner.runBenchmark(
    'Nested Scope Access',
    './benchmarks/nested-scopes.jawa',
    3
  );

  runner.printSummary();
  await runner.exportBaseline('./benchmarks/baseline.json');
}

main().catch(console.error);
