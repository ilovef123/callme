import { WebPage, GithubOne, Browser } from '@icon-park/vue-next'

export interface Imenus {
  name: string;
  key?: string;
}

export function useMenu() {
  const menus: Imenus[] = [
    {
      name: '即兴网页',
      key: 'discover',
    },
    {
      name: 'GitHub',
      key: 'github',
    },
    {
      name: '夜间模式',
      key: 'night',
    },
  ]
  return { menus }
}