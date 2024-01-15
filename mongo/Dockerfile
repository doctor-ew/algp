FROM mongo

# Copy the JSON file and the import script into the container
COPY cleaned_pocket_morties.json /data/cleaned_pocket_morties.json
COPY import.sh /docker-entrypoint-initdb.d/import.sh

# Make the import script executable
RUN chmod +x /docker-entrypoint-initdb.d/import.sh
