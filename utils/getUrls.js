const Path = require("path");
const FS = require("fs");

const articlesFiles = [];

function getArticles (Directory) {
    FS.readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (!File.includes('archive')) {
            if (FS.statSync(Absolute).isDirectory()) return getArticles(Absolute);
            else return articlesFiles.push('articles/' + File.slice(0, -3));
        }
    });
}

getArticles("content/articles");
export default articlesFiles
