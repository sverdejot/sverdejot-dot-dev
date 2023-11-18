---
title: "Monadic Error Handling in OOP"
description: "Applying functional programing concepts to our OOP applications to build more resilient applications. But everything comes at a cost."
pubDate: "Nov 18 2023"
heroImage: "/monads.jpg"
tags: ["software-architecture", "functional-programming", "oop", "error-handling"]
badge: "NEW"
---

A long time ago, at the College, I had to do some work on **Haskell** and **Prolog**: it was our first approach to DSA: binary trees, linked-list, sorting algorithms, etc.. Gosh, It was so hard to understand. It was radically different from what we had been learning the past 2 years.

Once you get into it, it feels incredible how readable and clean your code is. But that feel didn’t last for that long. As soon as I got back to OOP, I forgot almost everything about *functional/logic programming.*

A few time ago, I was reading some articles about proper error handling on Clean Architecture and something caught my attention: ***monadic error handling helps us build more resilient applications.*** A young and innocent Samuel tried to remember what *monad* means and faced the following definition:

> *a monad in X is just a monoid in the category of endofunctors of X, with product × replaced by composition of endofunctors and unit set by the identity endofunctor.*
> 

Hell, my man, what did I just read? I’d prefer to become a farmer than keep learning those almost impossible to understand terms. It took me some trial and error, reading articles, watching YouTube videos (and a few TikToks, not gonna lie) until I finally managed to understand how they work and why we use them in our OOP applications. As you may predict, there are many flavors, opinions, hate/love, and so on about using monads.

---

## But first, please, what the hell a monad is?

---

During my research phase, I came to a commonly quoted on every forum about monads: *once you understand monads, it becomes impossible to explain them.*

Simplifying things as much as I can, a *monad* is nothing more than a *wrapper* around some computation that has some special capabilities. Think of common OOP approaches for nullability checks, error handling, working with collections, etc. Well, *monads* can help you out in performing those operations in a more declarative way.

---

```tsx
let matchProductOrDefault = (criteria: Criteria<Product>): Promise<Maybe<Product>> => ...

let matchProduct = (criteria: Criteria<Product>): Promise<Either<ProductNotFoundError, Product>> => ...

let findAllProduct = () : Promise<Collection<Product>> => ...
```

---

As I said, each monad has its purpose: for example, `Either` allows us to handle side effects when a method can return *either* of the types it specifies. The typical scenario is: *either this method returns an error or a value*. In `TypeScript`, for example:

```tsx
type Either<L extends Error, R> = Left<L, R> | Right<L, R>

class Left<L extends Error, R> {
	constructor(public error: L)
  {
  }

	pipe = (fn: (value: R) => Either<L, R>): Either<L, R> =>
    new Left(this.error);

	match = (right: (value: R) => void, left: (error: L) => void): void =>
		left(this.error as L);
}

class Right<L extends Error, R> {
	constructor(public value: R)
  {
  }

	pipe = (fn: (value: R) => Either<L, R>): Either<L, R> =>
    fn(this.value);

	match = (right: (value: R) => void, left: (error: L) => void): void =>
        right(this.value as R);
}
```

```tsx
class Either<L extends Error, R> {
    public constructor(
        public value: L | R, 
        public isSuccess: boolean,
        public isFailure: boolean = !isSuccess)
    {
    }

    static Left = <L extends Error, R>(value: L): Either<L, R> =>
        new Either<L, R>(value, false);

    static Right = <L extends Error, R>(value: R): Either<L, R> =>
        new Either<L, R>(value, true);

    pipe = (fn: (value: R) => Either<L, R>): Either<L, R> =>
        (this.isSuccess) ? fn(this.value as R) : Either.Left(this.value as L);

    match = (right: (value: R) => void, left: (error: L) => void): void =>
        (this.isSuccess) ? right(this.value as R) : left(this.value as L);

    get result(): L | R
    {
        return this.value;
    }
}
```

---

> I’ll be using second example (`Either class`) for the following code snippets
> 

---

As you can see, the only difference is that Left represents an error and Right represents a value. But when it comes to common methods for monads, we encounter `pipe`, which enables to sequentially apply a collection of functions within a monad, properly handling scenarios where the computation raises an error.

For example, given the following function:

```tsx
const divide = (num: number, divisor: number): Either<DivisionByZeroError, number> =>
    (divisor === 0) ?
        Either.Left(new DivisionByZeroError(num)) :
        Either.Right(num / divisor);
```

If I perform the following computation:

```tsx
let result = divide(100, 2)
	.pipe((num) => divide(num, 5))
	.pipe((num) => divide(num, 4))
	.pipe((num) => divide(num, 2)); // result = Right { value: 1.25 }
```

There would be no problem piping all the functions until I get the result. The same applies to the following code: as the *monad* can handle the value itself, this operation does not throw an exception, although it may return an error (left value) in any of these operations.

```tsx
let result = divide(100, 2)
	.pipe((num) => divide(num, 0)) // here is generated the left value
	.pipe((num) => divide(num, 4))
	.pipe((num) => divide(num, 2)); // result = Left { DivisionByZeroError { message: "Cannot divide by zero" } }
```

Or `match`, which allows us to execute a function based on the inner value type of the Monad:

```tsx
result.match(
    (value) => console.log(`The division result is: ${value}`),
    (error) => console.log(`Something went wront while performing division: ${error.message}`));
```

---

From these examples, you can think of any other monad type like `Maybe`, `Collection`, `Just` and others.

However, for me, this represents the most functional approach because we are using functional methods (`pipe` or `match`above) to perform the operation. This adds complexity and breaks our usual way of programming: procedural, referencing previous values, etc. and expects us to take into account functional programming principles like function isolation, purity, etc.

While it may result in a cleaner code for someone, the complexity it introduces might be a lot for a more junior developer who has only worked with OOP, so let’s further analyze other advantages it gives.

---

## Monadic Error Handling

---

There are three main reasons for using monads for error handling:

- In most programming languages, there is no way to type hint the exceptions a method can throw.
- Errors are not the same as exceptions: a validation error should not be thrown since it is part of our domain, and not an exceptional behaviour. Treat errors as values, not exceptions.
- Throwing exceptions impacts performance.

---

## In most programming languages, there is no way to type hint the exceptions a method can throw.

---

In the software engineering world, there has been a common discussion all over the years: *exceptions, yes or no*, but beyond that: *checked exceptions, yes or no.*

At the early years of modern software design, the `Java` design team introduced a term that nobody cared about before, *checked exceptions.* When you implement a method that *throws* an exception inside it, you have to declare the type of exception it throws in the method header with a `throws` keyword. Thus, by specifying it in the header, the API, the contract of the method, any other method that uses it **must** handle this type of exceptions.

It is useful because not only you have the result of the method but also the errors it can throws, thus, avoiding common unexpected behaviors.

But this does not cover all cases, what happens when someone tries to divide a number by zero at runtime? in Java, it will throw a `DivisionByZeroException` but although you explicitly check this, the compiler has no knowledge that it can throw this exception. Thus, we face to `RuntimeException` or unchecked exceptions in Java.

Now that we are talking the same language about checked and unchecked exceptions, let’s go for the debate:

---

> *Should or should not checked exceptions be used in a statically typed and compiled language?*
> 

---

Microsoft’s team developing C# decided that there was no need to include checked exceptions. Anders Hejlsberg, main architect of C# at Microsoft decided that for [extensibility and scalability concerns](https://www.linkedin.com/pulse/say-hello-checked-exception-from-c-amin-esmaeily/), they will not include checked exception in C#.

Others’ concerns are that it can leak low-level concerns to upper level layers, with the need of handling technology-specific exceptions in higher level of abstraction modules.

But apart from the debate about whether include checked exceptions or not, if our current programming language does not allows us to specify the exceptions/errors a method can throw, how can we tell the client code (the code portion where the method is used) that it can return some type of error?

Guess what, monads. By treating those exceptions as part of the return type of the method, there is no need of throwing it or leaking low-level details. Just treat the exception as a returned value. Solved.

---

## Errors are not the same as exceptions

---

That’s fairly true. If you have some type of validation error when parsing an email, you won’t argue that it has not the same critically than not being able to connect to the database. Errors within our domain or validation errors should not be treated as exceptions as they are not part of exceptional scenarios, but rather common flows that should be handled differently.

---

## Throwing exceptions impacts performance.

---

Yes, throwing exceptions comes at a cost. It comes from low-level handling, such as unwrapping the stack trace to get information about the exception, locating the right handler in the exception handlers’ table, and so on. 

In the C# world, there are [some tests](https://youtu.be/a1ye9eGTB98) out there (not super scientific, though) that compare how monadic error handling works versus using exceptions. They kinda lean towards liking monads more, but take into account that these tests were conducted in an environment where every single method call ends up throwing an exception. Plus, there are more effective ways to improve performance (like early returns) instead of solely relying on monads.

---

## Wrapping things up

---

As Neal Ford said on a [book](http://fundamentalsofsoftwarearchitecture.com/) I recently read:

> *The first law of software architecture states that “Everything in software architecture is a tradeoff*
> 

Monads won’t solve every problem you have, neither in performance nor reliability. On top of that, it will increase your project’s complexity and the onboarding of new coworkers to the project could be harder if they haven’t worked with monads before.

Although, I love their expressiveness and how declarative your code becomes. In applications with high utilization, implementing monads can help increasing performance.

It always depends on context, ***it always depends.***

As my friend Said likes to say: ***choose your poison.***

---

### 👋🏻 See you folks!