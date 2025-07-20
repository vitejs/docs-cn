---
title: Rust Data Types
description: Comprehensive guide to Rust's type system
---

# Rust Data Types

Rust is a statically typed language with a rich type system. This guide covers the various data types available in Rust.

## Integer Types

Rust provides several integer types with different sizes and signedness:

| Type | Description |
|------|-------------|
| `i8` | 8-bit signed integer |
| `i16` | 16-bit signed integer |
| `i32` | 32-bit signed integer (default) |
| `i64` | 64-bit signed integer |
| `i128` | 128-bit signed integer |
| `isize` | Pointer-sized signed integer |
| `u8` | 8-bit unsigned integer |
| `u16` | 16-bit unsigned integer |
| `u32` | 32-bit unsigned integer |
| `u64` | 64-bit unsigned integer |
| `u128` | 128-bit unsigned integer |
| `usize` | Pointer-sized unsigned integer |

```rust
let mut a: u32 = 8;
let b: u64 = 877;
let c: i64 = 8999;
let d = -90; // Inferred as i32
```

## Floating-Point Types

Rust has two floating-point types:

| Type | Description |
|------|-------------|
| `f32` | 32-bit floating point |
| `f64` | 64-bit floating point (default) |

```rust
let mut sixty_four_bit_float: f64 = 89.90;
let thirty_two_bit_float: f32 = 7.90;
let just_a_float = 69.69; // Inferred as f64
```

## Boolean Type

The boolean type in Rust has two possible values: `true` and `false`.

```rust
let true_val: bool = true;
let false_val: bool = false;
let just_a_bool = true;
let is_true = 8 < 5;  // => false
```

## Character Type

The `char` type represents a Unicode scalar value, which is encoded as a 4-byte value.

```rust
let first_letter_of_alphabet = 'a';
let explicit_char: char = 'F';
let implicit_char = '8';
let emoji = '😀'; // Unicode character
```

## Compound Types

### Arrays

Arrays in Rust have a fixed length and elements of the same type.

```rust
// Array with 6 elements of type i64
let array: [i64; 6] = [92, 97, 98, 99, 98, 94];

// Creating a mutable array
let mut mutable_array: [i32; 3] = [2, 6, 10];
mutable_array[1] = 4;
```

### Multi-Dimensional Arrays

```rust
let matrix: [[i64; 6]; 2] = [
    [1, 2, 3, 4, 5, 6],
    [6, 5, 4, 3, 2, 1]
];
```

### Slices

Slices are references to a contiguous sequence of elements in a collection.

```rust
let mut array: [i64; 4] = [1, 2, 3, 4];
let slice: &[i64] = &array[0..3]; // Elements 0, 1, 2

println!("The elements of the slice are: {:?}", slice);
```

### Vectors

Vectors are dynamically-sized arrays.

```rust
// Creating a vector using the vec! macro
let vector = vec![1, 2, 3, 4, 5];

// Creating an empty vector and adding elements
let mut dynamic_vector: Vec<i32> = Vec::new();
dynamic_vector.push(10);
dynamic_vector.push(20);
```

### Tuples

Tuples are fixed-size collections of values of different types.

```rust
let tuple = (1, 'A', "Cool", 78, true);

// Accessing tuple elements
let first_element = tuple.0;  // => 1
let second_element = tuple.1; // => 'A'

// Destructuring a tuple
let (number, character, text, another_number, boolean) = tuple;
```

## Type Aliases

You can create a type alias to give a new name to an existing type:

```rust
type Kilometers = i32;
let distance: Kilometers = 5;
```

## Type Conversion

Rust requires explicit type conversion, known as casting:

```rust
let a_int = 90; // i32
// int to float
let type_cast = (a_int as f64);

let original: char = 'I';
// char to int => 73
let type_casted: i64 = original as i64;
```

## Next Steps

Learn more about Rust's capabilities with these topics:
- [Rust Strings](/Development/Languages/Rust/Rust-Strings)
- [Rust Operators](/Development/Languages/Rust/Rust-Operators)
- [Rust Flow Control](/Development/Languages/Rust/Rust-FlowControl)
