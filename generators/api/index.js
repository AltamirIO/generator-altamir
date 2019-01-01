const fs = require('fs')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    // cli arguments
    super(args, opts)
  }

  async prompting () {
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
      {
        type: 'input',
        name: 'projectEntryPoint',
        message: 'entry point:',
        default: 'index.js',
      },
    ])
  }

  // create package.json
  createPackageJson () {
    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: this.answers.projectName,
      version: this.answers.projectVersion,
      description: this.answers.projectDescription,
      main: this.answers.projectEntryPoint,
    })
  }

  // install dependencies
  installDeps () {
    // dependencies
    this.yarnInstall([
      'express',
      'typescript',
    ])

    // dev dependencies
    this.yarnInstall([
      '@altamir/standards-tsconfig',
      '@altamir/standards-tslint',
    ], {'dev': true})
  }

  // copy files
  // https://stackoverflow.com/a/27386259
  writing() {
    this.fs.copy(
      this.templatePath('*'),
      this.destinationRoot(),
    )

    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot(),
    )
  }
}
