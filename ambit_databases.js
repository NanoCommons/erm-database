const fs = require('fs');
const https = require('https');
const yaml = require('yaml');

const jsonFile = 'ambit.json';

function downloadJsonFile() {
    const file = fs.createWriteStream(jsonFile);
    https.get('https://data.enanomapper.net/solr/metadata/select?q=name_s:ERM*&rows=1000', (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            processJsonFile();
        });
    }).on('error', (err) => {
        fs.unlink(jsonFile);
        console.error(`Error downloading JSON file: ${err.message}`);
    });
}

function processJsonFile() {
    if (!fs.existsSync(jsonFile)) {
        downloadJsonFile();
        return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFile));
    const docs = jsonData.response?.docs;

    if (!docs || docs.length === 0) {
        console.log("Error: 'docs' array is null or empty in the JSON file.");
        return;
    }

    docs.forEach(doc => {
        const { name_s, owner_name_s: owner_name } = doc;
        const yamlFile = `_data/erm/${name_s}.yml`;

        if (!fs.existsSync(yamlFile)) {
            const yamlContent = yaml.stringify({
                title: `Material: ${name_s}`,
                type: 'ChemicalSubstance',
                id: name_s,
                tag: `erm:${name_s}`,
                tags: `erm:${name_s}`,
                otherLinks: [{ databases: [owner_name] }]
            });
            fs.writeFileSync(yamlFile, yamlContent);
        } else {
            console.log(`${owner_name} ${yamlFile} ${name_s} exists`);
            let yamlContent = fs.readFileSync(yamlFile, 'utf8');
            const existingYamlObj = yaml.parseDocument(yamlContent).toJSON();
            
            if (!existingYamlObj.otherLinks) existingYamlObj.otherLinks = [];
            
            if (!existingYamlObj.otherLinks.some(link => link.databases && link.databases.includes(owner_name))) {
                existingYamlObj.otherLinks.push({ databases: [owner_name] });
                fs.writeFileSync(yamlFile, yaml.stringify(existingYamlObj));
            }
        }
    });
}

processJsonFile();
