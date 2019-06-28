# Needs

Advertising and checking the needs of a test

## Commands

### List

`needs list [<needs-file>]`

Prints the needs file as JSON. Uses the default file path of /inputs/needs.json 

### Lint

`needs lint <needs-file>`

Checks the needs file for consistency

### Check

`needs check [<needs-file>]`

Checks the system where this is running for the needs. Uses the default file path of /inputs/needs.json

## Needs file

The needs file is a JSON array of need objects.

### Binaries

Checks for executable files on the image. Can use absolute paths or file names, which will look for the binary in the $PATH directories.

```json
{
    "type": "binary",
    "name": "marman"
}
```

### Environment variables

```json
{
    "type": "environment_variable",
    "name": "PRODUCT_NAME"
}
```

### Files

```json
{
    "type": "file",
    "path": "/input/credentials.json"
}
```
