---
path: /managing-go-monorepo-with-bazel
date: 2018-01-29
title: Managing a Go monorepo with Bazel
tags:
  - golang
  - go
  - monorepo
  - bazel
---

At [InPlayer](https://inplayer.com/), we have a platform that is built using a *microservice* architectural style which basically structures an application as a collection of many different services. In this post I will talk about how we structure, build and deploy our Go applications.

Every bit of Go code that we write, resides in a single Git repository - A monorepo. Since every library and service is in a single project, it allows us to make cross cutting changes without the need of some external package management tools. Basically it is impossible for the code to be out of sync and each change that we make can be considered as a single unit.

While the benefits are clear, the challenge in working with a Go monorepo is how to build and test each package efficiently. The answer - [Bazel](https://bazel.build/).

### What is Bazel?

Bazel is a build tool which is blazingly fast. It only rebuilds what is necessary and it leverages advanced caching mechanisms and parallel execution which make your builds very, very fast. Besides those features, it can also manage your code dependencies, call external tools and plugins, and it can build Docker images from your binary executables as well. It uses `go build` under the hood but it can also support many different languages, not just go. You can use it for Java, C++, Android, iOS and a variety of other language platforms. You can run Bazel on the three major operating systems - Windows, macOS and Linux.

### Project structure

Before we dive deeper into Bazel, first let's discuss our project structure:

```
    platform
    |-- src
    |    |-- foo
    |    |   |--cmd
    |    |   |  `--bar
    |    |   |     |--BUILD
    |    |   |     `--main.go
    |    |   `--pkg
    |    |-- utils
    |    |-- vendor
    |    |-- Gopkg.lock
    |    |-- Gopkg.toml
    |    |-- BUILD
    |    `-- WORKSPACE
    |-- README.md
    `-- gitlab-ci.yml
```

The `platform` directory is our root, everything starts from there. In that folder we have our CI configuration and the `src` directory where we keep all of our code. Each service is a sub-directory in the `src` folder, and in every service we have two top-level directories, the `cmd` and `pkg` folders. Underneath `cmd` we have directories for our binaries (our main programs) and the `pkg` directory is used for our service libraries.

Bazel builds software from code organized in a directory called a *workspace*, which is basically our src directory. Here, our workspace directory must contain a file named `WORKSPACE` which may have references to external dependencies required to build the outputs as well as build rules.

Here is an example WORKSPACE file:

```
http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.9.0/rules_go-0.9.0.tar.gz",
    sha256 = "4d8d6244320dd751590f9100cf39fd7a4b75cd901e1f3ffdfd6f048328883695",
)
http_archive(
    name = "bazel_gazelle",
    url = "https://github.com/bazelbuild/bazel-gazelle/releases/download/0.9/bazel-gazelle-0.9.tar.gz",
    sha256 = "0103991d994db55b3b5d7b06336f8ae355739635e0c2379dea16b8213ea5a223",
)
git_repository(
    name = "io_bazel_rules_docker",
    remote = "https://github.com/bazelbuild/rules_docker.git",
    tag = "v0.3.0",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")
go_rules_dependencies()
go_register_toolchains()
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies")
gazelle_dependencies()

load(
    "@io_bazel_rules_docker//go:image.bzl",
    _go_image_repos = "repositories",
)

_go_image_repos()
```

In this file there are several dependencies added to the workspace. We are specifically declaring that we will use the [rules_go](https://github.com/bazelbuild/rules_go) and [rules_docker](https://github.com/bazelbuild/rules_docker) dependencies, as well as [Gazelle](https://github.com/bazelbuild/bazel-gazelle), which will help us generate some files needed for Bazel. Don't worry if this syntax is not familiar to you right away, it takes some time getting used to it.

### BUILD Files

Bazel has a concept around *packages* which are defined as a collection of related files and a specification of the dependencies among them. If a directory inside a Bazel workspace contains a file named `BUILD`, it will consider that directory as a package. A package includes all files in its directory, as well as all sub-directories beneath it, except those which themselves contain a BUILD file.

A BUILD file contains build rules which define how we should build our packages. You can read more about the concepts and terminology [here](https://docs.bazel.build/versions/master/build-ref.html).

When starting a new project, the first thing that we need to do is add a BUILD file inside the root directory, which will load the gazelle rule to be used later to run [Gazelle](https://github.com/bazelbuild/bazel-gazelle) with Bazel.

```
package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_docker//container:container.bzl")
load("@io_bazel_rules_go//go:def.bzl", "go_prefix", "gazelle")

go_prefix("github.com/example/project")
gazelle(
  prefix = "github.com/example/project/src",
  name = "gazelle",
  command = "fix",
  external = "vendored"
)
```

After adding this file, we can run Gazelle using this command:

`bazel run //:gazelle`

This will generate new BUILD files, based on the go files that you have inside your project. When you later add new programs and libraries, you should update the existing BUILD files using the same command, otherwise your builds can fail.

As an example (based on our project structure shown earlier), gazelle will generate a BUILD file for our `bar` program that resides in the `foo` package, which would look something like this:

```
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

package(default_visibility = ["//visibility:public"])

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importpath = "github.com/example/project/src/foo/cmd/bar",
    visibility = ["//visibility:private"],
    deps = [
        #Any dependencies that our library has will be loaded here
    ],
)

go_binary(
    name = "bar",
    embed = [":go_default_library"],
    importpath = "github.com/example/project/src/foo/cmd/bar",
    visibility = ["//visibility:public"],
)
```

Now by running the command `bazel build //foo/...` bazel will build our Go program and save the binary in the output directory. If you want to build the whole project, just simply run `bazel build //...` inside the root folder. 

If you write tests for your libraries and programs (which you should), gazelle will generate `go_test` rules for them, and then you can run `bazel test //...` which will run all tests.

Bazel's advanced caching makes running the `build` and `test` commands for the whole workspace super fast, because it will only build or test the files which you have changed, as well as the files that are dependent on those changed files.

⚠️ Note: Make sure you setup your CI server to cache the output directory, otherwise you won't see much benefit from running bazel.

### Docker images

In a case where we want to build and deploy our binaries as docker images, bazel has a nice set of rules to do just that. What's more important is that bazel **does not** require Docker for pulling, building or pushing images. This means that you can use these rules to build Docker images on Windows/OSX without the use of `docker-machine` or `boot2docker`, also it will not require *root* access on your laptop.

The full example of a BUILD file for our `bar` program looks like this:

```
load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

# First we load the go_image and container_push rules
load("@io_bazel_rules_docker//go:image.bzl", "go_image")

package(default_visibility = ["//visibility:public"])

go_library(
    name = "go_default_library",
    srcs = ["main.go"],
    importpath = "github.com/example/project/src/foo/cmd/bar",
    visibility = ["//visibility:private"],
    deps = [
        #Any dependencies that our library has will be loaded here
    ],
)

go_binary(
    name = "bar",
    embed = [":go_default_library"],
    importpath = "github.com/example/project/src/foo/cmd/bar",
    visibility = ["//visibility:public"],
)

go_image(
    name = "docker",
    binary = ":bar",
)
```

The `go_image` rule uses a [distroless](https://github.com/GoogleCloudPlatform/distroless) image as a base and just adds the binary file as the command to be run. You can use the `container_push` rule as well if you want to push your image to a remote repository.

In order to run the binary as a docker image, just type the `bazel run //foo/cmd/bar:docker` command. You can also build a tar bundle, which you can then manually load into docker by using these commands:

- `bazel build //foo/cmd/bar:docker.tar`
- `docker load -i bazel-output/foo/cmd/bar/docker.tar`

You can find more information about the rules [here](https://github.com/bazelbuild/rules_docker).

