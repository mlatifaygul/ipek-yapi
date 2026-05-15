const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !f.startsWith('admin') && !f.startsWith('dynamic'));

files.forEach(f => {
    const filePath = path.join(__dirname, f);
    const content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('ipek-frontend.js')) {
        let newContent = content.replace('<script src="script.js"></script>', '<script src="admin-data.js"></script>\n    <script src="ipek-frontend.js"></script>\n    <script src="script.js"></script>');

        if (newContent === content) {
            newContent = content.replace('</body>', '    <script src="admin-data.js"></script>\n    <script src="ipek-frontend.js"></script>\n</body>');
        }

        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated ' + f);
        }
    }
});
