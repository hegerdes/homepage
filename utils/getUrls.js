const Path = require("path");
const FS  = require("fs");

const articlesFiles = [];

function ThroughDirectory(Directory) {
    FS.readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return articlesFiles.push('articles/' + File.slice(0, -3));
    });
}

ThroughDirectory("content/articles");

export default articlesFiles
