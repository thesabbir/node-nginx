#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs-extra'),
    p = require('path'),
    eol = require('os').EOL,
    config = fs.readJsonSync('/Users/sabbir/Flow/Node/CLI/config.json'),
    available = p.join(config.nginxPath, 'sites-available'),
    enabled = p.join(config.nginxPath, 'sites-enabled'),
    filename;

program
    .version('0.1.0')
    .usage(' -n [domain] -p [port] -P [server-port]')
    .option('-n, --name [name]', 'Specify a domain name / Server Name')
    .option('-p, --port [port]', 'Port number where your node app is running')
    .option('-P, --sport [sport]', 'Port where your sever will listening (Default 80)', 80)
    .option('-e, --enabled', "List enabled sites")
    .option('-a, --available', "List available sites")
    .on('--help', help)
    .parse(process.argv);

var nignxConf = [
    'server {',
    '   listen {{sport}};',
    '   access_log /var/log/nginx/{{domain}}.access.log;',
    '   error_log /var/log/nginx/{{domain}}.error.log;',
    '   server_name {{domain}};',
    '   location / {',
    '       proxy_set_header X-Real-IP $remote_addr;',
    '       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;',
    '       proxy_set_header Host $http_host;',
    '       proxy_pass http://127.0.0.1:{{port}};',
    '       proxy_redirect off;',
    '       proxy_http_version 1.1;',
    '       proxy_set_header Upgrade $http_upgrade;',
    '       proxy_set_header Connection $connection_upgrade;',
    '   }',
    '}'

].join(eol);

if (program.enabled) status(enabled)
if (program.available) status(available)

if (program.name !== undefined & program.port !== undefined) {
    filename = program.name;
    nignxConf = nignxConf.replace(new RegExp('{{domain}}', 'ig'), program.name);
    nignxConf = nignxConf.replace(new RegExp('{{port}}', 'ig'), program.port);
    nignxConf = nignxConf.replace(new RegExp('{{sport}}', 'ig'), program.sport);
    main(filename, nignxConf);
}

function write (path, str) {
    fs.writeFile(path, str);
    console.log('Created SuccessFully');
    program.confirm('Do you want to enable this site ?', function (dec) {
        if (dec) {
            enable(filename);
        } else {
            abort("Cancelled activation !")
        }
    });
}

function enable (filename) {
    fs.mkdirs(available);
    var src = p.join(available, filename) + ".conf",
        des = p.join(enabled, filename);
    fs.symlink(src, des, function (err) {
        if (err) {
            if (err.code == "EEXIST") {
                console.log("Dude it's already enabled :p");
                return process.exit(0);
            } else {
                console.log(err);
                return process.exit(1);
            }
        } else {
            console.log(filename + " enabled");
            return process.exit(0);
        }
    })
}
function abort (msg) {
    console.log(msg);
    return process.exit(1);
}

function status (dirname) {
    fs.readdir(dirname, function (err, files) {
        if (files != undefined) {
            console.log(files.join(eol).replace(new RegExp('.conf', 'ig'), ''));
        }
    });
}

function help (add) {
    if (add != undefined) console.log(add);
    console.log('');
    console.log("Usage Example :");
    console.log('');
    console.log("$ nodenginx -d example.com -p 3000");
    console.log("$ nodenginx --help (for help)");
    console.log('');
}

function main (filename, str) {
    var path = p.join(available, filename) + ".conf";
    fs.createFile(path, function (err) {
        if (err !== null) {
            console.log(err);
        } else {
            fs.readFile(path, function (err, content) {
                if (content.length > 0) {
                    console.log("It contains something dude !");
                    program.confirm('Do you want to continue ?', function (dec) {
                        if (dec) {
                            write(path, str);
                        } else {
                            abort("Aborted");
                        }
                    });

                } else {
                    write(path, str);
                }

            });
        }
    });
}