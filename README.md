# firecell

A local static file server.

## Usage

### install as global dependency

`npm install -g firecell`

### start server anywhere

```sh

    firecell -d
    firecell -d --fork
    firecell --mode=direct --port=8080 --path=~
    firecell --mode=mirror
    firecell --help

# serve ~/.firecell at 9999 (mirror mode)
firecell

# serve CWD at 9999 (direct mode)
firecell -d

# fork server (direct mode)
firecell -d --fork

# serve CWD at 8080 (direct mode)
firecell --mode=direct --port=8080

# serve root dir (direct mode)
firecell -d --path=/

# show help
firecell --help
```

### access homepage

```
http://localhost:YOUR-PORT
```
