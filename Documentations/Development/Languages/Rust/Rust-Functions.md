---
title: Rust Functions
description: Working with functions in Rust
---

# Rust Functions

Functions are the primary way to organize code in Rust. They allow you to group code, make it reusable, and give it a name.

## Basic Functions

In Rust, functions are defined using the `fn` keyword:

```rust
fn say_hello() {
    println!("Hello, world!");
}

fn main() {
    say_hello(); // Function call
}
```

## Function Parameters

Functions can take parameters, which are specified along with their types:

```rust
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    greet("Rustacean"); // => Hello, Rustacean!
}
```

### Multiple Parameters

```rust
fn add(a: i32, b: i32) {
    println!("{} + {} = {}", a, b, a + b);
}

fn main() {
    add(5, 7); // => 5 + 7 = 12
}
```

## Return Values

Functions can return values using the `->` syntax:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b // No semicolon means this is the return value
}

fn main() {
    let sum = add(5, 7);
    println!("Sum: {}", sum); // => Sum: 12
}
```

### Multiple Return Values Using Tuples

```rust
fn get_stats(numbers: &[i32]) -> (i32, i32, i32) {
    let min = *numbers.iter().min().unwrap_or(&0);
    let max = *numbers.iter().max().unwrap_or(&0);
    let sum = numbers.iter().sum();
    
    (min, max, sum)
}

fn main() {
    let numbers = [1, 2, 3, 4, 5];
    let (min, max, sum) = get_stats(&numbers);
    println!("Min: {}, Max: {}, Sum: {}", min, max, sum);
}
```

## Pass by Value vs Pass by Reference

### Pass by Value

When you pass a value to a function, ownership of the value is transferred (unless the type implements the `Copy` trait):

```rust
fn calculate_area(width: u32, height: u32) -> u32 {
    width * height
}

fn main() {
    let w = 10;
    let h = 20;
    let area = calculate_area(w, h);
    println!("Area: {}", area); // => Area: 200
    
    // w and h are still accessible here because they implement Copy
    println!("Width: {}, Height: {}", w, h);
}
```

### Pass by Reference

You can pass references to avoid transferring ownership:

```rust
fn print_length(s: &String) {
    println!("Length: {}", s.len());
}

fn main() {
    let message = String::from("Hello");
    print_length(&message);
    // message is still valid here
    println!("Message: {}", message);
}
```

### Mutable References

If you need to modify a parameter, use a mutable reference:

```rust
fn add_suffix(s: &mut String) {
    s.push_str("_suffix");
}

fn main() {
    let mut message = String::from("Hello");
    add_suffix(&mut message);
    println!("Message: {}", message); // => Message: Hello_suffix
}
```

## Arrays as Function Parameters

You can pass arrays to functions:

```rust
fn sum_array(numbers: [i32; 5]) -> i32 {
    let mut sum = 0;
    for num in numbers.iter() {
        sum += num;
    }
    sum
}

fn main() {
    let numbers = [1, 2, 3, 4, 5];
    let total = sum_array(numbers);
    println!("Sum: {}", total); // => Sum: 15
}
```

### Using Slices for Flexibility

Slices allow you to work with arrays of any size:

```rust
fn sum_slice(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for num in numbers.iter() {
        sum += num;
    }
    sum
}

fn main() {
    let numbers1 = [1, 2, 3, 4, 5];
    let numbers2 = [1, 2, 3];
    
    println!("Sum of numbers1: {}", sum_slice(&numbers1)); // => Sum of numbers1: 15
    println!("Sum of numbers2: {}", sum_slice(&numbers2)); // => Sum of numbers2: 6
}
```

## Returning Arrays

You can return arrays from functions:

```rust
fn create_array() -> [i32; 5] {
    [1, 2, 3, 4, 5]
}

fn main() {
    let numbers = create_array();
    println!("Numbers: {:?}", numbers); // => Numbers: [1, 2, 3, 4, 5]
}
```

## Function Pointers

Functions can be passed as arguments to other functions:

```rust
fn apply_operation(a: i32, b: i32, operation: fn(i32, i32) -> i32) -> i32 {
    operation(a, b)
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    let sum = apply_operation(5, 7, add);
    let product = apply_operation(5, 7, multiply);
    
    println!("Sum: {}", sum);       // => Sum: 12
    println!("Product: {}", product); // => Product: 35
}
```

## Closures

Closures are anonymous functions that can capture their environment:

```rust
fn main() {
    let x = 5;
    
    // Closure that captures x
    let add_x = |y| x + y;
    
    println!("5 + 3 = {}", add_x(3)); // => 5 + 3 = 8
}
```

## Next Steps

Continue your Rust learning journey with:
- [Rust Miscellaneous](/Documentations/Development/Languages/Rust/Rust-Misc)
