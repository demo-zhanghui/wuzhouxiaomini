<!--
  企业空间首页 - 完整功能版本
  核心特性：
  1. 紧凑型布局设计
  2. 高效信息展示
  3. 双场景市场切换
  4. 专业视觉风格
-->

<template>
  <div class="enterprise-home">
    <!-- 模块一：轮播Banner区 -->
    <div class="banner-section">
      <van-swipe :autoplay="3000" indicator-color="white" class="banner-swipe">
        <van-swipe-item v-for="banner in banners" :key="banner.id">
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

    <!-- 模块二：核心功能入口区 -->
    <div class="function-section">
      <van-grid :column-num="3" :border="false" class="function-grid">
        <van-grid-item v-for="item in functionItems" :key="item.id" @click="handleFunctionClick(item)">
          <div class="function-item">
            <van-icon :name="item.icon" size="24" class="function-icon" />
            <div class="function-title">{{ item.title }}</div>
            <div class="function-subtitle">{{ item.subtitle }}</div>
          </div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 模块三：超级市场模块 -->
    <div class="market-section">
      <!-- 并排式切换标题区 -->
      <div class="market-header">
        <div class="market-title">
          {{ activeMarket === 'source' ? '推荐运单' : '推荐运力' }}
        </div>
        <div class="market-switcher">
          <van-button 
            size="small" 
            round 
            :type="activeMarket === 'source' ? 'primary' : 'default'"
            @click="switchMarket('source')"
          >
            找货源
          </van-button>
          <van-button 
            size="small" 
            round 
            :type="activeMarket === 'carrier' ? 'primary' : 'default'"
            @click="switchMarket('carrier')"
          >
            找运力
          </van-button>
        </div>
      </div>

      <!-- 二级筛选器 -->
      <div class="filter-section">
        <div v-if="activeMarket === 'source'" class="source-filter">
          <van-tag type="primary" size="medium">智能模式</van-tag>
          <van-tag type="default" size="medium">价格优先</van-tag>
          <van-tag type="default" size="medium">时效优先</van-tag>
        </div>
        <div v-else class="carrier-filter">
          <van-tag type="primary" size="medium">平台推荐</van-tag>
          <van-tag type="default" size="medium">评分优先</van-tag>
          <van-tag type="default" size="medium">距离优先</van-tag>
        </div>
      </div>

      <!-- 条件化渲染区 -->
      <div class="market-content">
        <!-- 找货源：货物信息卡片列表 -->
        <div v-if="activeMarket === 'source'" class="source-list">
          <div 
            v-for="order in recommendedOrders" 
            :key="order.id"
            class="source-card"
            @click="handleSourceClick(order)"
          >
            <div class="source-header">
              <div class="source-route">{{ order.route }}</div>
              <div class="source-price">{{ order.price }}</div>
            </div>
            <div class="source-details">
              <div class="detail-item">
                <span class="detail-label">货物类型：</span>
                <span class="detail-value">{{ order.cargoType }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">重量：</span>
                <span class="detail-value">{{ order.weight }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">发车时间：</span>
                <span class="detail-value">{{ order.departureTime }}</span>
              </div>
            </div>
            <div class="source-actions">
              <van-button size="small" type="primary">立即接单</van-button>
            </div>
          </div>
        </div>

        <!-- 找运力：承运企业卡片列表 -->
        <div v-else class="carrier-list">
          <div 
            v-for="carrier in recommendedCarriers" 
            :key="carrier.id"
            class="carrier-card"
            @click="handleCarrierClick(carrier)"
          >
            <div class="carrier-header">
              <div class="carrier-info">
                <div class="carrier-name">{{ carrier.name }}</div>
                <div class="carrier-rating">
                  <div class="rating-stars">
                    <van-icon 
                      v-for="star in 5" 
                      :key="star"
                      :name="star <= carrier.rating ? 'star' : 'star-o'"
                      :color="star <= carrier.rating ? '#ffd700' : '#c8c9cc'"
                      size="12"
                    />
                  </div>
                  <span class="rating-text">{{ carrier.rating }}分</span>
                </div>
              </div>
              <div class="carrier-status">
                <van-tag :type="carrier.status === 'online' ? 'success' : 'default'" size="small">
                  {{ carrier.status === 'online' ? '在线' : '离线' }}
                </van-tag>
              </div>
            </div>
            
            <div class="carrier-details">
              <div class="detail-item">
                <span class="detail-label">车辆类型：</span>
                <span class="detail-value">{{ carrier.vehicleType }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">载重量：</span>
                <span class="detail-value">{{ carrier.capacity }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">当前位置：</span>
                <span class="detail-value">{{ carrier.location }}</span>
              </div>
            </div>
            
            <!-- 隔离容器：企业信息区 -->
            <div class="carrier-enterprise">
              <div class="enterprise-info">
                <div class="enterprise-name">{{ carrier.enterpriseName }}</div>
                <div class="enterprise-meta">
                  <span class="meta-item">{{ carrier.enterpriseType }}</span>
                  <span class="meta-item">{{ carrier.enterpriseScale }}</span>
                </div>
              </div>
              <div class="enterprise-actions">
                <van-button size="small" type="primary">联系企业</van-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块四：平台资讯 -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'

// 响应式数据
const activeMarket = ref('source') // 默认显示找货源

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

// 核心功能入口数据
const functionItems = ref([
  { 
    id: 1, 
    title: '找货源', 
    subtitle: '海量货源信息',
    icon: 'search' 
  },
  { 
    id: 2, 
    title: '发布运力', 
    subtitle: '快速发布运力',
    icon: 'add-o' 
  },
  { 
    id: 3, 
    title: '车务市场', 
    subtitle: '车辆管理服务',
    icon: 'logistics' 
  }
])

// 推荐运单数据（找货源）
const recommendedOrders = ref([
  {
    id: 1,
    route: '北京 → 上海',
    price: '￥3,500',
    cargoType: '电子产品',
    weight: '2.5吨',
    departureTime: '2024-01-16 发车'
  },
  {
    id: 2,
    route: '广州 → 深圳',
    price: '￥1,200',
    cargoType: '服装鞋帽',
    weight: '1.8吨',
    departureTime: '2024-01-16 发车'
  },
  {
    id: 3,
    route: '成都 → 重庆',
    price: '￥800',
    cargoType: '食品饮料',
    weight: '1.2吨',
    departureTime: '2024-01-17 发车'
  }
])

// 推荐运力数据（找运力）
const recommendedCarriers = ref([
  {
    id: 1,
    name: '张师傅',
    rating: 4.8,
    status: 'online',
    vehicleType: '厢式货车',
    capacity: '3吨',
    location: '北京市朝阳区',
    enterpriseName: '北京快运物流有限公司',
    enterpriseType: '物流企业',
    enterpriseScale: '100-499人'
  },
  {
    id: 2,
    name: '李师傅',
    rating: 4.6,
    status: 'online',
    vehicleType: '平板车',
    capacity: '5吨',
    location: '上海市浦东新区',
    enterpriseName: '上海通达运输集团',
    enterpriseType: '运输集团',
    enterpriseScale: '500-999人'
  },
  {
    id: 3,
    name: '王师傅',
    rating: 4.9,
    status: 'offline',
    vehicleType: '冷藏车',
    capacity: '2吨',
    location: '广州市天河区',
    enterpriseName: '广州冷链物流公司',
    enterpriseType: '专业物流',
    enterpriseScale: '50-99人'
  }
])

// 平台资讯数据
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

// 事件处理函数
const switchMarket = (market) => {
  activeMarket.value = market
}

const handleBannerClick = (banner) => {
  showToast(`点击Banner：${banner.title}`)
}

const handleFunctionClick = (item) => {
  showToast(`点击：${item.title}`)
}

const handleSourceClick = (order) => {
  showToast(`查看运单：${order.route}`)
}

const handleCarrierClick = (carrier) => {
  showToast(`查看运力：${carrier.name}`)
}

const handleMoreNews = () => {
  showToast('查看更多资讯')
}

const handleNewsClick = (news) => {
  showToast(`查看资讯：${news.title}`)
}

onMounted(() => {
  console.log('企业首页已加载')
})
</script>

<style scoped>
/* 全局样式 */
.enterprise-home {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 80px; /* 为底部导航栏留出空间 */
}

/* 模块一：轮播Banner区 */
.banner-section {
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-swipe {
  border-radius: 8px;
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

/* 模块二：核心功能入口区 */
.function-section {
  margin: 0 16px 16px;
}

.function-grid {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.function-icon {
  color: #1989fa;
  margin-bottom: 8px;
}

.function-title {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.function-subtitle {
  font-size: 11px;
  color: #969799;
  text-align: center;
}

/* 模块三：超级市场模块 */
.market-section {
  background: white;
  margin: 0 16px 16px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.market-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.market-switcher {
  display: flex;
  gap: 8px;
}

.filter-section {
  margin-bottom: 16px;
}

.source-filter,
.carrier-filter {
  display: flex;
  gap: 8px;
}

/* 找货源：货物信息卡片 */
.source-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-card {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.source-card:hover {
  border-color: #1989fa;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.source-route {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
}

.source-price {
  font-size: 16px;
  font-weight: 600;
  color: #ee0a24;
}

.source-details {
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

.source-actions {
  display: flex;
  justify-content: flex-end;
}

/* 找运力：承运企业卡片 */
.carrier-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.carrier-card {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.carrier-card:hover {
  border-color: #1989fa;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
}

.carrier-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.carrier-info {
  flex: 1;
}

.carrier-name {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.carrier-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.rating-text {
  font-size: 12px;
  color: #646566;
}

.carrier-details {
  margin-bottom: 12px;
}

/* 隔离容器：企业信息区 */
.carrier-enterprise {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 6px;
  border: 1px solid #ebedf0;
}

.enterprise-info {
  flex: 1;
}

.enterprise-name {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.enterprise-meta {
  display: flex;
  gap: 8px;
}

.meta-item {
  font-size: 11px;
  color: #969799;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ebedf0;
}

.enterprise-actions {
  flex-shrink: 0;
}

/* 模块四：平台资讯 */
.news-section {
  background: white;
  margin: 0 16px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
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

/* 响应式设计 */
@media (max-width: 375px) {
  .enterprise-home {
    padding-bottom: 70px;
  }
  
  .banner-section,
  .function-section,
  .market-section,
  .news-section {
    margin-left: 12px;
    margin-right: 12px;
  }
}
</style>

