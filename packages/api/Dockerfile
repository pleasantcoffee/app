# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
COPY packages /temp/dev/packages
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
COPY packages /temp/prod/packages
RUN cd /temp/prod && bun install --frozen-lockfile --production

# development stage with HMR support
FROM base AS dev
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
WORKDIR /usr/src/app/packages/api

USER bun
EXPOSE 3000/tcp
ENV NODE_ENV=development
CMD [ "bun", "--hot", "src/index.ts" ]

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
WORKDIR /usr/src/app/packages/api

# run the app
USER bun
EXPOSE 3000/tcp
ENV NODE_ENV=production
ENTRYPOINT [ "bun", "run", "src/index.ts" ]