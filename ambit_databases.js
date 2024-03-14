const fs = require('fs');
const https = require('https');
const execSync = require('child_process').execSync;

const jsonFile = 'ambit.json';

// Function to download JSON file
function downloadJsonFile() {
    const file = fs.createWriteStream(jsonFile);
    https.get('https://data.enanomapper.net/solr/metadata/select?q=name_s:ERM*&rows=1000', (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            processJsonFile();
        });
    }).on('error', (err) => { // Handle errors
        fs.unlink(jsonFile); // Delete the file async
        console.error(`Error downloading JSON file: ${err.message}`);
    });
}

// Check if the JSON file exists, if not download it
if (!fs.existsSync(jsonFile)) {
    downloadJsonFile();
} else {
    processJsonFile();
}

// Process the JSON file
function processJsonFile() {
    // Check if the file exists and is not empty
    if (fs.existsSync(jsonFile) && fs.statSync(jsonFile).size > 0) {
        const jsonData = JSON.parse(fs.readFileSync(jsonFile));

        // Check if 'docs' array exists and is not null or empty
        if (jsonData.response && jsonData.response.docs && jsonData.response.docs.length > 0) {
            // Iterate over each entry in 'docs' array
            jsonData.response.docs.forEach(doc => {
                const name_s = doc.name_s;
                const owner_name = doc.owner_name_s;
                
                // Check if YAML file exists for 'name_s'
                const yamlFile = `_data/erm/${name_s}.yml`;
                const jsonFile = `${name_s}.json`;
                if (!fs.existsSync(yamlFile)) {
                    // If YAML file doesn't exist, create it with additional info
                    const yamlContent = `title: "Material: ${name_s}"
type: ChemicalSubstance
id: ${name_s}
tag: erm:${name_s}
tags: erm:${name_s}
databases: ["${owner_name}"]\n`;
                    fs.writeFileSync(yamlFile, yamlContent);
                } else {
                    // If YAML file exists, update 'databases' key
                    console.log(`${owner_name} ${yamlFile} ${name_s} exists`);
                    const yamlContent = fs.readFileSync(yamlFile, 'utf8');
                    if (!yamlContent.includes('databases:')) {
                        // 'databases' field does not exist, add it with 'owner_name'
                        fs.appendFileSync(yamlFile, `databases: ["${owner_name}"]\n`);
                    } else {
                        // 'databases' field exists, check if 'owner_name' already exists in the list
                        if (!yamlContent.includes(`"${owner_name}"`)) {
                            // Append 'owner_name' to the 'databases' list
                            const databasesIndex = yamlContent.indexOf('databases:');
                            const newlineIndex = yamlContent.indexOf('\n', databasesIndex);
                            const beforeDatabases = yamlContent.substring(0, newlineIndex);
                            const afterDatabases = yamlContent.substring(newlineIndex);
                            const updatedContent = `${beforeDatabases}  - "${owner_name}"${afterDatabases}`;
                            fs.writeFileSync(yamlFile, updatedContent);
                        }
                    }
                }
            });
        } else {
            console.log("Error: 'docs' array is null or empty in the JSON file.");
        }
    } else {
        console.log(`Error: JSON file '${jsonFile}' is empty or does not exist.`);
    }
}
