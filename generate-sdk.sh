#!/bin/bash

# Default to snapshot version
SNAPSHOT_FLAG="snapshot=true"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --release=true)
            SNAPSHOT_FLAG=""
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

ADDITIONAL_PROPERTIES_LIST=(
  "npmName=congress-gov-sdk"
  "supportsES6=true"
  "withNodeImports=true"
  "apiPackage=congress-gov"
  "licenseName=Apache-2.0"
  "${SNAPSHOT_FLAG}"
  "useSingleRequestParameter=true"
)
ADDITIONAL_PROPERTIES=$(IFS=,; echo "${ADDITIONAL_PROPERTIES_LIST[*]}")


openapi-generator-cli generate \
  -i swagger.yaml \
  -t templates \
  -o src/ \
  -g typescript-axios \
  --additional-properties="$ADDITIONAL_PROPERTIES"

mv src/package.json .

npm run pretty

echo "SDK generation complete with properties: $ADDITIONAL_PROPERTIES"
