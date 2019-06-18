# Besoin

Advertising and checking the needs of a test

## Commands

### List

`besoin list [<needs-file>]`

Prints the needs file as JSON. Uses the default file path of /inputs/needs.json 

### Lint

`besoin lint <needs-file>`

Checks the needs file for consistency

### Check

`besoin check [<needs-file>]`

Checks the system where this is running for the needs. Uses the default file path of /inputs/needs.json

## Needs

### Platforms

```
{
    "platforms": {
        "pcf": {
            "version": ">=2.3",
            "iaas": "gcp"
        },
        "pks": {
            "nodes": 3
        }
    }
}
```

### Binaries

Checks for executable files on the image. Can use absolute paths or file names, which will look for the binary in the $PATH directories.

```
{
    "binaries": [
        "marman",
        "/bin/bash"
    ]
}
```

### Environment variables

```
{
    "envs": [
        "OM_TARGET",
        "OM_USERNAME",
        "OM_PASSWORD"
    ]
}
```

### Files

```
{
    "files": [
        "/input/credentials.json"
    ]
}
```

### Hosts

```
{
    "hosts": [ ??? ]
}
```

