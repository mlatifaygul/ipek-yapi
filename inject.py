import glob

files = glob.glob('*.html')
for f in files:
    if f.startswith('admin') or f.startswith('dynamic'):
        continue
    
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    if 'ipek-frontend.js' not in content:
        new_content = content.replace('<script src="script.js"></script>', '<script src="admin-data.js"></script>\n    <script src="ipek-frontend.js"></script>\n    <script src="script.js"></script>')
        
        if new_content == content:
            new_content = content.replace('</body>', '    <script src="admin-data.js"></script>\n    <script src="ipek-frontend.js"></script>\n</body>')
            
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {f}')
