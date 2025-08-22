<template>
  <div class="enterprise-apps">
    <!-- 常用应用 -->
    <div class="favorite-section">
      <div class="section-header">
        <div class="title">常用应用</div>
        <div class="actions">
          <van-button size="mini" plain type="primary" @click="toggleEdit">
            {{ isEditing ? '完成' : '编辑' }}
          </van-button>
        </div>
      </div>

      <div class="favorite-grid">
        <van-grid :column-num="favColumnNum" :gutter="12">
          <van-grid-item
            v-for="fav in favoriteApps"
            :key="fav.id"
            @click="handleAppClick(fav)"
          >
            <div class="mini-card fav">
              <div class="mini-card__icon">
                <van-icon :name="fav.icon" size="26" />
              </div>
              <div class="mini-card__name">{{ fav.name }}</div>
              <div v-if="isEditing" class="remove-badge" @click.stop="removeFromFavorites(fav)">
                <van-icon name="minus" color="#fff" size="10" />
              </div>
            </div>
          </van-grid-item>

          <!-- 添加按钮 -->
          <van-grid-item @click="scrollToAll">
            <div class="mini-card add fav">
              <div class="mini-card__icon">
                <van-icon name="plus" color="#1989fa" size="22" />
              </div>
              <div class="mini-card__name add">添加</div>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>

    <!-- 全部应用 -->
    <div class="all-section" ref="allSectionRef">
      <div class="section-header">
        <div class="title">全部应用</div>
      </div>
      <div class="all-layout">
        <div class="sidebar-wrapper">
          <van-sidebar v-model="activeSidebar">
            <van-sidebar-item
              v-for="(group, idx) in allApps"
              :key="group.category"
              :title="group.category"
            />
          </van-sidebar>
        </div>
        <div class="content-wrapper">
          <div class="search-header">
            <van-search v-model="searchQuery" placeholder="搜索应用" shape="round" background="#f7f8fa" />
          </div>

          <div v-if="currentCategoryApps.length === 0" class="empty-state">
            <van-empty description="未找到相关应用" />
          </div>
          <div v-else class="apps-grid">
            <van-grid :column-num="2" :gutter="8">
              <van-grid-item
                v-for="app in currentCategoryApps"
                :key="app.id"
                :class="{ disabled: favoriteAppIds.includes(app.id) }"
                @click="addFromAll(app)"
              >
                <div class="mini-card" :class="{ disabled: favoriteAppIds.includes(app.id) }">
                  <div class="mini-card__icon">
                    <van-icon :name="app.icon" size="22" />
                  </div>
                  <div class="mini-card__name">{{ app.name }}</div>
                  <div class="status-badge">
                    <van-icon v-if="!favoriteAppIds.includes(app.id)" name="plus" color="#1989fa" size="14" />
                    <van-icon v-else name="success" color="#07c160" size="14" />
                  </div>
                </div>
              </van-grid-item>
            </van-grid>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { showToast } from 'vant'

// 编辑模式
const isEditing = ref(false)

// 常用应用列表（仅用户选择）
const favoriteApps = ref([
  // 初始常用来自新数据源（可为空或挑选几项）
  { id: 'app01', name: '企业基础信息', icon: 'wap-home-o' },
  { id: 'app04', name: '运单管理', icon: 'orders-o' }
])

// 全部应用数据（仅两个分类）
const allApps = ref([
  {
    category: '基础信息',
    apps: [
      { id: 'app01', name: '企业基础信息', icon: 'wap-home-o' },
      { id: 'app02', name: '车辆管理', icon: 'logistics' },
      { id: 'app03', name: '司机管理', icon: 'contact' }
    ]
  },
  {
    category: '运输管理',
    apps: [
      { id: 'app04', name: '运单管理', icon: 'orders-o' },
      { id: 'app05', name: '在途监控', icon: 'map-marked' },
      { id: 'app06', name: '货物追踪', icon: 'location-o' },
      { id: 'app07', name: '异常管理', icon: 'warning-o' },
      { id: 'app08', name: '运单复核', icon: 'passed' }
    ]
  }
])

// 仅返回常用应用的 ID 列表
const favoriteAppIds = computed(() => favoriteApps.value.map(a => a.id))

// 左侧分类导航状态
const activeSidebar = ref(0)

// 搜索
const searchQuery = ref('')
const currentCategoryApps = computed(() => {
  const group = allApps.value[activeSidebar.value]
  if (!group) return []
  const kw = searchQuery.value.trim().toLowerCase()
  const list = group.apps
  return kw ? list.filter(a => a.name.toLowerCase().includes(kw)) : list
})

// 滚动定位
const allSectionRef = ref(null)

// 交互
const toggleEdit = () => {
  isEditing.value = !isEditing.value
}
const removeFromFavorites = (app) => {
  favoriteApps.value = favoriteApps.value.filter(f => f.id !== app.id)
}
const addToFavorites = (app) => {
  if (!favoriteAppIds.value.includes(app.id)) {
    favoriteApps.value.push({ ...app })
    showToast('添加成功')
  }
}
const handleAppClick = (app) => {
  showToast(`打开应用：${app.name}`)
}
const addFromAll = (app) => {
  if (favoriteAppIds.value.includes(app.id)) return
  addToFavorites(app)
}
const scrollToAll = async () => {
  await nextTick()
  if (allSectionRef.value) {
    allSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {})
// 常用应用列数：小屏 4 列，大屏(>=400px) 5 列
const favColumnNum = ref(4)
const updateFavColumns = () => {
  const width = window.innerWidth || 375
  favColumnNum.value = width >= 400 ? 5 : 4
}
onMounted(() => {
  updateFavColumns()
  window.addEventListener('resize', updateFavColumns, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateFavColumns)
})
</script>

<style scoped>
.enterprise-apps {
  background-color: #f7f8fa;
  min-height: 100vh;
}

/* 公共区块头 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
}
.section-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

/* 常用应用 */
.favorite-section {
  background: #fff;
  margin: 12px 12px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.favorite-grid {
  padding: 0 8px 12px;
}
.favorite-grid :deep(.van-grid-item__content) {
  padding: 10px 6px;
  background: transparent;
}
.mini-card {
  position: relative;
  width: 100%;
  height: 78px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ebedf0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.mini-card.fav { height: 86px; }
.mini-card.add {
  border-style: dashed;
}
.mini-card__icon {
  margin-bottom: 6px;
}
.mini-card.fav .mini-card__icon { margin-bottom: 8px; }
.mini-card__name {
  font-size: 12px;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mini-card__name.add { color: #1989fa; }
.remove-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ee0a24;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(238,10,36,0.3);
}

/* 全部应用 */
.all-section {
  margin-top: 8px;
}
.all-layout {
  display: flex;
  gap: 12px;
  padding: 0 12px 12px;
}
.sidebar-wrapper {
  width: 88px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.content-wrapper {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.apps-grid { padding: 8px 12px 12px; }
.mini-card.row { /* deprecated for all-apps; kept for reference */ }
.apps-grid :deep(.van-grid-item__content) { padding: 0 !important; background: transparent; }
.apps-grid :deep(.van-grid-item) { align-items: stretch; }
.mini-card.disabled { opacity: 0.5; }
.status-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}
.search-header {
  background: white;
  padding: 0 12px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.category-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}
.category-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 8px;
  border-bottom: 1px solid #ebedf0;
}
.category-name {
  font-weight: 600;
  color: #323233;
}
.category-count {
  font-size: 12px;
  color: #969799;
  background: #f7f8fa;
  padding: 2px 8px;
  border-radius: 10px;
}
.group-block {
  padding: 8px 12px 12px;
}
.group-title {
  margin: 6px 4px 10px;
  font-size: 13px;
  color: #646566;
}
.app-rect {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.corner-action {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}
.app-label {
  font-size: 12px;
  color: #323233;
}
.empty-state { padding: 60px 0; }

/* 响应式优化 */
@media (max-width: 375px) {
  .fav-icon { width: 44px; height: 44px; }
  .app-rect { width: 46px; height: 46px; }
}
</style>
