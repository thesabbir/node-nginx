import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import nginmix from 'commander';

//Listen

nginmix.on('--help', () => {
  console.log(
    `
    nginmix verison ${nginmix.version()}
    `
  );
});

// Version number
nginmix
  .version('0.0.1');

// Usage
nginmix
  .usage('-n [domain name] -p [port to pass] -h [host]');

// Options
nginmix
  .option('-n, --name', 'Specify a domain name / Server Name')
  .option('-p, --port', 'Port number where your app is running')
  .option('-h, --host', 'Host where your sever will listening (Default 80)')
  .option('-e, --enabled', "List enabled sites")
  .option('-a, --available', "List available sites")
  .option('-v, --version', "nginmix version");

nginmix
  .parse(process.argv);



