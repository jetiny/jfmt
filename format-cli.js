var fs = require('fs')
  , Finder = require('ufinder')
  , program = require('commander')
  , pkg = require('./package.json')
  , beautifile = require('beautifile')
  ;
program
    .version(pkg.version)
    .option('-p, --path [path]', 'input search directory default .')
    .option('-r, --recursive', 'recursive')
	.option('-f, --format [filter]', 'file format default js|css|html ')
    .option('-e, --excludeFile [filter]', 'file exclude filter')
    .option('-I, --includeDir [filter]', 'directory exclude filter')
    .option('-E, --excludeDir [filter]', 'directory exclude filter')
    .parse(process.argv)
    ;

(!program.path || (program.path === true)) && (program.path = '.');

function exitIfError(err){
    if (err) {
        console.error('!Error:');
        console.error(err);
        process.exit(1);
    }
}

var opts = {
	process : function(r, strPath, dir, file, stat){
		beautifile(r, function(err, result){
			exitIfError(err);
			fs.writeFile(r, result, function(err){
				console.log(r);
				exitIfError(err);
			});
		});
	},
	skipDir: true,
	skipFile: false,
	includeFile: ['.('+ (program.format || 'js|css|html') + ')$', 'i'],
};

['recursive', 'excludeFile', 'excludeDir', 'includeDir'].forEach(function(k){
	opts[k] = program[k];
});

var finder = new Finder(opts);
finder.find(program.path, exitIfError);

