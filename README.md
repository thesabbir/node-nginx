#Node -Nginx
---
```
A simple command-line tool to create & manage ngninx proxy/virtualhost configuaration for node.js based app
```

***

##Installation
```
$ git clone https://github.com/thesabbir/node-nginx.git node-nginx
$ cd node-nginx
$ npm install -d
$ ln -s /path/to/node-nginx.js /usr/local/bin/nodenginx
```




###Options
```
	-h, --help           output usage information
    -V, --version        output the version number
    -n, --name [name]    Specify a domain name / Server Name
    -p, --port [port]    Port number where your node app is running
    -P, --sport [sport]  Port where your sever will listening (Default 80)
    -e, --enabled        List enabled sites
    -a, --available      List available sites
```

###Usage
```
$ nodenginx  -n [domain] -p [port] -P [server-port]
```

###Example
```
$ node-nginx -n example.com -p 8080 -P 80
```


###For help

```
$ node-nginx --help


```

