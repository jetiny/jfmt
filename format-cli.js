var fs = require('fs')
  , path = require('path')
  , Finder = require('ufinder')
  , program = require('commander')
  , pkg = require('./package.json')
  , beautifile = require('beautifile')
  ;
program
    .version(pkg.version)
    .option('-p, --path [path]', 'input search directory default .')
    .option('-r, --recursive', 'recursive')
	.option('-f, --format [filter]', 'file format default js|css|html|json ')
    .option('-e, --excludeFile [filter]', 'file exclude filter')
    .option('-I, --includeDir [filter]', 'directory include filter')
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

function beautiJson(file, fn) {
	fs.readFile(file, function(err, data){
		if (err) {
			return fn(err);
		}
		try {
			data = JSON.stringify(JSON.parse(data), 4,4);
		} catch(err){
			return fn(err);
		}
		fn(null, data);
	});
}


var opts = {
	process : function(r, strPath, dir, file, stat){
		var ext = path.extname(r),
			done = function(err, result){
				exitIfError(err);
				fs.writeFile(r, result, function(err){
					console.log(r);
					exitIfError(err);
				});
			};
		if (ext === '.json') {
			beautiJson(r, done);
		}else {
			beautifile(r, done);
		}
	},
	skipDir: true,
	skipFile: false,
	includeFile: ['.('+ (program.format || 'js|css|html|json') + ')$', 'i'],
};

['recursive', 'excludeFile', 'excludeDir', 'includeDir'].forEach(function(k){
	opts[k] = program[k];
});

var finder = new Finder(opts);
finder.find(program.path, exitIfError);

