---
title: "Project Scaffolding - What to setup when starting a project"
description: "When we start a project, we usually don't give too much importance to establishing a foundation for Developer Experience (DX) to improve our development experience and the quality of our code. Furthermore..."
pubDate: "Nov 13 2023"
heroImage: "/project-scaffolding.jpg"
tags: ["devops", "dx"]
---

When we start a project, we usually don't give too much importance to establishing a foundation for Developer Experience (DX) to improve our development experience and the quality of our code. Furthermore, in our professional development (especially if it's relatively short like mine), we may not have seen many projects with long-term expectations.

In my current job, I found myself in the position of initiating several of these projects, and I have compiled a list of cross-stack tools that are very useful for both teamwork and ensuring project quality.

This list covers code quality, developer experience, change traceability, version management, and continuous integration and deployment, as well as interoperability and ease of installation.

---

## The source of knowledge: **the Makefile**

---

I think that if I had to choose one tool from the whole list it would be this one. Originally, Makefiles were created to facilitate the compilation of C code: they allowed to specify in a centralized file the dependencies between C libraries when compiling.

Their versatility (the ***targets*** are `bash` code) made their use extend beyond compilation.

Nowadays, the steps or operations available when working with a project are usually similar, but applied to its specific tech. stack:

- Compile a project: whether compiling a `C#` project to DLL or `TypeScript` to `JavaScript`, the intention is the same, ***get the final executable***.
- Formatting the code: regardless of the language, the formatting rules, the tool, etc. ***we just don't want the annoying coworker to complain*** (I am the annoying coworker 👀).

- Initialize the project: ***ugh, but in this project, which package manager is used? What about Git hooks?***
- Set up a proper development environment: numerous tools, many commands, lots of conditional steps, etc. W**here do we document them? In a Word document?** (I've seen things like that).

And other systematic, repetitive steps, with manuals that are rarely truly up-to-date, etc.

What if all these steps, which are usually commands (or can be executed as such), are centralized in a single file with a semantic, standardized name that allows us to use them without having to be intimately familiar with the wide range of tools, options, and commands?

The solution is ✨***Makefiles***✨:

A **Makefile** can be as simple as:

```makefile
command-name:
	multiple commands to be executed
	with linebreaks
	or bash scripts with its own syntas
	@if you type an <<at>> at the start, the command won't be listed
```

```makefile
hello-word:
	@echo 'Hello from Makefile'
```

Or take it a step further. Here is an example from one of my Python projects:

```makefile
# Makefile

.DEFAULT_GOAL := help

# Define colors
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
CYAN := \033[0;36m
PURPLE := \033[0;35m
RED := \033[0;31m
NC := \033[0m

POETRY_BIN :=  $(shell which poetry)
DOCKER_BIN := $(shell which docker)

.PHONY: help
help: ## 🌟 Show available targets and their explanations with colors
	@echo "$(GREEN)Available Targets:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(CYAN)%-15s$(NC) $(PURPLE)%-15s$(NC) %s\n", $$1, $$2, $$3}' $(MAKEFILE_LIST)

.PHONY: install
install: ## 🚀 Install dependencies using Poetry
	@$(POETRY_BIN) install

.PHONY: init
init: install ## 🎉 Initialize project and set up hooks
	@$(POETRY_BIN) run pre-commit install --install-hooks

.PHONY: lint
lint: ## 🧹 Lint the source code using Ruff
	@$(POETRY_BIN) run ruff src --fix

.PHONY: format
format: ## 🎨 Format the source code using Black
	@$(POETRY_BIN) run black src

.PHONY: test-unit
test-unit: ## 🧪 Run unit tests
	@rm -f test/assets/files/.gitkeep
	@$(POETRY_BIN) run pytest test/unit
	@touch test/assets/files/.gitkeep

.PHONY: test-int
test-int: ## 🐳 Run integration tests using Docker
	@$(DOCKER_BIN) compose \
    --env-file ./.env/test.env \
    --file test/integration/docker-compose.yaml \
    up --exit-code-from test-app

.PHONY: clean
clean: ## 🗑️ Clean untracked files from the repository
	@git clean -X -f -d

.PHONY: commit
commit: ## 📝 CLI tool to help create compliant commit message
	@$(POETRY_BIN) run cz c
```

The possibilities are endless. What I recommend is:

- Common steps (some we'll see later) across projects like linting, formatting, containerization, and so on.
- Confusing or non-standard commands (**`awk`**, **`jq`**, some less-commonly used **`git`** commands).
- Processes that require a sequential or conditional steps execution.

---

## For a standardized project: formatter and linter

---

If you've ever programmed in Python and you are like me, the one who creates a list comprehension that wouldn't fit on a projector (I've changed, I promise), those days are over.

> Code lines should not exceed (commonly) 88 characters.

But how do we deal with people like the young Samuel? Well, with a good formatter configuration. All languages have their implementation of a formatter; they all have a proposed style guide (and if not, the community takes care of creating its own), and a code analysis tool that doesn't modify code intent but does change formatting aspects to make it more readable  and maintainable according to the rules established by the team. Some implementations I've tried and can recommend:

- Python: **`black`** works quite well, although it sometimes collides with some linters (we'll see that below).
- TypeScript/JavaScript: **`Prettier`** is the most widely used by the community.

---

<aside>
💡 And that's it. Don't think I know how to code in 400 languages either.

</aside>

---

Later on, another tool that usually has some overlapping features with the formatter is the ***linter***: it performs static analysis of our code to provide guidelines on security and best practices. Try it out for yourselves, in a project you have in progress or in the most legacy one in your company, and get ready to shed a tear. 

The most well-known implementations by language are:

- Python: `flake8` or `autoflake8`, although lately I've been using `ruff`, and you can tell it's written in `Rust` (fast as *Lightning McQueen)*.
- TypeScript: `eslint` is also the most well-known, although you have to get it working with `Prettier` because sometimes one complains about the other.

---

❓ `Prettier` and `eslint` are like my friend [Julio](https://www.linkedin.com/in/julio-sarmiento-) and me: they don’t usually like each other but always have to work together, side by side.

---

📚 I haven't mentioned languages like `C#` (one of my favorites right now) or `Java` because they have other classic tools, such as Visual Studio for `C#` or `SonarLint` and `SonarQube` as highly recommended tools for both languages.


---

## Unlock our latptops’ power: Docker

---

Since I discovered Docker, nothing is impossible for me. Containers are the best way to ensure that an application, a project, or any code you need to run works as expected. Simply use one of the countless available images as a base and customize it to standardize the runtime environment of your program.

When you combine flat **`Dockerfile`** with **`docker-compose`**, your control over your application reaches its 100%. Initialization of components, disposable services, versioning of the configuration file, easy installation: **they have it all**.

Lately, I've been using **`Docker`** not only as an isolated execution or testing environment but also to configure the development environment for my colleagues using the Visual Studio Code extension **`DevContainers`**. Give it a try; it's worth it.

Here's an example of a **`docker-compose.yaml`** I use to start a project with many local infrastructure dependencies, as if your 2011 laptop with 8GB of RAM were an AWS DataCenter on its own:

---

```docker
services:
  test-app:
    build:
      dockerfile: test/integration/Dockerfile
      context: ../../
    volumes:
      - ..:/app/test
      - ../../src:/app/src
    env_file: .env/int.env
    depends_on:
      sftp:
        condition: service_healthy

  sftp:
    build:
      dockerfile: test/assets/sftp/Dockerfile
      context: ../../
    volumes:
      - ../assets/sftp/users/users.conf:/etc/sftp/users.conf:ro
      - ../assets/files:/home/${SFTP_USER}/${SFTP_TARGET_PATH}
      - ../assets/sftp/health:/var/health
    healthcheck:
      test: chmod +x /var/health/healthcheck.sh && sh /var/health/healthcheck.sh
      interval: 2s
      timeout: 1s
      retries: 3
      start_period: 1s

  smb:
    image: dperson/samba
    environment:
      - "USER=${TEST_SMB_USER};${TEST_SMB_PASSWORD}"
    volumes:
      - ../assets/files:/assets
      - ../assets/smb/health:/var/health
    command: >
      -s "${SMB_TARGET_PATH};/assets;yes;no;no;${SMB_USER}"
    healthcheck:
      test: chmod +x /var/health/healthcheck.sh && sh /var/health/healthcheck.sh
      interval: 2s
      timeout: 1s
      retries: 3
      start_period: 1s
```

---

## For a healthy and organized collaboration: Conventional Commits, SemVer, and CHANGELOG.

---

Raise your hand if you've ever run a `git log` and your branch looks like this:

```bash
| sdf78o fixxxx
| fgh887 fix2
| nh98df haha fix
| 89hasd which came first, the chicken or the egg
| 09y9gm i should be sleeping
| asdas8 hi mom i am on a gitlog
```

Please, just ***stop doing it***. There's a much more elegant way than greeting your mother when referencing changes: take a look at `Conventional Commits`. It defines a standard way to name our changes, providing scope, type, etc., making it much easier to our future selves and the rest of the team what that commit with 156 files and 7614 modified lines was about (also, please stop doing this).

The format is as follows:

```bash
<type>(<scope>): <message>

<longer description>

<footer>
```

Seriously, it's worth taking a look at the documentation; I don't know anyone who has learned about **`Conventional Commits`** and doesn't use it, even for cooking recipes.

But wait a moment, this doesn't end here...

**`Conventional Commits`** map very easily to positions in SemVer or **`semantic-versioning`**:

- **`fix`** corresponds to **`PATCH`**
- **`feat`** corresponds to **`MINOR`**
- Any of the above tagged as **`BREAKING CHANGE`** or with the abbreviation **`!`** after the scope corresponds to **`MAJOR`**.

With that in mind, our SemVer will look like:

```bash
v[MAJOR].[MINOR].[PATCH] -> v[BREAKING].[FEAT].[FIX] (v2.0.3)
```

And if that **atomic** 👀 commit I mentioned before introduces a bug into production, we can always roll back from **`v2.0.3`** to **`v2.0.2`** because we have our versions well-tracked.


***Tsss, but wait a moment*.** 

What if, in addition to tagging versions correctly, we could list the changes in a **`CHANGELOG.md`** to have them visible at the root of the repository? ✨Perfect traceability✨

Well, all this that I've told you is achieved simply by naming the commits correctly based on the convention—yes, that's all you have to do.

---

<aside>
📚 Well, and with the suffering of the poor soul who has to configure all the associated tools.

</aside>

---

I'll leave you with a list of the tools I use depending on the project's tech stack to ensure the convention is followed and for automating all the processes.

- For Python, I use a mix of **`pre-commit`** with local tools and **`commitizen`** and **`commitizen-cli`**. That's more than enough, although there's some slightly tricky configuration to modify, which I'll save for another post.
- For TypeScript/JavaScript, I use the combination of **`Husky`** to configure hooks, **`commitlint`** to check the commit message, **`standard-version`** to generate the **`CHANGELOG.md`**, and **`commitizen-cli`** in its **`npm`** version to prompt me to help write the message when I run **`git commit`**. I'll also cover the configuration of this stack in another post.

With this, and the help of a GitHub Action, every time something is merged into production, a beautifully aesthetic `CHANGELOG` is generated and pushed to main branch, as well as included in the release. Just 🤌🏻.

---

There's much more to delve into, but with these configurations, you'll give your DX a x10 boost, and it's a good start to define the standards you apply in your organization or team.

> "Optimizing for developer happiness is the best long-term optimization strategy." DHH (David Heinemeier Hansson)
> 
---

### 👋🏻 See you folks!