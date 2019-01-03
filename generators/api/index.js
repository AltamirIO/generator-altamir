const Generator = require('yeoman-generator')

/**
 * @export
 * @class
 * @extends {Generator}
 */
module.exports = class generator extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'project name:',
        default: this.appname,
      },
      {
        type: 'input',
        name: 'projectVersion',
        message: 'version:',
        default: '0.1.0',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'description:',
      },
    ])
  }

  // create package.json
  createPackageJson() {
    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: this.answers.projectName.replace(' ', '-'),
      version: this.answers.projectVersion,
      description: this.answers.projectDescription,
      license: 'GTFO',
      author: 'Altamir Consulting, LLC',
      main: 'server.js',
      scripts: {
        start: 'npm run serve',
        build: 'tsc',
        dev: 'nodemon -r ./src/server.ts --exec ts-node -e ts --trace-sync-io',
        serve: 'npm run build && node dist/server.js',
      },
    })
  }

  // copy files
  // https://stackoverflow.com/a/27386259
  writing() {
    this.fs.copy(
      this.templatePath('**/*'),
      this.destinationRoot(),
    )

    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot(),
    )

    // copy .env.example to .env
    this.fs.copy(
      this.templatePath('.env.example'),
      this.destinationRoot('.env'),
    )
  }

  // install dependencies
  install() {
    // dependencies
    this.yarnInstall([
      'bcrypt',
      'body-parser',
      'compression',
      'cron',
      'dotenv',
      'errorhandler',
      'express',
      'helmet',
      'jsonwebtoken',
      'mongoose',
      'passport',
      'passport-jwt',
      'passport-local',
      'validator',
    ])

    // dev dependencies
    this.yarnInstall([
      '@altamir/standards-tsconfig',
      '@altamir/standards-tslint',
      '@types/express',
      '@types/mongoose',
      '@types/node',
      'morgan',
      'nodemon',
      'ts-node',
      'typescript',
    ], { dev: true })
  }

  end() {
    this.log('')
    this.log('')
    this.log('Congratulations! Your API is ready to go!')
    this.log('Go ahead and run:')
    this.log('')
    this.log('  yarn dev')
    this.log('')
    this.log('and edit your .env variables. Good luck!')
  }
}
