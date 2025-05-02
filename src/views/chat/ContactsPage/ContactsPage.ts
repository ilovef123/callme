import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import eventBus from '@/eventBus'

export interface Contact {
  _id?: string
  id?: number
  username?: string // 后端返回
  name?: string     // 本地添加
  color?: string
  remark?: string
  iphone?: string   // 后端返回
  phone?: string    // 本地添加
}

// 好友数据
export const contacts = ref<Contact[]>([])
// 搜索框
export const contactsSearch = ref('')
// 当前选中
export const selectedUser = ref<Contact | null>(null)
// 添加弹窗
export const addModalVisible = ref(false)
// 添加表单
export const addForm = ref({ phone: '' })
// 添加提示
export const addMsg = ref('')

// 获取当前登录用户
const user = JSON.parse(localStorage.getItem('user') || '{}')

// 拉取好友（用 userId 查询！）
export async function fetchContacts() {
  try {
    const res = await axios.get('http://localhost:3001/api/friend/list', {
      params: { userId: user._id || user.userId }
    })
    contacts.value = res.data || []
    // 不自动选中任何联系人
    selectedUser.value = null
  } catch (e) {
    contacts.value = []
    selectedUser.value = null
  }
}

// 搜索过滤
export const filteredContacts = computed(() => {
  if (!contactsSearch.value) return contacts.value
  return contacts.value.filter(c =>
    (c.username && c.username.includes(contactsSearch.value)) ||
    (c.iphone && c.iphone.includes(contactsSearch.value)) ||
    (c.name && c.name.includes(contactsSearch.value)) ||
    (c.phone && c.phone.includes(contactsSearch.value))
  )
})

// 高亮
export function highlight(name: string) {
  if (!contactsSearch.value || !name) return name
  return name.replace(
    new RegExp(contactsSearch.value, 'gi'),
    (match) => `<span style="color:#409eff;font-weight:bold">${match}</span>`
  )
}

// 选中联系人
export function selectUser(contact: Contact) {
  selectedUser.value = contact
}

// 添加好友
export async function addContact() {
  addMsg.value = ''
  if (!/^1[3-9]\d{9}$/.test(addForm.value.phone)) {
    addMsg.value = '请输入有效的手机号'
    return
  }
  if (addForm.value.phone === user.iphone) {
    addMsg.value = '不能添加自己为好友'
    return
  }
  try {
    const res = await axios.post('http://localhost:3001/api/friend/add', {
      userId: user._id || user.userId, // 这里必须传 userId，后端才不会报错
      friendIphone: addForm.value.phone
    })
    addMsg.value = res.data.message
    if (res.data.success) {
      await fetchContacts()
      eventBus.emit('friend-added')
      addForm.value.phone = ''
      addModalVisible.value = false
    }
  } catch (e) {
    addMsg.value = '添加失败，请重试'
  }
}

// 回车添加
export function onAddKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') addContact()
}

// 监听 localStorage storage 事件，user 变化时自动刷新联系人
window.addEventListener('storage', (e) => {
  if (e.key === 'user') fetchContacts()
})
// 初始化拉取
onMounted(fetchContacts)