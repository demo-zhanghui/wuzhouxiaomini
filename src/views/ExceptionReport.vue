<template>
  <div class="exception-page">
    <div class="topbar">
      <div class="title">异常报备</div>
      <div class="topbar-right">
        <van-icon name="ellipsis" class="icon" />
        <van-icon name="cross" class="icon" @click="goBack" />
      </div>
    </div>

    <van-tabs
      v-model:active="activeTab"
      sticky
      animated
      class="exception-tabs"
    >
      <van-tab title="全部" name="all" />
      <van-tab title="已上报" name="reported" />
      <van-tab title="已处理" name="processed" />
    </van-tabs>

    <div class="list-wrapper">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="exception-card"
      >
        <div class="card-header">
          <div class="route">{{ item.from }} → {{ item.to }}</div>
          <div :class="['status-badge', item.status]">
            {{ item.status === 'reported' ? '已上报' : '已处理' }}
          </div>
        </div>

        <div class="meta-tags">
          <span class="tag">{{ item.cargo }}</span>
          <span class="tag">{{ item.weight }}</span>
        </div>

        <ul class="company-list">
          <li v-for="(company, idx) in item.companies" :key="idx">
            {{ company }}
          </li>
        </ul>

        <div class="event-row">
          <van-icon name="location" class="loc-icon" />
          <span class="event-title">{{ item.event }}</span>
          <span class="event-time">{{ item.time }}</span>
        </div>
        <div class="address">{{ item.address }}</div>

        <div v-if="item.status === 'processed'" class="handle-card">
          <span class="dot blue"></span>
          <span class="handle-text">处理：{{ item.handle || '已修正' }}</span>
        </div>
      </div>

      <div v-if="filteredList.length === 0" class="empty-state">
        暂无相关异常
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()

const activeTab = ref('all')

const exceptionList = ref([
  {
    id: '1',
    from: '福建福州',
    to: '浙江宁波',
    cargo: '煤炭',
    weight: '40吨',
    companies: ['衢州宝红建材有限公司', '浙江宝红商品砼有限公司'],
    event: '发生事故',
    time: '2022-05-06 19:29:20',
    address: '福州市台江区台江万达左侧102号公路',
    status: 'reported'
  },
  {
    id: '2',
    from: '福建福州',
    to: '浙江宁波',
    cargo: '煤炭',
    weight: '40吨',
    companies: ['衢州宝红建材有限公司', '浙江宝红商品砼有限公司'],
    event: '发生事故',
    time: '2022-05-06 19:29:20',
    address: '福州市台江区台江万达左侧102号公路',
    status: 'processed',
    handle: '已修正'
  }
])

const filteredList = computed(() => {
  if (activeTab.value === 'all') return exceptionList.value
  if (activeTab.value === 'reported') {
    return exceptionList.value.filter(i => i.status === 'reported')
  }
  return exceptionList.value.filter(i => i.status === 'processed')
})
</script>

<style scoped>
.exception-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef3fb 0%, #ffffff 120px);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 6px;
  background: transparent;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.topbar-right .icon {
  margin-left: 10px;
  font-size: 18px;
}

.exception-tabs :deep(.van-tabs__wrap) {
  background: transparent;
}

.list-wrapper {
  padding-bottom: 12px;
}

.exception-card {
  background: #fff;
  border-radius: 12px;
  margin: 12px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.route {
  font-size: 16px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.status-badge.reported {
  background: #eef6ff;
  color: #2b6de5;
}

.status-badge.processed {
  background: #eceff3;
  color: #6b7785;
}

.meta-tags {
  margin-top: 8px;
}

.tag {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  background: #f2f7ff;
  color: #2b6de5;
  margin-right: 8px;
}

.company-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}

.company-list li {
  position: relative;
  padding-left: 14px;
  line-height: 20px;
  color: #3d3d3d;
}

.company-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 8px;
  width: 6px;
  height: 6px;
  background: #38b169;
  border-radius: 50%;
}

.event-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.loc-icon {
  color: #2b6de5;
  margin-right: 6px;
}

.event-title {
  flex: 1;
  margin-left: 6px;
}

.event-time {
  color: #7a7a7a;
  font-size: 12px;
}

.address {
  margin-top: 6px;
  color: #7a7a7a;
  font-size: 12px;
}

.handle-card {
  display: inline-flex;
  align-items: center;
  margin-top: 12px;
  background: #f3f5f8;
  border-radius: 10px;
  padding: 8px 10px;
}

.dot.blue {
  width: 8px;
  height: 8px;
  background: #2b6de5;
  border-radius: 50%;
  margin-right: 8px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>