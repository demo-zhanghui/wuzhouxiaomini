<template>
  <div class="enterprise-home">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <van-search
        v-model="searchValue"
        placeholder="搜索资讯、公告、货源、运力..."
        @search="handleSearch"
        @click="handleSearchClick"
      />
    </div>

    <!-- 轮播Banner区 -->
    <div class="banner-section">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" @click="handleBannerClick(banner)">
            <img :src="banner.image" :alt="banner.title" />
            <div class="banner-overlay">
              <h3>{{ banner.title }}</h3>
              <p>{{ banner.subtitle }}</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 金刚区/快捷入口 -->
    <div class="quick-access">
      <div class="section-title">快捷入口</div>
      <div class="access-grid">
        <div 
          v-for="item in quickAccess" 
          :key="item.id"
          class="access-item"
          @click="handleQuickAccess(item)"
        >
          <div class="access-icon">
            <van-icon :name="item.icon" size="24" />
          </div>
          <div class="access-text">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <!-- 平台资讯模块 -->
    <div class="news-section">
      <div class="section-header">
        <div class="section-title">平台资讯</div>
        <div class="more-btn" @click="handleMoreNews">更多</div>
      </div>
      <div class="news-list">
        <div 
          v-for="news in newsList" 
          :key="news.id"
          class="news-item"
          @click="handleNewsClick(news)"
        >
          <div class="news-content">
            <h4 class="news-title">{{ news.title }}</h4>
            <p class="news-summary">{{ news.summary }}</p>
            <div class="news-meta">
              <span class="news-time">{{ news.publishTime }}</span>
            </div>
          </div>
          <div class="news-thumb" v-if="news.thumbnail">
            <img :src="news.thumbnail" :alt="news.title" />
          </div>
        </div>
      </div>
    </div>

    <!-- 货源/运力广场模块 -->
    <div class="market-section">
      <div class="section-header">
        <div class="section-title">{{ marketTitle }}</div>
        <div class="more-btn" @click="handleMoreMarket">更多</div>
      </div>
      <div class="market-list">
        <div 
          v-for="item in marketList" 
          :key="item.id"
          class="market-item"
          @click="handleMarketClick(item)"
        >
          <div class="market-header">
            <div class="market-route">{{ item.route }}</div>
            <div class="market-price">{{ item.price }}</div>
          </div>
          <div class="market-details">
            <div class="detail-item">
              <span class="detail-label">{{ item.typeLabel }}：</span>
              <span class="detail-value">{{ item.typeValue }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">时间：</span>
              <span class="detail-value">{{ item.time }}</span>
            </div>
          </div>
          <div class="market-actions">
            <van-button size="small" type="primary">{{ item.actionText }}</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { store } from '@/store'

// 响应式数据
const searchValue = ref('')

// 轮播Banner数据
const banners = ref([
  {
    id: 1,
    title: '新政策解读',
    subtitle: '交通运输部最新政策发布',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    title: '平台优化升级',
    subtitle: '全新企业工作台正式上线',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 3,
    title: '春节活动',
    subtitle: '新春运输保障专项活动',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
])

// 快捷入口数据
const quickAccess = ref([
  { id: 1, title: '发布货源', icon: 'add-o' },
  { id: 2, title: '运单管理', icon: 'orders-o' },
  { id: 3, title: '调度派车', icon: 'logistics' },
  { id: 4, title: '财务结算', icon: 'balance-list-o' },
  { id: 5, title: '数据报表', icon: 'bar-chart-o' }
])

// 资讯列表数据
const newsList = ref([
  {
    id: 1,
    title: '交通运输部发布春运保障新措施',
    summary: '针对春运期间运力保障，交通运输部发布了一系列新的保障措施...',
    publishTime: '2024-01-15 10:30',
    thumbnail: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    title: '平台企业工作台功能全面升级',
    summary: '新增企业数据看板、智能调度等核心功能，助力企业数字化转型...',
    publishTime: '2024-01-14 16:20'
  },
  {
    id: 3,
    title: '绿色物流发展趋势报告',
    summary: '2024年绿色物流发展呈现新趋势，新能源车辆使用率持续提升...',
    publishTime: '2024-01-13 09:15',
    thumbnail: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
])

// 市场数据（根据角色动态显示）
const marketList = ref([
  {
    id: 1,
    route: '北京 → 上海',
    price: '￥3,500',
    typeLabel: '货物类型',
    typeValue: '电子产品',
    time: '2024-01-16 发车',
    actionText: '查看详情'
  },
  {
    id: 2,
    route: '广州 → 深圳',
    price: '￥1,200',
    typeLabel: '车辆要求',
    typeValue: '厢式货车',
    time: '2024-01-16 发车',
    actionText: '立即接单'
  },
  {
    id: 3,
    route: '成都 → 重庆',
    price: '￥800',
    typeLabel: '货物类型',
    typeValue: '食品饮料',
    time: '2024-01-17 发车',
    actionText: '查看详情'
  }
])

// 计算属性 - 市场模块标题
const marketTitle = computed(() => {
  return store.currentWorkspace === 'enterprise' ? '货源广场' : '运力推荐'
})

// 事件处理函数
const handleSearch = (value) => {
  showToast(`搜索：${value}`)
}

const handleSearchClick = () => {
  showToast('跳转到搜索页面')
}

const handleBannerClick = (banner) => {
  showToast(`点击Banner：${banner.title}`)
}

const handleQuickAccess = (item) => {
  showToast(`点击：${item.title}`)
}

const handleMoreNews = () => {
  showToast('查看更多资讯')
}

const handleNewsClick = (news) => {
  showToast(`查看资讯：${news.title}`)
}

const handleMoreMarket = () => {
  showToast('查看更多市场信息')
}

const handleMarketClick = (item) => {
  showToast(`查看详情：${item.route}`)
}

onMounted(() => {
  console.log('企业首页已加载')
})
</script>

<style scoped>
.enterprise-home {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.search-header {
  background: white;
  padding: 12px 16px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.banner-section {
  margin: 12px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-item {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px 16px 12px;
}

.banner-overlay h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.banner-overlay p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.quick-access {
  background: white;
  margin: 12px 16px;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.access-icon {
  width: 44px;
  height: 44px;
  background: #f0f8ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #1989fa;
}

.access-text {
  font-size: 12px;
  color: #646566;
  text-align: center;
}

.news-section, .market-section {
  background: white;
  margin: 12px 16px;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.more-btn {
  font-size: 13px;
  color: #1989fa;
  cursor: pointer;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.news-item:last-child {
  border-bottom: none;
}

.news-content {
  flex: 1;
}

.news-title {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.news-summary {
  font-size: 13px;
  color: #969799;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  align-items: center;
}

.news-time {
  font-size: 12px;
  color: #c8c9cc;
}

.news-thumb {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.market-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.market-item {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.market-item:hover {
  border-color: #1989fa;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.market-route {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.market-price {
  font-size: 16px;
  font-weight: 600;
  color: #ee0a24;
}

.market-details {
  margin-bottom: 12px;
}

.detail-item {
  font-size: 13px;
  color: #646566;
  margin-bottom: 4px;
}

.detail-label {
  color: #969799;
}

.detail-value {
  color: #323233;
}

.market-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
