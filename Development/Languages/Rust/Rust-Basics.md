---
title: Rust Programming Basics
description: Introduction to fundamental Rust programming concepts
---

# Rust Programming Basics

This guide covers the fundamental concepts you need to get started with Rust programming.

## Basic Syntax

### Comments

```rust
// Line comments
/* Block comments */
/// Documentation comments (for functions, structs, etc.)
//! Inner documentation comments (usually at the start of a file)
```

### Variables

In Rust, variables are immutable by default. To make them mutable, use the `mut` keyword:

```rust
// Immutable variable
let variable = "This is a variable";

// Mutable variable
let mut mutable_variable = "Mutable";

// Multiple assignments
let (name, age) = ("Rustacean", 5);

// Constants (global)
const MAX_POINTS: u32 = 100_000;
```

### Printing

Rust provides several macros for printing to the console:

```rust
// Print without a newline
print!("Hello World");

// Print with a newline
println!("Hello World");

// Print error without a newline
eprint!("This is an error");

// Print error with a newline
eprintln!("This is an error with a newline");
```

### Formatting

```rust
// Basic placeholder
println!("{}", 1);

// Multiple placeholders
println!("{} {}", 1, 3);

// Positional arguments
println!("{0} is {1} {2}, also {0} is a {3} language", 
         "Rust", "cool", "language", "safe");

// Named arguments
println!("{country} is a diverse nation with unity.", country = "India");

// Format specifiers
println!("Binary: {:b}, Hex: {:x}, Octal: {:o}", 76, 76, 76);

// Debug trait
println!("Debug output: {:?}", (76, 'A', 90));

// New format strings (Rust 1.58+)
let x = "world";
println!("Hello {x}!");
```

## Basic Program Structure

A simple Rust program has the following structure:

```rust
fn main() {
    // Your code goes here
    println!("Hello, Rust!");
}
```

The `main` function is the entry point of every Rust program.

```mermaid
graph TD
    A[Start] --> B[fn main()]
    B --> C[Your Code]
    C --> D[println!("Hello, Rust!")]
    D --> E[End]
```

::: tip
This diagram shows the flow of a basic Rust program: execution starts at `main`, runs your code, and ends.
:::

## Data Types Overview

Rust is a statically typed language, which means that it must know the types of all variables at compile time.

### Scalar Types

- **Integers**: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`, `u8`, `u16`, `u32`, `u64`, `u128`, `usize`
- **Floating-point**: `f32`, `f64`
- **Boolean**: `bool` (true/false)
- **Character**: `char` (Unicode scalar value)

### Compound Types

- **Tuples**: Fixed-length collection of values of different types
- **Arrays**: Fixed-length collection of values of the same type
- **Vectors**: Dynamically sized arrays
- **Strings**: Text as UTF-8 encoded data

For more details on types, see [Rust Types](/Development/Languages/Rust/Rust-Types).

## Next Steps

Continue your Rust learning journey with these topics:

- [Rust Types](/Development/Languages/Rust/Rust-Types)
- [Rust Strings](/Development/Languages/Rust/Rust-Strings)
- [Rust Operators](/Development/Languages/Rust/Rust-Operators)
- [Rust Flow Control](/Development/Languages/Rust/Rust-FlowControl)
- [Rust Functions](/Development/Languages/Rust/Rust-Functions)
