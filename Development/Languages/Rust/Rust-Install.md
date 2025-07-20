---
title: Rust Installation and Setup
description: Guide to installing Rust and setting up your development environment
---

# Rust Installation and Setup

Rust is a systems programming language focused on safety, speed, and concurrency. This guide will help you install Rust and set up your development environment.

## Installing Rust

The recommended way to install Rust is through Rustup, the Rust toolchain installer.

::: code-group
```sh [Linux/macOS]
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```powershell [Windows]
# Download and run rustup-init.exe from https://rustup.rs
# Or using winget:
winget install Rust.Rustup
```
:::

After installation, you'll have access to the Rust compiler (`rustc`), the package manager (`cargo`), and other tools.

## Verifying Installation

To verify that Rust is installed correctly:

```sh
rustc --version
cargo --version
```

## Your First Rust Program

Let's create a simple "Hello, World!" program to verify your Rust installation:

1. Create a new file named `hello.rs`:

```rust
fn main() {
  println!("Hello, World!");
}
```

2. Compile the program:

```sh
rustc hello.rs
```

3. Run the executable:

::: code-group
```sh [Linux/macOS]
./hello
```

```cmd [Windows]
hello.exe
```
:::

You should see the output:

```
Hello, World!
```

## Using Cargo

Cargo is Rust's build system and package manager. It handles tasks like building your code, downloading dependencies, and building those dependencies.

### Creating a New Project

```sh
cargo new hello_cargo
cd hello_cargo
```

This creates a new directory with the following structure:

```
hello_cargo/
├── Cargo.toml
└── src/
    └── main.rs
```

### Building and Running

```sh
# Build the project
cargo build

# Run the project
cargo run

# Check if code compiles without producing an executable
cargo check
```

## Development Environment

For an optimal Rust development experience, consider using:

- **Visual Studio Code** with the "rust-analyzer" extension
- **IntelliJ IDEA** with the "Rust" plugin
- **Vim/NeoVim** with rust.vim and rust-analyzer plugins

## Next Steps

Now that you have Rust installed, proceed to [Rust Programming Basics](/Development/Languages/Rust/Rust-Basics) to start learning the language.
