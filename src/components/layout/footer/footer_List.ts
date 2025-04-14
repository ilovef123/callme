import { ref, computed } from 'vue'

interface Contact {
  name: string;
  email: string;
  phone: string;
}

export function useContact() {
    const contacts = ref<Contact[]>([
        { name: '张三', email: 'zhangsan@example.com', phone: '123-456-7890' },
        { name: '李四', email: 'wangwu@example.com', phone: '098-765-4321' },
        { name: '王五', email: 'wangwu@example.com', phone: '111-222-3333' }
    ]);
    
    const technologies = ref<string[]>([
        'Vue', 'React', 'Flutter', 'Spring Boot', 'Tauri', 'Nuxt'
    ]);
    
    const currentYear = computed(() => new Date().getFullYear());

    return { contacts, technologies, currentYear };
}