errorlogger
======

> errorlogger - [nodejs](http://nodejs.org) library

## Install

    $ npm install -g errorlogger

## Usage
```bash
Usage: errorlogger [options]

Options:
    -h, --help        output usage information
    -V, --version     output the version number
    -c, --config <n>  config file path
```
eg
```bash
$ errorlogger --help
$ errorlogger --version
    
$ errorlogger --config /path_to_config.json
```

## Config

Config file options:
```js
{
    "directory": "/path_to_error_logs",
    "unlink"   : false,
    "solr"     : {
        "host"       : "solr_host",
        "port"       : "solr_port",
        "collection" : "solr_collection"
    }
}
```

## Development

### Install dependencies

    $ make install

### Run tests

    $ make test

## License

(The MIT License)
see LICENSE file for details...
