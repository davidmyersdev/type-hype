import type * as Types from './types'

/**
 * A utility for building "pipeline" functions that pass a value through a series of functions to produce a result.
 *
 * @example
 * ```
 * const numberToString = (number: number) => number.toString()
 * const stringLength = (string: string) => string.length
 * const numberOfDigits = pipeline(numberToString, stringLength)
 *
 * numberOfDigits(123) // 3
 * ```
 *
 * @param fns A chain of functions whose return type must match the subsequent function's argument type.
 * @returns A function that accepts a single input (the argument of the first function) and returns a single output (the type of the last function's return value).
 */
export const pipeline = <T extends readonly Types.ChainableFn[]>(...fns: Types.FnChain<T>) => {
  return <I extends Types.FnChainInput<Types.FnChain<T>>>(input: I) => {
    return fns.reduce((result, fn) => {
      return fn(result)
    }, input) as Types.FnChainOutput<Types.ReplaceFnChainInput<Types.FnChain<T>, I>>
  }
}
