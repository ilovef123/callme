export interface User {
    id: number
    name: string
    color: string
  }
  
  export interface Message {
    id: number
    sender: 'me' | 'other'
    content: string
  }