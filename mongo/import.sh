#!/bin/bash
set -e

mongoimport --uri "mongodb://localhost:27017/pocketMorties" --collection pocketMortyCollection --file /data/cleaned_pocket_morties.json --jsonArray
