# Needs

Needs provides a way to advertise and check required inputs in a structured way.

## History

My team runs lots of tests. Long tests. And it's very aggrevating when the tests fail one hour in because an input file was missing or an environment variable was not set. Needs came about because we wanted to validate that all of the inputs are ready to go at the beginning of the test.

Now, a lot of our test (which a often Docker images) look like this:

```Dockerfile
FROM ubuntu:xenial
COPY --from=cfplatformeng/needs:latest /usr/local/bin/needs /usr/local/bin/
COPY "needs.json" .
CMD ["/bin/bash", "-c", "needs check && ... start long running test..."]
```

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

### `description` field

Each need can define a `description` field with a `string` value. This field may be used to show why a need is important. However, the `description` itself is not used to determine if the need is satisfied.

### `identify` field

Each need can define an `identify` field with a `string` value. When a `needs check` is run, if the need is satisfied, the contents of the `identify` field will be executed and the result on stdout will be stored into the `identity` field.

#### `identify` xample

```bash
$ cat needs.json
[{
    "type": "file",
    "path": "/input/secrets.json"
    "identify": "shasum /input/secrets.json"
}]
$ needs check
[
  {
    "type": "file",
    "path": "/input/secrets.json"
    "satisfied": true,
    "identify": "shasum /input/secrets.json",
    "identity": "6d173b8b1190b6e3ef275848c6f61ac63da039dd658e70fd642283fdb7b73350 /input/secrets.json"
  }
]
```

### `optional` field

If a need has the `optional` field set to true, then even if it is unsatisfied, a call to `needs check` will not return non-zero because of that need. This is useful to advertising and checking optional inputs, but not blocking if they're not present.

#### `optional` example

```bash
$ cat needs.json
[{
    "type": "file",
    "path": "/input/optional-settings.json"
    "optional": true
}]
$ needs check
[
  {
    "type": "file",
    "optional": true,
    "path": "/input/optional-settings.json",
    "satisfied": false
  }
]
$ echo $?
0
```

### Binaries

Checks for executable files on the image. Can use an absolute path or if given a file name it will look for the binary in the $PATH.

```json
[{
    "type": "binary",
    "name": "marman"
}, {
    "type": "binary",
    "path": "/usr/local/bin/om",
    "identify": "/usr/local/bin/om version"
}]
```

### Environment variables

Checks for a non-empty environment variable.

```json
[{
    "type": "environment_variable",
    "name": "PRODUCT_NAME"
}]
```

### Files

```json
[{
    "type": "file",
    "path": "/input/credentials.json",
    "description": "Required for authentication to the service"
}, {
    "type": "file",
    "path": "/input/*.tgz"
}]
```
