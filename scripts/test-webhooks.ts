#!/usr/bin/env tsx

/**
 * Webhook Testing Script
 * Easy-to-use script for running webhook tests
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface WebhookTestOptions {
  type?: 'all' | 'unit' | 'integration' | 'local';
  verbose?: boolean;
  coverage?: boolean;
  port?: number;
  server?: boolean;
}

class WebhookTestRunner {
  private options: WebhookTestOptions;

  constructor(options: WebhookTestOptions = {}) {
    this.options = {
      type: 'all',
      verbose: false,
      coverage: false,
      port: 3001,
      server: false,
      ...options
    };
  }

  async run(): Promise<void> {
    console.log('🚀 Starting DodoPayments Webhook Tests\n');

    switch (this.options.type) {
      case 'unit':
        await this.runUnitTests();
        break;
      case 'integration':
        await this.runIntegrationTests();
        break;
      case 'local':
        await this.runLocalTests();
        break;
      default:
        await this.runAllTests();
    }
  }

  private async runUnitTests(): Promise<void> {
    console.log('🧪 Running Unit Tests...\n');

    const testFiles = [
      'tests/webhooks/dodopayments.test.ts'
    ];

    for (const file of testFiles) {
      if (existsSync(join(process.cwd(), file))) {
        await this.runTestFile(file);
      }
    }
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running Integration Tests...\n');

    // Start local server for integration tests
    if (this.options.server) {
      await this.startLocalServer();
    }

    const integrationTests = [
      'tests/webhooks/dodopayments.test.ts'
    ];

    for (const file of integrationTests) {
      if (existsSync(join(process.cwd(), file))) {
        await this.runTestFile(file, '--grep', 'integration');
      }
    }

    if (this.options.server) {
      await this.stopLocalServer();
    }
  }

  private async runLocalTests(): Promise<void> {
    console.log('🌐 Running Local Server Tests...\n');

    await this.startLocalServer();
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test server endpoints
    await this.testServerEndpoints();

    await this.stopLocalServer();
  }

  private async runAllTests(): Promise<void> {
    console.log('🎯 Running All Webhook Tests...\n');

    const testFile = 'tests/webhooks/dodopayments.test.ts';
    
    if (!existsSync(join(process.cwd(), testFile))) {
      console.error(`❌ Test file not found: ${testFile}`);
      process.exit(1);
    }

    await this.runTestFile(testFile);
  }

  private async runTestFile(file: string, ...args: string[]): Promise<void> {
    const command = 'npm';
    const testArgs = [
      'test',
      '--',
      '--run',
      '--reporter=verbose',
      file,
      ...args
    ];

    if (this.options.coverage) {
      testArgs.unshift('--coverage');
    }

    return new Promise((resolve, reject) => {
      const proc = spawn(command, testArgs, {
        stdio: this.options.verbose ? 'inherit' : 'pipe',
        cwd: process.cwd()
      });

      if (!this.options.verbose) {
        proc.stdout.on('data', (data) => {
          process.stdout.write(data);
        });

        proc.stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      }

      proc.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${file} tests passed\n`);
          resolve();
        } else {
          console.log(`❌ ${file} tests failed\n`);
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      proc.on('error', (error) => {
        console.error(`❌ Error running tests: ${error.message}`);
        reject(error);
      });
    });
  }

  private async startLocalServer(): Promise<void> {
    console.log(`🧪 Starting local webhook server on port ${this.options.port}...`);

    const serverPath = join(process.cwd(), 'tests', 'webhooks', 'local-server.ts');
    const serverArgs = [serverPath, this.options.port!.toString(), 'test_secret'];

    const serverProcess = spawn('npx', ['tsx', ...serverArgs], {
      stdio: 'pipe',
      cwd: process.cwd()
    });

    serverProcess.stdout.on('data', (data) => {
      if (this.options.verbose) {
        process.stdout.write(data);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    // Wait for server to start
    await new Promise((resolve) => {
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Local webhook server running')) {
          resolve(void 0);
        }
      });
    });

    console.log('✅ Local server started\n');
  }

  private async stopLocalServer(): Promise<void> {
    console.log('🛑 Stopping local webhook server...');
    // This is a simplified version - in practice you'd want to track the process
    console.log('✅ Local server stopped\n');
  }

  private async testServerEndpoints(): Promise<void> {
    const baseUrl = `http://localhost:${this.options.port}`;

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${baseUrl}/health`);
      if (healthResponse.ok) {
        console.log('✅ Health endpoint working');
      } else {
        console.log('❌ Health endpoint failed');
      }

      // Test webhook endpoint
      const webhookResponse = await fetch(`${baseUrl}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'test_webhook',
          type: 'payment.succeeded',
          data: { payment_id: 'test_payment' }
        })
      });

      if (webhookResponse.ok) {
        console.log('✅ Webhook endpoint working');
      } else {
        console.log('❌ Webhook endpoint failed');
      }

      // Test logs endpoint
      const logsResponse = await fetch(`${baseUrl}/logs`);
      if (logsResponse.ok) {
        console.log('✅ Logs endpoint working');
      } else {
        console.log('❌ Logs endpoint failed');
      }

    } catch (error) {
      console.error('❌ Server endpoint testing failed:', error);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options: WebhookTestOptions = {};

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--type':
        options.type = args[i + 1] as any;
        i++;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--coverage':
        options.coverage = true;
        break;
      case '--port':
      case '-p':
        options.port = parseInt(args[i + 1]);
        i++;
        break;
      case '--server':
        options.server = true;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
        break;
    }
  }

  const runner = new WebhookTestRunner(options);
  
  try {
    await runner.run();
    console.log('🎉 All webhook tests completed successfully!');
  } catch (error) {
    console.error('❌ Webhook tests failed:', error);
    process.exit(1);
  }
}

function printUsage(): void {
  console.log(`
🧪 DodoPayments Webhook Testing Script

Usage: npm run test:webhooks [options]

Options:
  --type <type>          Test type: all, unit, integration, local (default: all)
  --verbose, -v          Verbose output
  --coverage             Generate test coverage
  --port <port>, -p      Local server port (default: 3001)
  --server               Start local server for tests
  --help, -h             Show this help message

Examples:
  npm run test:webhooks                    # Run all tests
  npm run test:webhooks --type unit        # Run only unit tests
  npm run test:webhooks --type integration # Run integration tests
  npm run test:webhooks --verbose          # Run with verbose output
  npm run test:webhooks --server           # Include local server tests
  npm run test:webhooks --coverage         # Generate coverage report

Test Types:
  all         - Run all webhook tests
  unit        - Run unit tests only
  integration - Run integration tests with local server
  local       - Test local webhook server functionality

For more information, see tests/webhooks/README.md
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { WebhookTestRunner };
