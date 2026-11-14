<div style="text-align: center;">
    <img src="https://i.ibb.co/Gv7Jd8Q/Zec-Hub-blue-globe.png" alt="Logo" style="width: 70px; height: auto;">
    <h3>
        <em>
            An open-source education hub for <a href="https://z.cash/" target="_blank">Zcash</a>
        </em>
    </h3>
    <p>
        <a href="https://follow.zechub.org/" target="_blank">
            <img src="https://img.shields.io/twitter/follow/zechub?style=social&label=Follow">
        </a>
    </p>
<p>
    <a href="https://chat.zechub.org/" target="_blank">
        <img src="https://img.shields.io/discord/978714252934258779?style=social&label=Discord">
    </a>
    <a href="https://youtube.com/@zechub" target="_blank">
        <img src="https://img.shields.io/youtube/channel/views/UC3-KM00kjCUheRzO5cq3PAA?style=social&label=Subscribe">
    </a>
</p>

</div>

# ZecHub Wiki

Welcome to ZecHub, an open-source education hub for Zcash! This Next.js project is designed to provide a platform for educational content related to Zcash and privacy. If you're new to ZecHub or Next.js, this guide will help you get started.

## Getting Started

### Requirements

- Node.js `20.19+`, `22.12+`, or `24+` ([Node.js](https://nodejs.org/))
- [Yarn Classic `1.22.22`](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

Node.js `23` is not supported by the current `apexcharts` dependency. Node.js `22` LTS is recommended.

This project uses Yarn and [`yarn.lock`](./yarn.lock) as its dependency lockfile. Use Yarn commands rather than `npm install` so the installed packages match the repository.

To set up the development environment, follow these steps:

1. Install the project dependencies:

```bash
yarn install
```

2. Copy the example file:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the ZecHub Wiki in action. You can start editing the page by modifying the files within the `src/app` directory. The page will auto-update as you make changes.

### Troubleshooting dependency installation

If Yarn reports an error like:

```text
apexcharts@8.3.1: The engine "node" is incompatible with this module
```

check your Node.js version:

```bash
node --version
```

Switch to a supported version, then reinstall:

```bash
nvm install 22.21.1
nvm use 22.21.1
yarn install --frozen-lockfile
```

Avoid mixing npm and Yarn lockfiles or using `yarn install --ignore-engines`; the latter bypasses the compatibility check but may leave the app unable to build correctly.

## How bounty hunters can avoid lockfile problems

### 1. Do not regenerate the lockfile accidentally

- Do not run `yarn upgrade`, `yarn upgrade-interactive`, or `rm yarn.lock && yarn install` unless the task is specifically a dependency update.
- If you only change application code, leave `yarn.lock` untouched.
- If `yarn install` wants to update the lockfile, stop and check why before committing it.

### 2. Match the project environment

Use Yarn Classic v1 and install exactly what is locked:

```bash
yarn --version          # should be 1.x
yarn install --frozen-lockfile
```

If this fails locally, fix the environment—Node.js version, Yarn version, or registry—rather than regenerating the lockfile.

### 3. Check what you are about to commit

```bash
git status
git diff --stat
```

If `yarn.lock` appears and you did not intend a dependency change, restore it before committing:

```bash
git checkout origin/main -- yarn.lock
# or
git restore yarn.lock
```

### 4. Keep registry configuration clean

Prefer the project’s default registry. Avoid a personal `.yarnrc` or `.npmrc` that forces `registry.npmjs.org` when the lockfile was generated against `registry.yarnpkg.com`. When in doubt, check the active registry:

```bash
yarn config get registry
```

### 5. Keep commits focused

- Keep one logical change per pull request. A component rewrite should not also refresh the lockfile.
- If a dependency update is required, make it a separate commit or pull request and explain why.
- Run `yarn install --frozen-lockfile` before pushing and confirm that it succeeds.

### 6. Quick pre-push check

Use `--ignore-engines` only when you are deliberately testing with an unsupported Node.js version. With a supported Node.js version, omit it:

```bash
yarn install --frozen-lockfile --ignore-engines  # temporary unsupported-Node check only
# or, with a supported Node.js version:
yarn install --frozen-lockfile
git diff --exit-code yarn.lock                    # should be empty
```

## Learn More

Check out [nextjs.org](http://nextjs.org) to learn more about Next.js.

To deepen your understanding of ZecHub, visit the deployed app at [zechub.wiki](http://zechub.wiki).

## Contribute

ZecHub wiki is open-source and welcomes your contribution. Read our **[contributing guide](/CONTRIBUTING.md)** for more details on how.

Translating the wiki? See the **[translation guide](/docs/translation-guide.md)** for the translation workflow and how to add a language.
