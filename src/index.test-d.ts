import type * as Types from './index'

const Assert = <A, _B extends A>() => {}

type TestNonGenericFn = (arg: string) => number
type TestNonGenericIdentityFn = (arg: string) => typeof arg
type TestGenericFn = <T extends number>(arg: T) => number
type TestGenericIdentityFn = <T extends Response>(arg: T) => T

Assert<Types.IsEqual<Types.ChainableGenericFn<TestGenericFn>, TestGenericFn>, true>
Assert<Types.IsEqual<Types.ChainableGenericFn<TestNonGenericFn>, TestNonGenericFn>, false>
Assert<Types.IsEqual<Types.ToGenericFn<TestGenericFn>, TestGenericFn>, true>
Assert<Types.IsEqual<Types.ToGenericFn<TestNonGenericFn>, TestNonGenericFn>, false>
Assert<Types.IsEqual<1, 1>, true>
Assert<Types.IsEqual<1, 2>, false>
Assert<Types.IsEqual<2, 1>, false>
Assert<Types.IsEqual<1, number>, false>
Assert<Types.IsEqual<number, 1>, false>

Assert<Types.IsIdentityFnLike<TestGenericFn>, true>
Assert<Types.IsIdentityFnLike<TestNonGenericFn>, false>
Assert<Types.IsIdentityFnLike<(arg: boolean) => boolean>, true>
Assert<Types.IsIdentityFnLike<(arg: true) => boolean>, false>
Assert<Types.IsIdentityFnLike<(arg: boolean) => true>, false>

Assert<Types.IsGenericFn<TestGenericFn>, true>
Assert<Types.IsGenericFn<TestGenericIdentityFn>, true>
Assert<Types.IsGenericFn<TestNonGenericFn>, false>
Assert<Types.IsGenericFn<TestNonGenericIdentityFn>, false>

Assert<Types.IsGenericIdentityFn<TestGenericIdentityFn>, true>
Assert<Types.IsGenericIdentityFn<TestNonGenericIdentityFn>, false>
Assert<Types.IsGenericIdentityFn<TestGenericFn>, false>
Assert<Types.IsGenericIdentityFn<TestNonGenericFn>, false>

Assert<Types.IsIdentityFn<TestGenericIdentityFn>, true>
Assert<Types.IsIdentityFn<TestNonGenericIdentityFn>, true>
Assert<Types.IsIdentityFn<TestGenericFn>, false>
Assert<Types.IsIdentityFn<TestNonGenericFn>, false>

Assert<Types.IsNonGenericIdentityFn<TestGenericIdentityFn>, false>
Assert<Types.IsNonGenericIdentityFn<TestNonGenericIdentityFn>, true>
Assert<Types.IsNonGenericIdentityFn<TestGenericFn>, false>
Assert<Types.IsNonGenericIdentityFn<TestNonGenericFn>, false>

Assert<Types.IsEqual<Types.WithoutGenerics<(<T extends number>(arg: T) => number)>, (arg: number) => number>, true>
Assert<Types.IsEqual<Types.WithoutGenerics<(<T extends number>(arg: T) => number)>, <T extends number>(arg: T) => number>, false>
Assert<Types.IsEqual<Types.ToGenericFn<(arg: number) => number>, <T extends number>(arg: T) => number>, true>
Assert<Types.IsEqual<(arg: number) => number, <T extends number>(arg: T) => number>, false>

Assert<Types.All<[true, true, true, true, true, true]>, true>
Assert<Types.All<[true, true, true, true, true, false]>, false>
Assert<Types.All<[true, true, true, false, true, false]>, false>
Assert<Types.All<[true, true]>, true>
Assert<Types.All<[true, false]>, false>
Assert<Types.All<[false, true]>, false>
Assert<Types.All<[false, false]>, false>
Assert<Types.All<[boolean, true]>, false>
Assert<Types.All<[boolean, boolean]>, false>
Assert<Types.All<[true, boolean]>, false>
Assert<Types.All<[false, boolean]>, false>

Assert<Types.And<[true, true]>, true>
Assert<Types.And<[true, false]>, false>
Assert<Types.And<[false, true]>, false>
Assert<Types.And<[false, false]>, false>
Assert<Types.And<[boolean, true]>, false>
Assert<Types.And<[boolean, boolean]>, false>
Assert<Types.And<[true, boolean]>, false>
Assert<Types.And<[false, boolean]>, false>

Assert<Types.Any<[false, false, false, true]>, true>
Assert<Types.Any<[false, false, false, false]>, false>
Assert<Types.Any<[true, true, true]>, true>

Assert<Types.Or<[false, true]>, true>
Assert<Types.Or<[never, true]>, never>
Assert<Types.Or<[true, false]>, true>
