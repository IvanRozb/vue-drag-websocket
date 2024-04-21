import type { Action } from 'vuex'

export interface IActionTree<S, R> {
  [key: string]: Action<S, R>
}
