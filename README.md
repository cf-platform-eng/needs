# Needs

Advertising and checking the needs of a test

## Commands

### List

`needs list [-f <needs-file>]`

Prints the needs file as JSON. This also validates the contents of the needs file.

### Check

`needs check [-f <needs-file>]`

Checks the system where this is running for the needs. This returns the number of unsatisfied needs, which means a return value of 0 means all needs were satisfied.

This prints the full list of needs, with each need adding a `satisfied` field. The CLI flags `--satisfied` and `--unsatisfied` can be used to filter the needs for only those needs.

### Types

`needs types`

Lists the available need types available to this version of needs.

### Type

`needs type <type name>`

Shows information about the need type.

## Needs file

The needs file is a JSON array of need objects. By default, needs looks in `./needs.json` for the needs file, but it can be set by using the `-f|--flag` argument.

### Binaries

Checks for executable files on the image. Can use absolute paths or file names, which will look for the binary in the $PATH directories.

```json
[{
    "type": "binary",
    "name": "marman"
}, {
    "type": "binary",
    "path": "/usr/local/bin/om"
}]
```

### Environment variables

Checks for defined environment variables. Can use a single `name` or multiple `names`.

```json
[{
    "type": "environment_variable",
    "name": "PRODUCT_NAME"
}, {
    "type": "environment_variable",
    "names": [
        "OM_TARGET",
        "OM_USERNAME",
        "OM_PASSWORD"
    ]
}]
```

### Files

```json
[{
    "type": "file",
    "path": "/input/credentials.json"
}, {
    "type": "file",
    "path": "/input/*.pivotal"
}]
```
