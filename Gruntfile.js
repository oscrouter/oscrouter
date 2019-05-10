const src = [{
  'expand': true,
  'src': [
    'index.js',
    'lib/**/*.js',
    'Routes.js',
    'Servers.js'
  ],
  'dest': 'dist/',
  'ext': '.js'
}]

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        sourceMap: true
      },
      build: {
        options: {
          presets: [
            [
              'env', {
                'targets': {
                  'node': '8.0'
                }
              }
            ]
          ]
        },
        files: src
      }
    },
    copy: {
        main: {
            files: [
                {expand: true, src: ['persistent.json'], dest: 'dist/', filter: 'isFile'}
            ]
        }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['babel:build', 'copy:main']);
}
