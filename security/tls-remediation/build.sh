#!/usr/bin/env bash
set -euo pipefail
: "${BASE_IMAGE:?}" "${TARGET:?}" "${IMAGE_NAME:?}" "${GITHUB_SHA:?}" "${GITHUB_REPOSITORY:?}"
test "$(uname -m)" = aarch64
directory="$(cd -- "$(dirname -- "$0")" && pwd)"
image="ghcr.io/0n3m0r3/${IMAGE_NAME}:emudhra-${GITHUB_SHA}"
docker pull --platform linux/arm64 "$BASE_IMAGE"
original_user="$(docker image inspect --format '{{.Config.User}}' "$BASE_IMAGE")"
original_user="${original_user:-0}"
original_options="$(docker image inspect "$BASE_IMAGE" | python3 -c 'import json,sys; e=json.load(sys.stdin)[0]["Config"].get("Env",[]); print(next((v.split("=",1)[1] for v in e if v.startswith("NODE_OPTIONS=")),""))')"
docker build --platform linux/arm64 --target "$TARGET" \
  --build-arg "BASE_IMAGE=$BASE_IMAGE" --build-arg "ORIGINAL_USER=$original_user" \
  --build-arg "ORIGINAL_NODE_OPTIONS=$original_options" \
  --label "org.opencontainers.image.source=https://github.com/$GITHUB_REPOSITORY" \
  --label "org.opencontainers.image.revision=$GITHUB_SHA" \
  -t "$image" "$directory"
test "$(docker image inspect --format '{{.Architecture}}' "$image")" = arm64
for field in Entrypoint Cmd WorkingDir; do
  test "$(docker image inspect --format "{{json .Config.$field}}" "$BASE_IMAGE")" = \
       "$(docker image inspect --format "{{json .Config.$field}}" "$image")"
done
test "$(docker image inspect --format '{{.Config.User}}' "$image")" = "$original_user"
if [[ "$TARGET" == node-runtime ]]; then
  docker run --rm --read-only --cap-drop ALL --security-opt no-new-privileges \
    --entrypoint node -v "$directory:/probe:ro" "$image" /probe/probe.cjs
else
  docker run --rm --read-only --cap-drop ALL --security-opt no-new-privileges \
    --entrypoint python3 -v "$directory:/probe:ro" "$image" /probe/probe.py
fi
docker push "$image"
docker image inspect --format '{{index .RepoDigests 0}}' "$image" > image-digest.txt
cat image-digest.txt >> "$GITHUB_STEP_SUMMARY"
