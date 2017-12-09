# firecell

local static server with mirror

## Usage

### install as global dependency

`npm install -g firecell`

### start server anywhere

```sh
# serve ~/.firecell at 9999 (mirror mode)
firecell

# serve CWD at 8080 (direct mode)
firecell --port=8080 --mode=direct

# server CWD at 9999 (direct mode)
firecell -d

# fork server (direct mode)
firecell -d --fork

# stop server
firecell stop

# show help
firecell -h
```

### access homepage

```
http://localhost:YOUR-PORT
```
