import { ref, computed } from 'vue'

export interface Contact {
  id: number
  name: string
  color: string
  remark?: string
  phone?: string
}

export const contacts = ref<Contact[]>([
  { id: 1, name: 'Tea', color: '#ff7675', remark: '同事', phone: '1234567890' },
  { id: 2, name: 'Gai', color: '#74b9ff', remark: '朋友', phone: '2345678901' },
  { id: 3, name: 'Zeng', color: '#55efc4' },
  { id: 4, name: 'Chen', color: '#a29bfe' },
  { id: 5, name: 'JJJ', color: '#fab1a0' }
])

export const contactsSearch = ref('')
export const selectedUser = ref<Contact | null>(contacts.value[0])

export const filteredContacts = computed(() => {
  if (!contactsSearch.value) return contacts.value
  return contacts.value.filter(c =>
    c.name.includes(contactsSearch.value) ||
    (c.remark && c.remark.includes(contactsSearch.value)) ||
    (c.phone && c.phone.includes(contactsSearch.value))
  )
})

export function highlight(name: string) {
  if (!contactsSearch.value) return name
  return name.replace(
    new RegExp(contactsSearch.value, 'gi'),
    (match) => `<span style="color:#409eff;font-weight:bold">${match}</span>`
  )
}

export function selectUser(contact: Contact) {
  selectedUser.value = contact
}

// 添加联系人弹窗逻辑
export const addModalVisible = ref(false)
export const addForm = ref({ name: '', remark: '', phone: '' })

export function addContact() {
  if (!addForm.value.name.trim()) return
  contacts.value.push({
    id: Date.now(),
    name: addForm.value.name,
    color: randomColor(),
    remark: addForm.value.remark,
    phone: addForm.value.phone
  })
  addModalVisible.value = false
  addForm.value = { name: '', remark: '', phone: '' }
}

export function onAddKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') addContact()
}

function randomColor() {
  const colors = ['#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#fab1a0', '#fdcb6e']
  return colors[Math.floor(Math.random() * colors.length)]
}