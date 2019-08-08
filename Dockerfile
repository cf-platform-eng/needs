FROM ubuntu:xenial
LABEL maintainer="Pivotal Platform Engineering ISV-CI Team <cf-isv-dashboard@pivotal.io>"

COPY build/needs-linux /usr/local/bin/needs

ENTRYPOINT [ "needs" ]