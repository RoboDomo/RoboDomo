#!/bin/sh

mkdir -p server/certs
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server/certs/privateKey.key -out server/certs/certificate.crt

