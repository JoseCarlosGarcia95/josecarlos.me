#!/bin/bash
hugo && gulp
sudo docker build -t josecarlosme/josecarlos.me . --no-cache  
sudo docker push josecarlosme/josecarlos.me

cd varnish/
sudo docker build -t josecarlosme/josecarlosme-varnish ./
sudo docker push josecarlosme/josecarlosme-varnish