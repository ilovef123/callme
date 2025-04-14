import { WebPage, Moon, GithubOne } from '@icon-park/vue-next'

interface Imenus {
  name: string;
  icon?: any;
}
export function useMenu() {
  const menus: Imenus[] = [
    {
      name: '即兴网页',
      icon: WebPage
    },
    {
      name: '黑夜模式',
      icon: Moon
    },
    {
      name: 'github',
      icon: GithubOne
    }
  ]
  return { menus }
}