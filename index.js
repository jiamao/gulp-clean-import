
const through = require("through2");

module.exports =  function(options) {
    options = options || {};
    
    let stream = through.obj(function (file, enc, cb) {
        let pluginName = 'gulp-clean-import';
        if (!file) {
            this.emit("error", new PluginError(pluginName, "files can not be empty"));
            return cb();
        }
        else if (file.isNull()) {
            return cb();
        }

        else if (file.isStream()) {
            this.emit("error", new PluginError(pluginName, "streaming not supported"));
            return cb();
        }

        else if (file.isBuffer()) {
            if (!options.base) {
                options.base = file.base;
            }
            
            var content = '';
            if(file.contents) {
                content = file.contents.toString();
            }
            else if(fs.existsSync(file.path)) {
                content = fs.readFileSync(file.path, 'utf-8');
            }
            if(!content) return content;
            //处理掉import语句
            var reg = /import\s+(.*)from\s+[^\s]+;/ig;
            content = content.replace(reg, function(s, p) {
                return '';
            });
            
            file.contents = new Buffer(content);

            this.push(file);
            cb();
        }
        else {
            gutil.log(gutil.colors.cyan('warning:'), "there's something wrong with the file");
            return cb();
        }
    });
    return stream;
}