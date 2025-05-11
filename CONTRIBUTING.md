# Contributing Policy

Thanks for your interest in contributing to ByteBin! We appreciate your help and taking your time to contribute.

Before you start, please first discuss the feature/bug you want to add with the owners and comunity at our [Discord](https://discord.gg/qNyybSSPm5) server. This will help us to understand your needs and provide you with the best possible solution.

We have a few guidelines to follow when contributing to this project:

- [Commit Convention](#commit-convention)
- [Pull Request](#pull-request)
- [Running Locally](#running-locally)

## Commit Convention

Before you create a Pull Request, please make sure your commit message follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify `src` files
- **revert**: Reverts a previous commit

Example:

```
feat: add new feature
```

## Pull Request

- The `master` branch is the source of truth and should always reflect the latest stable release.
- Before creating a pull request, make sure your documentation changes (if any) are accurate and follow the project's documentation standards.
- When creating a pull request, please provide a clear and concise description of the changes made.
- If your pull request fixes an open issue, please reference the issue in the pull request description.
- Once your pull request is merged, you will be automatically added as a contributor to the project.

Thank you for your contribution!

## Running Locally

To run the website locally, follow these steps:

1. Clone the repository. If you plan to make changes, create a fork first!

```bash
$ git clone https://github.com/BX-Team/ByteBin
```

2. Install all required dependencies.

```bash
$ bun install
```

3. Start the development server.

```bash
$ bun server:start
```

This will start a local development server and show you a link to the local website. The majority of changes will be instantly reflected live without the need to restart the development server or reload the page in your browser. Edit away!
