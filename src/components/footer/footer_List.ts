import { ref, computed } from 'vue'

interface Contact {
  name: string;
  email: string;
  phone: string;
}

export function useContact() {
    const contacts = ref<Contact[]>([
        { name: '曾炜彬', email: '19875160797@163.com', phone: '198-7516-0797' },
        { name: '陈海军', email: '17820597112@163.com', phone: '178-2059-7112' },
        { name: '钟锦骏', email: '1906274873@qq.com', phone: '130-4428-2771' },
        { name: '赖杜铭', email: '3310459209@qq.com', phone: '147-4974-6970' }
    ]);
    
    const technologies = ref<string[]>([
        'Vue', 'Element', 'Scss', 'TypeScript'
    ]);
    
    const currentYear = computed(() => new Date().getFullYear());

    return { contacts, technologies, currentYear };
}