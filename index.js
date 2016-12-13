/**
 * @file 入口模块
 * @author sparklewhy@gmail.com
 */

var path = require('path');

function getFileSubpath(filePath) {
    if (fis.util.isAbsolute(filePath)) {
        return path.relative(
            fis.project.getProjectPath(), filePath
        );
    }
    return filePath;
}

function addFileDep(filePath, file) {
    filePath = getFileSubpath(filePath);
    var info = fis.project.lookup(filePath);
    if (!info) {
        fis.log.warning('cannot find require resource file: %j in %j',
            filePath, file.subpath);
        return;
    }

    file.addRequire(info.file.getId());
    file.addLink(info.file.subpath);
    file.cache.addDeps(filePath);

    return info;
}

function copyDepInfo(src, dst) {
    var addFn = {
        requires: 'addRequire',
        asyncs: 'addAsyncRequire',
        links: 'addLink'
    };

    Object.keys(addFn).forEach(function (key) {
        src[key].forEach(function (item) {
            dst[addFn[key]](item);
        });
    });
}

function compileStyle(file, styleParts, opts) {
    var styleNum = styleParts.length;
    var vueStyleNameJoin = opts.styleNameJoin;
    styleParts.forEach(function (style, index) {
        var referFile = file;
        if (style.filePath) {
            // add style file dep
            var depInfo = addFileDep(style.filePath, file);
            referFile = depInfo.file;
        }

        var suffix = styleNum === 1 ? '' : '-' + index;
        var styleFileName = referFile.realpathNoExt + '-'
            + vueStyleNameJoin + suffix + '.css';

        // create new style file
        var styleFile = fis.file.wrap(styleFileName);

        // add style dep
        var output = style.output;
        output.deps.forEach(function (depFile) {
            file.cache.addDeps(getFileSubpath(depFile));
        });

        // compile style part
        var code = fis.compile.partial(output.code, referFile, {
            ext: 'css',
            isCssLike: true,
            relative: referFile.relative
        });

        if (referFile !== file) {
            copyDepInfo(referFile, file);
        }

        styleFile.cache = file.cache;
        styleFile.isCssLike = true;
        styleFile.useMap = false;
        styleFile.setContent(code);

        // compile style file without using cache
        fis.compile.process(styleFile);

        // add style file link resource
        styleFile.links.forEach(function (link) {
            file.addLink(link);
        });

        // save style file dep
        file.derived.push(styleFile);
        file.addRequire(styleFile.getId());
    });
}

function compile(content, file, conf) {
    var assign = fis.util.assign;
    var opts = assign({}, exports.DEFAULT_OPTIONS, conf);
    opts.style = assign({urlRewrite: false}, opts.style || {});
    opts.template = assign({urlRewrite: false}, opts.template || {}, {
        preprocessor: function (filePath, html) {
            // compile html part
            return fis.compile.partial(html, file, {
                ext: 'html',
                isHtmlLike: true
            });
        }
    });

    var result = exports.parser.compile(
        file.subpath.replace(/^\/+/, ''), content.toString(), opts
    );
    var resolveParts = result.resolveParts;

    // add tpl file dependence
    var tplPart = resolveParts.template || {};
    if (tplPart.filePath) {
        addFileDep(tplPart.filePath, file);
    }

    // add tpl link resource
    if (tplPart && tplPart.output && tplPart.output.deps) {
        tplPart.output.deps.forEach(function (filePath) {
            file.addLink(getFileSubpath(filePath));
        });
    }

    compileStyle(file, resolveParts.styles, opts);

    var scriptPart = resolveParts.script || {};

    // add script file dependence
    if (scriptPart.filePath) {
        addFileDep(scriptPart.filePath, file);
    }

    // save babel helper info
    if (scriptPart.output) {
        var metaData = scriptPart.output.metadata;
        metaData && (file.extras.babelHelpers = metaData.usedHelpers);
    }

    // compile script part
    return fis.compile.partial(result.content, file, {
        ext: 'js',
        isJsLike: true
    });
}

module.exports = exports = compile;

exports.DEFAULT_OPTIONS = {
    sourceMap: false,
    isProduction: true,
    isServer: false,
    extractStyle: true,
    styleNameJoin: 'vue-part'
};

exports.parser = null;
