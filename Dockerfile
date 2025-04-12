ARG ubuntu_image=tas-ecosystem-docker-virtual.usw1.packages.broadcom.com/ubuntu:20.04

FROM ${ubuntu_image}

LABEL maintainer="Tanzu ISV Partner Engineering Team <tanzu-isv-engineering@groups.vmware.com>"

COPY build/needs-linux /usr/local/bin/needs
COPY build/needs-alpine /usr/local/bin/needs-alpine

ENTRYPOINT [ "needs" ]