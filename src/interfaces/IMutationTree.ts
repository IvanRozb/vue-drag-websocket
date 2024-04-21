import type { Mutation } from 'vuex'

export interface IMutationTree<S> {
  [key: string]: Mutation<S>
}
