import { ref } from 'vue';

export interface Moment {
  id: number;
  author: string;
  color: string;
  content: string;
  imgs?: string[];
  time: string;
}

export const moments = ref<Moment[]>([
  {
    id: 1,
    author: '小明',
    color: '#409eff',
    content: '今天心情不错！',
    imgs: [],
    time: '09:15'
  },
  {
    id: 2,
    author: '小红',
    color: '#4caf50',
    content: 'Vue3真的好用！',
    imgs: [],
    time: '昨天'
  },
  {
    id: 3,
    author: '我',
    color: '#2196f3',
    content: 'Vue3项目修红红恢复！',
    imgs: [],
    time: '刚刚'
  }
]);

export const addModalVisible = ref(false);

export const addForm = ref<{ content: string; imgs: string[] }>({
  content: '',
  imgs: []
});

// 处理图片上传
export function onImgChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  const imgArr: string[] = [];
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        imgArr.push(ev.target.result as string);
        // 只在全部图片加载后赋值，避免多次刷新
        if (imgArr.length === files.length) {
          addForm.value.imgs = imgArr;
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

// 发布动态
export function addMoment() {
  if (!addForm.value.content.trim() && addForm.value.imgs.length === 0) return;
  moments.value.unshift({
    id: Date.now(),
    author: '我',
    color: '#409eff',
    content: addForm.value.content,
    imgs: [...addForm.value.imgs],
    time: '刚刚'
  });
  addForm.value.content = '';
  addForm.value.imgs = [];
  addModalVisible.value = false;
}