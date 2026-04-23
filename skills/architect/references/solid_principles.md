# SOLID Principles Reference

## Single Responsibility Principle (SRP)

**Definition:** A class should have only one reason to change.

**In React/Next.js:**
- One component = one visual element
- One hook = one concern
- One utility function = one transformation
- One API route = one operation

**Signs of Violation:**
- Component manages both UI state and server state
- File contains both types and business logic
- Function does validation, transformation, and side effects
- UseEffect with empty dependency array doing initialization + analytics + data fetch

**Refactoring Strategy:**
1. Identify distinct responsibilities
2. Extract each into separate function/hook/component
3. Name based on the single responsibility

## Open/Closed Principle (OCP)

**Definition:** Open for extension, closed for modification.

**In React/Next.js:**
- Add new variants via props/config, not by editing component
- New API endpoints follow existing patterns
- New features add files, don't modify core files

**Signs of Violation:**
- Adding new feature requires editing 5+ existing files
- Switch statements that grow with each new type
- If-else chains in render methods

**Refactoring Strategy:**
1. Replace conditionals with lookup tables (objects/maps)
2. Use composition over inheritance
3. Extract strategies into separate modules

## Liskov Substitution Principle (LSP)

**Definition:** Subtypes must be substitutable for base types.

**In React/Next.js:**
- Specialized components work where general component expected
- Mock implementations work in tests without changing test code
- Override props don't break parent component

**Signs of Violation:**
- Component throws when optional prop missing
- Type assertions needed to make types work
- `if (prop === undefined) throw` in supposedly optional props
- Tests fail when swapping real implementation with mock

**Refactoring Strategy:**
1. Use discriminated unions for variant types
2. Make interfaces precise, not broad with optionals
3. Validate at boundaries, not inside components

## Interface Segregation Principle (ISP)

**Definition:** Clients shouldn't depend on interfaces they don't use.

**In React/Next.js:**
- Components receive only props they need
- Hooks return only values consumers need
- Types don't force optional fields everywhere

**Signs of Violation:**
- Props interface with 10+ fields, mostly optional
- Spreading entire object as props `{...data}`
- Hooks returning large tuples/objects where callers only use one field
- Context providers with 15 values, consumers use 2

**Refactoring Strategy:**
1. Split large interfaces into role-based interfaces
2. Use selectors to pass derived data, not raw objects
3. Split contexts by concern

## Dependency Inversion Principle (DIP)

**Definition:** Depend on abstractions, not concretions.

**In React/Next.js:**
- Services abstract database/HTTP calls
- Components depend on props interfaces, not specific data shapes
- Tests use mocks that implement same interface

**Signs of Violation:**
- `import { prisma }` in API routes without repository layer
- Direct `fetch()` calls in components
- Hardcoded Stripe/Resend imports in business logic
- Components importing specific icon from lucide instead of receiving as prop

**Refactoring Strategy:**
1. Create interface/type for external dependency
2. Inject dependency via props or constructor
3. Create adapter for concrete implementation
