<template>
  <div class="enterprise-todo">
    <van-nav-bar title="待办" fixed placeholder />

    <div class="page-content">
      <div class="controls-card">
        <div class="controls-section search">
          <van-search
            v-model="searchValue"
            placeholder="请输入待办名称、内容、发起人"
            shape="round"
            clearable
            @search="onSearch"
          />
        </div>

        <div class="controls-section tabs">
          <van-tabs v-model:active="activeTab">
            <van-tab :title="'待办(' + pendingCount + ')'" name="pending" />
            <van-tab title="抄送" name="cc" />
            <van-tab title="已办" name="done" />
            <van-tab title="已发起" name="initiated" />
          </van-tabs>
        </div>

        <div class="controls-section secondary">
          <div class="secondary-bar">
            <div class="secondary-left">
              <van-dropdown-menu>
                <van-dropdown-item v-model="filterValue" :options="filterOptions" />
              </van-dropdown-menu>
            </div>
            <div class="secondary-right">
              <van-dropdown-menu>
                <van-dropdown-item v-model="sortValue" :options="sortOptions" />
              </van-dropdown-menu>
              <van-icon name="filter-o" size="18" color="#969799" class="filter-icon" />
            </div>
          </div>
        </div>
      </div>

      <div class="list-wrapper">
        <van-list
          v-if="displayedItems.length > 0"
          v-model:loading="listLoading"
          :finished="listFinished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in displayedItems" :key="item.id" class="todo-card">
            <div class="todo-card__header">
              <div class="todo-card__title">{{ item.title }}</div>
              <van-tag :type="item.statusType" size="medium">{{ item.status }}</van-tag>
            </div>
            <div class="todo-card__body">
              <div class="kv">
                <span class="label">发起人:</span>
                <span class="value">{{ item.initiator }}</span>
              </div>
              <div class="kv">
                <span class="label">所属车队:</span>
                <span class="value">{{ item.department }}</span>
              </div>
              <div class="kv">
                <span class="label">提交时间:</span>
                <span class="value">{{ item.submissionTime }}</span>
              </div>
            </div>
            <div class="todo-card__footer">
              <div class="initiator">
                <van-image :src="item.avatar" width="28" height="28" round />
                <div class="initiator__meta">
                  <div class="name">{{ item.initiator }}</div>
                  <div class="time">{{ item.submissionTime }}</div>
                </div>
              </div>
              <div class="actions">
                <van-button
                  v-for="action in item.actions"
                  :key="action"
                  size="small"
                  :type="buttonType(action)"
                  :plain="plainType(action)"
                  class="action-btn"
                  @click.stop="handleAction(item, action)"
                >
                  {{ action }}
                </van-button>
              </div>
            </div>
          </div>
        </van-list>
        <van-empty v-else image="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" description="暂无内容" />
      </div>
    </div>

    <div class="fab" @click="handleCreate">
      <span class="fab__text">发起</span>
      <van-tag round type="danger" size="mini" class="fab__badge">NEW</van-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'

// 搜索与Tab
const searchValue = ref('')
const activeTab = ref('pending')

// 二级筛选/排序
const filterValue = ref('all')
const filterOptions = [
  { text: '全部', value: 'all' },
  { text: '仅待处理', value: 'pending' },
  { text: '处理中', value: 'processing' }
]
const sortValue = ref('latest')
const sortOptions = [
  { text: '最新到达优先', value: 'latest' },
  { text: '最早到达优先', value: 'earliest' }
]

// 模拟的待办事项列表数据（运输业务场景）
const todoItems = ref([
  {
    id: 'TODO001',
    title: '运单TS20250821异常审核',
    status: '待处理',
    statusType: 'primary', // van-tag的type
    initiator: '司机张三',
    department: '华东一区车队',
    submissionTime: '2025-08-22 10:30:15',
    actions: ['拒绝', '同意'],
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 'TODO002',
    title: '上海-苏州线路运费调整申请',
    status: '待处理',
    statusType: 'primary',
    initiator: '调度王五',
    department: '调度中心',
    submissionTime: '2025-08-22 09:15:40',
    actions: ['驳回', '通过'],
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 'TODO003',
    title: '司机李四的ETC费用补录申请',
    status: '处理中',
    statusType: 'warning',
    initiator: '司机李四',
    department: '华北二区车队',
    submissionTime: '2025-08-21 18:00:05',
    actions: ['查看详情'],
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 'TODO004',
    title: '超时罚款申诉（运单TS20250820）',
    status: '待处理',
    statusType: 'primary',
    initiator: '船东赵六',
    department: '远洋运输部',
    submissionTime: '2025-08-20 15:45:22',
    actions: ['拒绝', '同意'],
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
])

// 其他Tab静态占位
const ccItems = ref([])
const doneItems = ref([])
const initiatedItems = ref([])

// 顶部Tab计数（按需求示例固定显示）
const pendingCount = ref(82)

// 列表加载状态（演示用）
const listLoading = ref(false)
const listFinished = ref(true)

// 组合筛选、搜索与排序
const displayedItems = computed(() => {
  let items = []
  if (activeTab.value === 'pending') items = todoItems.value
  if (activeTab.value === 'cc') items = ccItems.value
  if (activeTab.value === 'done') items = doneItems.value
  if (activeTab.value === 'initiated') items = initiatedItems.value

  if (searchValue.value) {
    const k = searchValue.value.trim()
    const keys = ['title', 'initiator', 'department', 'status']
    items = items.filter(it => keys.some(key => String(it[key] || '').includes(k)))
  }
  if (filterValue.value === 'pending') items = items.filter(it => it.status === '待处理')
  if (filterValue.value === 'processing') items = items.filter(it => it.status === '处理中')

  const toTime = (s) => new Date(s).getTime()
  if (sortValue.value === 'latest') items = [...items].sort((a, b) => toTime(b.submissionTime) - toTime(a.submissionTime))
  if (sortValue.value === 'earliest') items = [...items].sort((a, b) => toTime(a.submissionTime) - toTime(b.submissionTime))
  return items
})

const onLoad = () => {
  // 演示：立即结束加载
  listLoading.value = false
  listFinished.value = true
}

const onSearch = () => {}
const handleAction = (item, action) => {
  showToast(`${action}：${item.title}`)
}
const handleCreate = () => {
  showToast('发起新审批')
}
const buttonType = (action) => {
  if (action === '同意' || action === '通过' || action === '查看详情') return 'primary'
  if (action === '拒绝' || action === '驳回') return 'danger'
  return 'default'
}
const plainType = (action) => {
  if (action === '拒绝' || action === '驳回') return true
  return false
}
</script>

<style scoped>
.enterprise-todo {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.page-content {
  padding: 12px;
  padding-bottom: 80px;
}
.controls-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 6px 8px 10px;
  margin-bottom: 12px;
}
.controls-section + .controls-section { margin-top: 6px; }
.controls-section.tabs :deep(.van-tabs__wrap) { box-shadow: none; }
.controls-section.tabs :deep(.van-tabs__nav--card) { margin: 0 6px; }

.secondary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.secondary-left,
.secondary-right {
  display: flex;
  align-items: center;
}
.secondary-left { flex: 1; }
.secondary-right { gap: 8px; }

.secondary-bar :deep(.van-dropdown-menu) { width: auto; box-shadow: none; }
.secondary-left :deep(.van-dropdown-menu) { width: 100%; }
.secondary-bar :deep(.van-dropdown-menu__bar) { box-shadow: none; }
.filter-icon { margin-left: 4px; }

.list-wrapper { }

.todo-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin-bottom: 12px;
}

.todo-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.todo-card__title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  line-height: 1.3;
  padding-right: 8px;
}

.todo-card__body .kv {
  display: flex;
  margin: 6px 0;
}
.todo-card__body .label {
  width: 72px;
  color: #969799;
  font-size: 12px;
}
.todo-card__body .value {
  flex: 1;
  color: #323233;
  font-size: 13px;
}

.todo-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.initiator {
  display: flex;
  align-items: center;
  gap: 8px;
}
.initiator__meta .name { font-size: 12px; color: #323233; }
.initiator__meta .time { font-size: 11px; color: #969799; }

.actions { display: flex; gap: 8px; }
.action-btn { border-radius: 16px; padding: 0 12px; }

.fab {
  position: fixed;
  right: 16px;
  bottom: 88px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1989fa;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(25, 137, 250, 0.3);
  z-index: 1000;
}
.fab__text { font-size: 14px; }
.fab__badge { position: absolute; top: -6px; right: -6px; }
</style>
