---
title: Rust String Handling
description: Working with strings in Rust
---

# Rust String Handling

Rust has two main string types: `String` and `&str`. Understanding the difference and how to work with them is essential for Rust programming.

## String Types

### String Literals (`&str`)

String literals are fixed-length string references that are stored in the program's binary:

```rust
let greeting: &str = "Hello, Rust!";
let language: &str = "Rust";

println!("Programming in {language}");
```

### String Objects (`String`)

The `String` type is a growable, heap-allocated string:

```rust
// Creating an empty String
let mut empty_string = String::new();

// Converting &str to String
let str_slice = "hello";
let string_object = str_slice.to_string();

// Creating a String from a literal
let language = String::from("Rust");
```

## String Methods

### Capacity

The `capacity()` method returns the number of bytes the string can hold without reallocating:

```rust
let text = String::from("Random String");
let capacity = text.capacity();  // => 13
```

### Contains

The `contains()` method checks if a substring is contained in the string:

```rust
let name = String::from("Rustacean");
let contains_rust = name.contains("Rust");  // => true
```

### Pushing to Strings

Add characters or strings to an existing `String`:

```rust
// Push a single character
let mut half_text = String::from("Hal");
half_text.push('f');    // => "Half"

// Push an entire string
let mut greeting = String::from("Hello ");
greeting.push_str("world!");  // => "Hello world!"
```

### String Concatenation

There are several ways to combine strings:

```rust
// Using +
let first = String::from("Hello, ");
let second = String::from("world!");
let combined = first + &second;  // first is moved here

// Using format! macro
let first = "Hello";
let second = "world";
let combined = format!("{}, {}!", first, second);
```

### String Slicing

You can create slices of strings:

```rust
let text = String::from("Rust programming");
let slice = &text[0..4];  // => "Rust"
```

::: warning
Be careful when slicing strings, as Rust strings are UTF-8 encoded. Slicing at a
non-character boundary will cause a runtime panic.
:::

### String Length

Get the length of a string:

```rust
let text = "Rust is awesome!";
let byte_length = text.len();  // Length in bytes
let char_count = text.chars().count();  // Number of characters
```

### String Iteration

Iterate over characters in a string:

```rust
let text = "Rust!";

// Iterate over characters
for c in text.chars() {
    println!("{}", c);
}

// Iterate over bytes
for b in text.bytes() {
    println!("{}", b);
}
```

## String Conversion

Converting between string types:

```rust
// &str to String
let slice: &str = "Hello";
let owned: String = slice.to_string();
// or
let owned: String = String::from(slice);

// String to &str
let owned: String = String::from("Hello");
let slice: &str = &owned;
// or
let slice: &str = owned.as_str();
```

## Next Steps

Continue learning about Rust with these topics:
- [Rust Operators](/Documentations/Development/Languages/Rust/Rust-Operators)
- [Rust Flow Control](/Documentations/Development/Languages/Rust/Rust-FlowControl)
- [Rust Functions](/Documentations/Development/Languages/Rust/Rust-Functions)
