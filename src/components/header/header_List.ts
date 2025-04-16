import { WebPage, Moon, GithubOne, Browser } from '@icon-park/vue-next'

interface Imenus {
  name: string;
  iconLight?: any;
  iconNight?: any;
  key?: string;
}
export function useMenu() {
  const menus: Imenus[] = [
    {
      name: '即兴网页',
      iconLight: WebPage,
      iconNight: Browser,
      key: 'discover'
    },

  ]
  const menus2: Imenus[] = [
    {
      name: 'github',
      icon: GithubOne,
      key: ''
    },
    {
      name: '黑夜模式',
      icon: Moon
    }
  ]
  return { menus, menus2 }
}