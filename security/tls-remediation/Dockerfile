# syntax=docker/dockerfile:1
ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS certificates
USER 0
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && . /etc/os-release \
 && case "$VERSION_ID" in 12) minimum='20250419~deb12u2';; 13) minimum='20250419+deb13u1';; *) exit 1;; esac \
 && dpkg --compare-versions "$(dpkg-query -W -f='${Version}' ca-certificates)" ge "$minimum" \
 && rm -rf /var/lib/apt/lists/*

FROM certificates AS node-runtime
ARG ORIGINAL_NODE_OPTIONS
ENV NODE_OPTIONS="${ORIGINAL_NODE_OPTIONS} --use-openssl-ca"
ARG ORIGINAL_USER
USER ${ORIGINAL_USER}

FROM certificates AS python-runtime
ARG ORIGINAL_USER
USER ${ORIGINAL_USER}

FROM certificates AS certifi-runtime
RUN PIP_CERT=/etc/ssl/certs/ca-certificates.crt python3 -m pip install --no-cache-dir \
      'pip==26.2.2' 'certifi==2026.10.19'
ARG ORIGINAL_USER
USER ${ORIGINAL_USER}
