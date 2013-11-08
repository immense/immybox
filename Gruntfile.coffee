module.exports = (grunt) ->
  grunt.initConfig {

    # compile coffeescript files
    coffee:
      compile:
        files:
          'jquery.immybox.js': 'jquery.immybox.coffee'
          'knockout-immybox.js': 'knockout-immybox.coffee'

    # compile less files
    less:
      app:
        options:
          compress: true
        files:
          'immybox.css': 'immybox.less'

    # uglifyjs files
    uglify:
      immybox:
        src: 'jquery.immybox.js'
        dest: 'jquery.immybox.min.js'
      knockoutImmybox:
        src: 'knockout-immybox.js'
        dest: 'knockout-immybox.min.js'
  }

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'

  grunt.registerTask('default', [
    'coffee',
    'less',
    'uglify'
  ])
