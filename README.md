# TypeScript Breaking Change Detector

## Overview

The **TypeScript Breaking Change Detector** is a tool designed for TypeScript developers to identify **breaking changes** when updating APIs or type declarations. By comparing the structure and types in the previous and current versions of TypeScript codebases, it highlights potential compatibility issues.

The tool performs **AST-based analysis** to validate changes and reports when updates might break backward compatibility for users of the code.

---

## Features

### What This Tool Does
- Analyzes **changes in TypeScript declarations** such as:
  - Classes, interfaces, enums, variables, functions, and type aliases.
- Detects **breaking changes**, including:
  - Removed or renamed exports.
  - Changes in function signatures or return types.
  - Incompatible modifications to types or type annotations.

### Examples of Errors Detected
Here are some common breaking changes that the tool identifies:

#### 1. **Export Removed**
```typescript
// Previous version
export interface User {
  name: string;
  age: number;
}

// Current version
interface User {
  name: string;
  age: number;
}

Error: EXPORT_REMOVED - interface User
```

#### 2. **Property Type Changed**
```typescript
// Previous version
export interface User {
  name: string;
}

// Current version
export interface User {
  name: number;
}

Error: PROPERTY_CHANGED - property name: string in interface User
```
#### 3. **Function Parameter Changed**
```typescript
// Previous version
export function calculate(a: number, b: number): number;

// Current version
export function calculate(a: number): number;

Error: FUNCTION_PARAMETER_CHANGED - function calculate(a: number, b: number): number
```
#### 4. **Enum Member Removed**
```typescript
// Previous version
export enum Colors {
  Red,
  Blue,
}

// Current version
export enum Colors {
  Red,
}

Error: ENUM_MEMBERS_CHANGED - look at members of Colors
```
#### 5. **Variable Type Changed**
```typescript
// Previous version
export let counter: number;

// Current version
export let counter: string;

Error: VARIABLE_CHANGED_OR_REMOVED - variable counter: number
```
## How It Works
#### AST Comparison:

Parses the TypeScript code into an Abstract Syntax Tree (AST).
Analyzes the structure of declarations in the previous and current versions.
#### Validation:

Compares nodes in the AST to detect changes in type annotations, member definitions, and function signatures.
#### Error Reporting:

Generates clear error messages for detected breaking changes, helping developers address issues quickly.
## Future Plans
#### Detailed Reporting:
Provide more context in error messages, such as locations and suggestions.

## Contributing
Contributions are welcome! Feel free to fork the repository, suggest improvements, or add new features.

License
This project is licensed under the MIT License.
