---
title: Rust Operators
description: Understanding operators in Rust
---

# Rust Operators

Rust provides a variety of operators for performing operations on data. This guide covers the different types of operators available in Rust.

## Comparison Operators

Comparison operators compare two values and return a boolean result:

| Operator | Description |
|----------|-------------|
| `==` | Equal to |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

```rust
let (a, b) = (5, 10);

let equal = a == b;        // => false
let not_equal = a != b;    // => true
let less = a < b;          // => true
let greater = a > b;       // => false
let less_equal = a <= b;   // => true
let greater_equal = a >= b; // => false
```

## Arithmetic Operators

Arithmetic operators perform mathematical operations:

| Operator | Description |
|----------|-------------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulus (remainder) |

```rust
let (a, b) = (10, 3);

let sum = a + b;            // => 13
let difference = a - b;     // => 7
let product = a * b;        // => 30
let quotient = a / b;       // => 3 (integer division)
let remainder = a % b;      // => 1
```

For floating-point numbers:

```rust
let (a, b) = (10.0, 3.0);
let division = a / b;       // => 3.3333...
```

## Bitwise Operators

Bitwise operators manipulate individual bits in integers:

| Operator | Description |
|----------|-------------|
| `&` | Bitwise AND |
| `\|` | Bitwise OR |
| `^` | Bitwise XOR |
| `<<` | Left shift |
| `>>` | Right shift |

```rust
let (a, b) = (0b1010, 0b1100);  // Binary: 10, 12

let bitwise_and = a & b;         // => 0b1000 (8)
let bitwise_or = a | b;          // => 0b1110 (14)
let bitwise_xor = a ^ b;         // => 0b0110 (6)
let left_shift = a << 1;         // => 0b10100 (20)
let right_shift = a >> 1;        // => 0b0101 (5)
```

## Logical Operators

Logical operators work with boolean values:

| Operator | Description |
|----------|-------------|
| `&&` | Logical AND |
| `\|\|` | Logical OR |
| `!` | Logical NOT |

```rust
let (a, b) = (true, false);

let and = a && b;  // => false
let or = a || b;   // => true
let not = !a;      // => false
```

## Compound Assignment Operators

Compound assignment operators combine an operation with assignment:

| Operator | Equivalent |
|----------|------------|
| `+=` | `a = a + b` |
| `-=` | `a = a - b` |
| `*=` | `a = a * b` |
| `/=` | `a = a / b` |
| `%=` | `a = a % b` |
| `&=` | `a = a & b` |
| `\|=` | `a = a \| b` |
| `^=` | `a = a ^ b` |
| `<<=` | `a = a << b` |
| `>>=` | `a = a >> b` |

```rust
let mut a = 5;

a += 3;  // a = a + 3 => 8
a -= 2;  // a = a - 2 => 6
a *= 2;  // a = a * 2 => 12
a /= 4;  // a = a / 4 => 3
a %= 2;  // a = a % 2 => 1
```

## Range Operators

Range operators create iterators for ranges of values:

| Operator | Description |
|----------|-------------|
| `..` | Exclusive range |
| `..=` | Inclusive range |

```rust
// Exclusive range: 0, 1, 2, 3, 4
for i in 0..5 {
    println!("{}", i);
}

// Inclusive range: 0, 1, 2, 3, 4, 5
for i in 0..=5 {
    println!("{}", i);
}
```

## Type Casting Operator

The `as` operator is used for explicit type conversion:

```rust
let float_num = 3.14;
let integer_num = float_num as i32;  // => 3

let character = 'A';
let ascii_value = character as u8;   // => 65
```

## Next Steps

Continue exploring Rust with these topics:
- [Rust Flow Control](/Documentations/Development/Languages/Rust/Rust-FlowControl)
- [Rust Functions](/Documentations/Development/Languages/Rust/Rust-Functions)
- [Rust Miscellaneous](/Documentations/Development/Languages/Rust/Rust-Misc)
