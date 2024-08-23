const { exec } = require('child_process');

// Command line arguments
const command = process.argv[2];
const migrationName = process.argv[3];

// Valid Migration Commands
const validCommands = ['create', 'up', 'down', 'list', 'prune'];
if (!validCommands.includes(command)) {
  console.error(
    `Invalid command: Command must be one of ${validCommands.join(', ')}`,
  );
  process.exit(1);
}

const commandsWithoutMigrationRequired = ['list', 'prune'];
if (!commandsWithoutMigrationRequired.includes(command)) {
  if (!migrationName) {
    console.error('Migration name is required');
    process.exit(1);
  }
}

function runNpmScript() {
  return new Promise((resolve, reject) => {
    let execCommand = '';
    if (commandsWithoutMigrationRequired.includes(command)) {
      execCommand = `npm run migrate:${command}`;
    } else {
      execCommand = `npm run migrate:${command} -- ${migrationName}`;
    }

    console.log(`Running command: ${execCommand}`);

    const childProcess = exec(execCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error running script: ${error.message}`);
      } else {
        resolve(stdout);
      }
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  });
}

runNpmScript()
  .then((output) => {
    console.info(output);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
