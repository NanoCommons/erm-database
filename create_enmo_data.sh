#!/bin/bash

ROBOT="robot"
ROBOT_JAR="robot.jar"

# Manually added prefixes
npo="http://purl.bioontology.org/ontology/npo#"
enm="http://purl.enanomapper.org/onto/"

# Function to convert CURIEs to IRIs using manually added prefixes
convert_to_iri() {
    local curies_file="$1"
    # Replace manually added prefixes in curies.tsv
    sed -i -E "s|npo:|$npo|g; s|enm:|$enm|g" "$curies_file"
}

# Step 0: Download ROBOT and eNM Ontology
rm enanomapper-dev.owl || true
rm merged_enmo.owl || true
wget https://raw.githubusercontent.com/enanomapper/ontologies/master/enanomapper-dev.owl
wget -nc $ROBOT
wget -nc $ROBOT_JAR

# Step 1: Find all YAML files in _data/erm and extract 'a' values
grep -hroP "^\s*a:\s*\K.*" _data/erm/*.yml > curies.tsv

# Step 2: Convert CURIEs to IRIs using manually added prefixes
convert_to_iri curies.tsv

# Step 3: Remove duplicates using awk
awk '!seen[$0]++' curies.tsv > curies_no_duplicates.tsv
mv -f curies_no_duplicates.tsv curies.tsv
echo "Duplicates removed. Result saved in curies.tsv"

# Step 4: Extract used classes
echo "Creating module for eNM"
java -jar $ROBOT_JAR merge \
    --input enanomapper-dev.owl \
    --output merged_enmo.owl
java -jar $ROBOT_JAR extract \
    --input merged_enmo.owl \
    --method BOT \
    --term-file curies.tsv \
    --output enmo_subset.owl \
    --individuals exclude
echo "Success"

java -jar $ROBOT_JAR \
        --add-prefix "npo: $npo" \
        --add-prefix "enm: $enm" \
    export \
        --input enmo_subset.owl \
        --header "ID|IRI|LABEL" \
        --entity-format ID \
        --export results.tsv

# Step 5: classes to YML

input_file="results.tsv"

# Read the file line by line, skipping the header line
tail -n +2 "$input_file" | while IFS=$'\t' read -r ID IRI LABEL SubClass_Of; do
  # Split SubClass_Of into an array based on '|'
  IFS='|' read -ra subclasses <<< "$SubClass_Of"

  # Create YAML content with proper indentation
  yaml_content=$(cat <<EOF
label: "${LABEL}"
URI: "${IRI}"
curie: "${ID}"
a:
  - ${subclasses[0]}
EOF
)
  # \n
  yaml_content+=""$'\n'
  # Add subsequent subclasses with proper indentation
  for ((i = 1; i < ${#subclasses[@]}; i++)); do
    yaml_content+="  - ${subclasses[i]}"$'\n'
  done

  # Determine the output YAML file path
  yaml_file="_data/enmo/${ID}.yml"
  
  # Write YAML content to file only if there is valid data
  if [[ ! -z "${ID}" && ! -z "${IRI}" && ! -z "${LABEL}" && ! -z "${SubClass_Of}" ]]; then
    echo "${yaml_content}" > "${yaml_file}"
  fi
  
done
rm -fr _data/enmo/UO* # Fix needed to remove unimportant classes added by ROBOT
rm enanomapper-dev.owl