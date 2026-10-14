set $application http://laravel.test:80;

proxy_pass $application;
proxy_http_version 1.1;
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Host $http_host;
set $forwarded_port $server_port;
if ($http_host ~* ":(?<port>[0-9]+)$") {
    set $forwarded_port $port;
}
proxy_set_header X-Forwarded-Port $forwarded_port;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_read_timeout 300s;
proxy_send_timeout 300s;
