/*global module, require*/
module.exports = function (grunt) {
  'use strict';

  var globalConfig = {
    src: 'src',
    style: 'style',
    docs: 'docs',
    dist: {
      root: ' dist',
      docs: 'dist/docs',
      style: 'dist/style'
    }
  };

  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('./package.json'),
    assemble : {
      docs: {
        options: {
          assets: '<%= globalConfig.docs  %>/assets',
          flatten: false,
          partials: ['<%= globalConfig.docs  %>/partials/*.hbs'],
          layout: '<%= globalConfig.docs  %>/layouts/default.hbs',
          data: ['<%= globalConfig.docs  %>/data/*.{json,yml}']
        },
        files: [{
          expand: true,
          cwd: '<%= globalConfig.style  %>',
          src: ['**/*.hbs'],
          dest: '<%= globalConfig.dist.docs  %>'
        }]
      }
    },
    shared_config: {
      style: {
        options: {
          name: "globalConfig",
          cssFormat: "dash"
        },
        src: "config.json",
        dest: [
          "style/config.scss"
        ]
      }
    },
    sass: {
      dist: {
        files : {
          '<%= globalConfig.dist.style  %>/stylesheets/style.css': '<%= globalConfig.style  %>/style.scss'
        }
      },
      docs: {
        options: {
          sourceComments: 'map',
        },
        files : {
          '<%= globalConfig.dist.docs  %>/assets/stylesheets/docs.css': '<%= globalConfig.docs  %>/assets/stylesheets/docs.scss'
        }
      },
    },
    myth: {
      options: {
        sourcemap: true
      },
      dist: {
        files: {
          '<%= globalConfig.dist.style  %>/stylesheets/style.css': '<%= globalConfig.dist.style  %>/stylesheets/style.css'
        }
      },
      docs: {
        files: {
          '<%= globalConfig.dist.docs  %>/assets/stylesheets/docs.css': '<%= globalConfig.dist.docs  %>/assets/stylesheets/docs.css'
        }
      }
    },
    clean: {
      dist: {
        files: [
        {
          dot: true,
          src: ['<%= globalConfig.dist.root  %>/*']
        }
        ]
      },
      docs: {
        files : [
        {
          dot: true,
          src: ['<%= globalConfig.dist.docs  %>/*']
        }
        ]
      }
    },
    copy: {
      dist: {
        files: [
        {
          expand: true,
          flatten: true,
          cwd: '<%= globalConfig.src  %>/',
          src: ['**/*.js'],
          dest: '<%= globalConfig.dist.style  %>/javascripts/'
        },
        {
          expand: true,
          cwd: '<%= globalConfig.src  %>/assets',
          src: ['**/*'],
          dest: '<%= globalConfig.dist.style  %>/assets/'
        }
        ]
      },
      docs: {
        files: [
        {
          expand: true,
          cwd: '<%= globalConfig.docs  %>/assets/',
          src: ['images/*', 'javascripts/**/*.js', 'stylesheets/*.css'],
          dest: '<%= globalConfig.dist.docs  %>/assets/'
        }
        ]
      }
    },
    watch: {
      hbs: {
        files: ['<%= globalConfig.docs  %>/**/*.hbs'],
        tasks: ['assemble:docs']
      },
      docs: {
        files: ['<%= globalConfig.docs  %>/src/assets/images/*', '<%= globalConfig.docs  %>/src/assets/javascripts/*'],
        tasks: ['copy:docs']
      },
      docsass: {
        files: ['<%= globalConfig.docs  %>/src/assets/stylesheets/*'],
        tasks: ['doccss']
      },
      sass: {
        files: ['<%= globalConfig.src  %>/**/*.scss', '<%= globalConfig.style  %>/**/*.scss'],
        tasks: ['distcss', 'copy:docs', 'doccss']
      },
      js: {
        files: ['<%= globalConfig.src  %>/**/*.js'],
        tasks: ['copy:dist', 'copy:docs']
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= globalConfig.dist.style  %>/stylesheets/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= globalConfig.dist.style  %>/stylesheets/',
        ext: '.min.css'
      }
    }
  });

require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('assemble');

grunt.registerTask('default', ['build']);
grunt.registerTask('distcss', ['sass:dist', 'myth:dist']);
grunt.registerTask('doccss', ['sass:docs', 'myth:docs']);
grunt.registerTask('dist', ['clean:dist', 'copy:dist', 'distcss', 'cssmin']);
grunt.registerTask('build', ['clean', 'shared_config', 'dist', 'clean:docs', 'copy:docs', 'doccss', 'assemble']);

};
