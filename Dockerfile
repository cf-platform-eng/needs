FROM mirror.gcr.io/ubuntu:20.04
LABEL maintainer="Tanzu ISV Partner Engineering Team <tanzu-isv-engineering@groups.vmware.com>"

COPY build/needs-linux /usr/local/bin/needs
COPY build/needs-alpine /usr/local/bin/needs-alpine

ENTRYPOINT [ "needs" ]