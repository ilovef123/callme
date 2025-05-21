import { ref } from 'vue';
import axios from 'axios';

export interface Moment {
  id: string;
  author: string;
  color: string;
  content: string;
  imgs?: string[];
  time: string;
  carouselIndex?: number; // 用于轮播的当前索引
}

export const moments = ref<Moment[]>([]);

const user = JSON.parse(localStorage.getItem('user') || '{}');


export const addModalVisible = ref(false);

// 轮播索引
const carouselIndex = ref(0);

const addForm = ref<{ content: string; imgs: string[] }>({
  content: '',
  imgs: []
});

function onImgChange(e: Event) {
  carouselIndex.value = 0; // 新选图片后重置轮播
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

// 轮播切换方法
function carouselPrev() {
  if (!addForm.value.imgs.length) return;
  carouselIndex.value = (carouselIndex.value - 1 + addForm.value.imgs.length) % addForm.value.imgs.length;
}
function carouselNext() {
  if (!addForm.value.imgs.length) return;
  carouselIndex.value = (carouselIndex.value + 1) % addForm.value.imgs.length;
}
function carouselGo(idx: number) {
  if (!addForm.value.imgs.length) return;
  carouselIndex.value = idx;
}

// 发布动态（后端）
async function addMoment() {
  // 如果内容为空但有图片，自动填充一个空格，避免后端 required 校验失败
  if (!addForm.value.content.trim() && addForm.value.imgs.length > 0) {
    addForm.value.content = ' ';
  }
  if (!addForm.value.content.trim() && addForm.value.imgs.length === 0) return;
  await axios.post('/api/moment/add', {
    userId: user._id,
    content: addForm.value.content,
    images: addForm.value.imgs
  });
  addForm.value.content = '';
  addForm.value.imgs = [];
  addModalVisible.value = false;
  await fetchMoments();
}

function removeImg(idx: number) {
  addForm.value.imgs.splice(idx, 1);
}

function carouselTrackStyle(moment: any, idx: number) {
  const active = (moment.carouselIndex || 0) === idx;
  return {
    transition: 'transform 0.45s cubic-bezier(.23,1,.32,1)',
    transform: `translateX(${((idx - (moment.carouselIndex || 0)) * 100)}%)`,
    position: 'absolute' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: active ? 1 : 0,
    zIndex: active ? 2 : 1
  };
}

export { addForm, addMoment, onImgChange, carouselIndex, carouselPrev, carouselNext, carouselGo, removeImg, carouselTrackStyle };



// 拉取朋友圈
export async function fetchMoments() {
  const res = await axios.get('/api/moment/list');
  moments.value = (res.data || []).map((item: any) => ({
    id: item._id,
    author: item.username || item.userId || '', // 优先显示username
    color: '#409eff',
    content: item.content,
    imgs: item.images || [],
    time: formatTime(item.createdAt),
    avatar: item.avatar || (item.user && item.user.avatar) || '', // 只兜底为后端聚合的用户信息
    username: item.username || (item.user && item.user.username) || '',
    userId: item.userId || (item.user && item.user._id) || ''
  }));
}

export function formatTime(time: string) {
  const d = new Date(time);
  return d.toLocaleString();
}
