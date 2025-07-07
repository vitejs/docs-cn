# name: CI/CD Pipeline
# on:
#   push:
#     branches: ["main"]

# jobs:
#   deploy:
#     runs-on: ubuntu-latest
#     environment: production
#     permissions:
#       contents: write

#     steps:
#       - uses: actions/checkout@v4
#         with:
#           fetch-depth: 0
#           token: ${{ secrets.GITHUB_TOKEN }}

#       - name: List Repository Contents
#         run: |
#           echo "Repository contents:"
#           ls -la
#           echo "\nCogs directory contents:"
#           ls -la cogs/

#       - id: commit
#         run: |
#           MSG=$(git log -1 --pretty=%B)
#           SHA=$(git rev-parse --short HEAD)
#           echo "Commit message: $MSG"
#           echo "Commit SHA: $SHA"
#           echo "msg=$MSG" >> $GITHUB_OUTPUT
#           echo "sha=$SHA" >> $GITHUB_OUTPUT

#       - id: version
#         run: |
#           if [[ "${{ steps.commit.outputs.msg }}" == "version:"* ]]; then
#             # Extract version directly from commit message
#             NEW_TAG="v$(echo "${{ steps.commit.outputs.msg }}" | cut -d':' -f2 | tr -d '[:space:]')"
#           else
#             CURRENT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
#             echo "Current tag: $CURRENT_TAG"
#             IFS='.' read -r MAJOR MINOR PATCH <<< "${CURRENT_TAG#v}"
#             echo "Current version: $MAJOR.$MINOR.$PATCH"
            
#             case "${{ steps.commit.outputs.msg }}" in
#               major:*) 
#                 NEW_TAG="v$((MAJOR + 1)).0.0"
#                 echo "Major version bump" ;;
#               minor:*) 
#                 NEW_TAG="v$MAJOR.$((MINOR + 1)).0"
#                 echo "Minor version bump" ;;
#               release:*) 
#                 NEW_TAG="v$MAJOR.$MINOR.$((PATCH + 1))"
#                 echo "Patch version bump" ;;
#               base:*)
#                 NEW_TAG=""
#                 echo "Base image update - no version bump needed" ;;
#               *) 
#                 NEW_TAG=""
#                 echo "No version bump needed" ;;
#             esac
#           fi

#           # Set should_build for version bumps or base image updates
#           if [ ! -z "$NEW_TAG" ]; then
#             # Keep incrementing patch version until we find an available tag
#             while git rev-parse "$NEW_TAG" >/dev/null 2>&1; do
#               echo "Tag $NEW_TAG exists, incrementing patch"
#               IFS='.' read -r M N P <<< "${NEW_TAG#v}"
#               NEW_TAG="v$M.$N.$((P + 1))"
#             done
            
#             echo "Creating new tag: $NEW_TAG"
#             git config user.name "GitHub Actions"
#             git config user.email "actions@github.com"
#             git tag $NEW_TAG
#             git push origin $NEW_TAG
#             echo "tag=$NEW_TAG" >> $GITHUB_OUTPUT
#             echo "should_build=true" >> $GITHUB_OUTPUT
#           elif [[ "${{ steps.commit.outputs.msg }}" == "base:"* ]]; then
#             echo "Base image update detected"
#             echo "should_build=true" >> $GITHUB_OUTPUT
#           else
#             echo "No tag created, skipping build"
#             echo "should_build=false" >> $GITHUB_OUTPUT
#           fi

#       # - name: Create infos.json
#       #   if: steps.version.outputs.should_build == 'true'
#       #   run: |
#       #     echo '{
#       #       "version": "${{ steps.version.outputs.tag }}",
#       #       "commit_sha": "${{ steps.commit.outputs.sha }}",
#       #       "build_date": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
#       #     }' > /app/infos.json
#       #     echo "Created infos.json with content:"
#       #     cat /app/infos.json

#       - name: Set up Docker Buildx
#         if: steps.version.outputs.should_build == 'true'
#         uses: docker/setup-buildx-action@v3
#         with:
#           version: latest
#           buildkitd-flags: --debug

#       - name: Cache Docker layers
#         if: steps.version.outputs.should_build == 'true'
#         uses: actions/cache@v3
#         with:
#           path: /tmp/.buildx-cache
#           key: ${{ runner.os }}-buildx-${{ github.sha }}
#           restore-keys: |
#             ${{ runner.os }}-buildx-

#       - name: DockerHub Login
#         if: steps.version.outputs.should_build == 'true'
#         uses: docker/login-action@v3
#         with:
#           username: ${{ secrets.DOCKERHUB_USERNAME }}
#           password: ${{ secrets.DOCKERHUB_TOKEN }}

#       - name: Debug commit message for base image
#         run: |
#           echo "Commit message: '${{ steps.commit.outputs.msg }}'"
#           echo "Should build: ${{ steps.version.outputs.should_build }}"
#           echo "Starts with 'base:': ${{ startsWith(steps.commit.outputs.msg, 'base:') }}"
#           echo "Combined condition: ${{ steps.version.outputs.should_build == 'true' && startsWith(steps.commit.outputs.msg, 'base:') }}"

#       - name: Build & Push Base Image (if changed)
#         if: startsWith(steps.commit.outputs.msg, 'base:')
#         uses: docker/build-push-action@v6
#         with:
#           push: true
#           context: .
#           file: Dockerfile.base
#           tags: |
#             ${{ secrets.DOCKERHUB_USERNAME }}/orbital-bot-base:latest
#           cache-from: type=local,src=/tmp/.buildx-cache
#           cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
#           build-args: |
#             BUILDKIT_INLINE_CACHE=1
#           platforms: linux/amd64,linux/arm64
#           provenance: false
#           sbom: false
#           compression: zstd
#           push-quiet: true

#       # Generate build date for Docker build
#       - name: Generate Build Date
#         if: steps.version.outputs.should_build == 'true'
#         id: date
#         run: echo "build_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> $GITHUB_OUTPUT
        
#       # Create infos.json directly in the workspace
#       - name: Create infos.json in workspace
#         if: steps.version.outputs.should_build == 'true'
#         run: |
#           echo '{
#             "version": "${{ steps.version.outputs.tag }}",
#             "commit_sha": "${{ steps.commit.outputs.sha }}",
#             "build_date": "${{ steps.date.outputs.build_date }}"
#           }' > $GITHUB_WORKSPACE/infos.json
#           echo "Created infos.json with content:"
#           cat $GITHUB_WORKSPACE/infos.json
          
#       - name: Build & Push Final Image
#         if: steps.version.outputs.should_build == 'true' && steps.version.outputs.tag != ''
#         uses: docker/build-push-action@v6
#         with:
#           push: true
#           context: .
#           cache-from: type=local,src=/tmp/.buildx-cache
#           cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
#           build-args: |
#             BUILDKIT_INLINE_CACHE=1
#             REPO_URL=https://github.com/${{ github.repository }}.git
#             REPO_BRANCH=${{ github.ref_name }}
#             VERSION_TAG=${{ steps.version.outputs.tag }}
#             COMMIT_SHA=${{ steps.commit.outputs.sha }}
#             BUILD_DATE=${{ steps.date.outputs.build_date }}
#           tags: |
#             ${{ secrets.DOCKERHUB_USERNAME }}/${{ secrets.PROJECT_NAME }}:${{ steps.version.outputs.tag }}
#             ${{ secrets.DOCKERHUB_USERNAME }}/${{ secrets.PROJECT_NAME }}:latest
#           platforms: linux/amd64,linux/arm64
#           provenance: false
#           sbom: false
#           compression: zstd
#           push-quiet: true

#       # Move cache
#       - name: Move cache
#         if: steps.version.outputs.should_build == 'true'
#         run: |
#           rm -rf /tmp/.buildx-cache
#           mv /tmp/.buildx-cache-new /tmp/.buildx-cache

#       # Trigger Portainer Webhook  
#       - name: Trigger Portainer Webhook
#         if: success() && steps.version.outputs.should_build == 'true' && steps.version.outputs.tag != ''
#         run: |
#           echo "Triggering Portainer webhook..."
#           curl -X POST "${{ secrets.PORTAINER_WEBHOOK }}"
