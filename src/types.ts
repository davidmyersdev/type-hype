/**
 * A non-generic function that accepts any number of arguments and returns any value.
 */
export type Fn = (...args: any[]) => any

/**
 * A generic identity function that takes an argument of type `T` and returns the same type.
 */
export type GenericIdentityFn = <T>(arg: T) => T

/**
 * A non-generic identity function that takes an argument of any type and returns the same type.
 */
export type NonGenericIdentityFn = (arg: any) => typeof arg

/**
 * An identity function that can be either generic or non-generic.
 */
export type IdentityFn = GenericIdentityFn | NonGenericIdentityFn

/**
 * Converts a function `T` to a generic function.
 * If the original function has exactly one parameter, returns a `ChainableGenericFn`.
 * Otherwise, returns a function that takes multiple arguments of the same type as the original function.
 */
export type ToGenericFn<T extends Fn> = HasOneParameter<T> extends true
  ? ChainableGenericFn<T>
  : <Args extends Parameters<T>>(...args: Args) => ReturnType<T>

/**
 * Converts a function `T` to a generic identity function.
 * The resulting function takes an argument of the same type as the original function's first parameter and returns the same type.
 */
export type ToGenericIdentityFn<T extends Fn> = <Arg extends Parameters<T>[0]>(arg: Arg) => Arg

export type Both<A extends boolean, B extends boolean> = A extends true ? B extends true ? true : false : false
export type Either<A extends boolean, B extends boolean> = A extends true ? true : B extends true ? true : false

export type Any<T extends readonly boolean[]> = T extends readonly [infer First, ...infer Rest extends readonly boolean[]]
  ? First extends true
    ? true
    : Any<Rest>
  : false
export type Or<T extends readonly boolean[]> = Any<T>

// Todo: Should an empty array return true or false?
export type All<T extends readonly boolean[]> = T extends readonly [infer First, ...infer Rest extends readonly boolean[]]
  ? First extends true
    ? And<Rest>
    : false
  : true
export type And<T extends readonly boolean[]> = All<T>
export type Not<T extends boolean> = T extends true ? false : true
export type Extends<A, B> = A extends B ? true : false
export type If<Condition, Then = true, Else = false> = Condition extends true ? Then : Else
export type ThenIf<Condition, Then = true, Else = false> = If<Condition, Then, Else>
export type ElseIf<Condition, Then = true, Else = false> = If<Condition, Then, Else>
export type Then<T> = T
export type Else<T> = T

export type IsGenericFn<T extends Fn> = Not<IsNonGenericFn<T>>
export type IsNonGenericFn<T extends Fn> = IsEqual<WithoutGenerics<T>, T>
export type IsFn<T> = Extends<T, Fn>
export type IsIdentityFnLike<T extends Fn> = IsEqual<Parameters<T>[0], ReturnType<T>>
export type IsGenericIdentityFn<T extends Fn> = All<[
  IsGenericFn<T>,
  IsIdentityFnLike<T>,
  Extends<T, ToGenericIdentityFn<T>>,
]>
export type IsNonGenericIdentityFn<T extends Fn> = All<[
  IsNonGenericFn<T>,
  IsIdentityFnLike<T>,
  Extends<T, NonGenericIdentityFn>,
]>

export type IsIdentityFn<T extends Fn> = Any<[
  IsGenericIdentityFn<T>,
  IsNonGenericIdentityFn<T>,
]>

export type GenericChainableFn = <Arg, ReturnValue>(arg: Arg) => ReturnValue
export type NonGenericChainableFn = (arg: any) => any
export type ChainableFn = GenericChainableFn | NonGenericChainableFn
export type IsGenericChainableFn<T> = T extends Fn ? T extends (<Arg extends Parameters<T>[0]>(arg: Arg) => ReturnType<T>) ? true : false : false

export type ReplaceIdentityArg<T extends IdentityFn, Replacement> = IsGenericIdentityFn<T> extends true ? <T extends Replacement>(arg: T) => T : (arg: Replacement) => Replacement
export type ReplaceArg<T extends ChainableFn, Replacement> =
  IsIdentityFn<T> extends true
    ? ReplaceIdentityArg<T, Replacement>
    : IsGenericChainableFn<T> extends true
      ? <Arg extends Replacement>(arg: Arg) => ReturnType<T>
      : (arg: Replacement) => ReturnType<T>

export type ChainableFnArg<T extends ChainableFn> = T extends (arg: infer Arg) => any ? Arg : never
export type ReplaceFirstInArray<T extends readonly any[], Replacement> = T extends [any, ...infer OtherEntries] ? [Replacement, ...OtherEntries] : T

export type FirstEntry<ListLike extends readonly any[]> = ListLike[0]
export type LastEntry<ListLike extends readonly any[]> = ListLike extends [...any[], infer Last] ? Last : ListLike[0]

export type FnChain<T extends readonly ChainableFn[]> = T extends { length: 1 }
  ? T
  : T extends readonly [infer First extends ChainableFn, infer Second extends ChainableFn, ...infer OtherChainableFns extends ChainableFn[]]
    ? ReturnType<First> extends ChainableFnArg<Second>
      ? IsGenericFn<Second> extends true
        ? [First, ...FnChain<[ReplaceArg<Second, ReturnType<First>>, ...OtherChainableFns]>]
        : [First, ...FnChain<[Second, ...OtherChainableFns]>]
      : [First, ...FnChain<[(prevFnOutput: ReturnType<First>) => unknown, ...OtherChainableFns]>]
    : never

export type ReplaceFnChainInput<T extends readonly ChainableFn[], Replacement> = FnChain<ReplaceFirstInArray<T, ReplaceArg<FirstEntry<T>, Replacement>>>

export type FnChainInput<T extends readonly ChainableFn[]> = ChainableFnArg<FirstEntry<T>>

export type FnChainOutput<T extends readonly ChainableFn[]> = T extends { length: 1 }
  ? ReturnType<T[0]>
  : T extends [infer First extends ChainableFn, infer Second extends ChainableFn, ...infer OtherChainableFns extends ChainableFn[]]
    ? ReturnType<First> extends ChainableFnArg<Second>
      ? IsGenericFn<Second> extends true
        ? FnChainOutput<[ReplaceArg<Second, ReturnType<First>>, ...OtherChainableFns]>
        : FnChainOutput<[Second, ...OtherChainableFns]>
      : never
    : never

// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
export type IsEqual<A, B> = (<V>() => V extends A ? 1 : 2) extends (<V>() => V extends B ? 1 : 2) ? true : false

export type HasOneParameter<T extends Fn> = HasParametersOfLength<T, 1>
export type HasParametersOfLength<T extends Fn, N extends number> = Parameters<T> extends { length: N } ? true : false
export type ChainableGenericFn<T extends Fn> = <Arg extends Parameters<T>[0]>(arg: Arg) => ReturnType<T>
export type WithoutGenerics<T extends Fn> = T extends (...args: infer Args) => infer ReturnValue ? (...args: Args) => ReturnValue : never
