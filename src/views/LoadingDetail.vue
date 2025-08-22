<template>
  <div class="loading-detail">
    <!-- 头部导航 -->
    <van-nav-bar
      title="装货详情"
      left-arrow
      @click-left="goBack"
    >
      <template #right>
        <van-icon name="ellipsis" class="nav-icon" />
        <van-icon name="cross" class="nav-icon" />
      </template>
    </van-nav-bar>

    <!-- 页面内容容器 -->
    <div class="page-container">
      <!-- 地址信息 -->
      <van-cell-group inset class="section">
        <van-cell title="地址信息" />
        <div class="address-list">
          <div class="address-item">
            <div class="address-dot blue"></div>
            <div class="address-content">
              <div class="address-title">{{ waybillDetail.origin?.title || '装货地址' }}</div>
              <div class="address-detail">{{ waybillDetail.origin?.addr || '地址信息加载中...' }}</div>
            </div>
          </div>
          <div class="address-item">
            <div class="address-dot green"></div>
            <div class="address-content">
              <div class="address-title">{{ waybillDetail.destination?.title || '卸货地址' }}</div>
              <div class="address-detail">{{ waybillDetail.destination?.addr || '地址信息加载中...' }}</div>
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 运输详情 -->
      <van-cell-group inset class="section">
        <van-cell title="运输单号" :value="transportInfo.orderNumber" />
        <van-cell title="运输车辆" :value="transportInfo.vehicle" />
        <van-cell title="货物类型" :value="transportInfo.cargoType" />
        <van-cell title="装货重量" :value="transportInfo.weight" />
        <van-cell title="装货时间" is-link :value="transportInfo.loadingTime" @click="showTimePicker = true" />
      </van-cell-group>

      <!-- 装货凭证 -->
      <van-cell-group inset class="section">
        <van-cell title="装货凭证">
          <template #label>
            <div class="upload-hint">(最多可以上传9张)</div>
          </template>
        </van-cell>
        <div class="upload-area">
          <div class="image-list">
            <div 
              v-for="(image, index) in voucherImages" 
              :key="index" 
              class="image-item"
            >
              <img :src="image.url" :alt="image.name" />
              <div class="delete-btn" @click="deleteImage(index)">
                <van-icon name="minus" />
              </div>
            </div>
            <div class="upload-btn" @click="uploadImage" v-if="voucherImages.length < 9">
              <van-icon name="photo-o" />
              <span>上传图片</span>
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 运单备注 -->
      <van-cell-group inset class="section">
        <van-cell title="运单备注" />
        <div class="remark-area">
          <van-field
            v-model="remark"
            type="textarea"
            placeholder="请输入特殊要求和备注"
            rows="4"
            maxlength="50"
            show-word-limit
            class="remark-input"
          />
        </div>
      </van-cell-group>

      <!-- 底部按钮 -->
      <div class="bottom-button">
        <van-button 
          type="primary" 
          size="large" 
          block 
          @click="confirmLoading"
          :disabled="!canConfirm"
        >
          确定装货
        </van-button>
      </div>
    </div>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择装货时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取运单ID
const waybillId = route.params.id

// 运输信息
const transportInfo = ref({
  orderNumber: '',
  vehicle: '',
  cargoType: '',
  weight: '',
  loadingTime: ''
})

// 运单详情数据
const waybillDetail = ref({})

// 初始化数据
onMounted(() => {
  // 这里可以根据waybillId获取运单详情
  // 模拟数据，实际应该调用API
  waybillDetail.value = {
    number: 'WV2022081916421110011',
    origin: { title: '富邦总部大楼', addr: '福建省福州市台江区江滨中大道399-6' },
    destination: { title: '福州港码头', addr: '福建省福州市马尾区港口路88号' },
    vehicle: '闽A0591D',
    cargoType: '精煤',
    weight: '500',
    unit: '吨'
  }
  
  // 设置运输信息
  transportInfo.value = {
    orderNumber: waybillDetail.value.number,
    vehicle: waybillDetail.value.vehicle,
    cargoType: waybillDetail.value.cargoType,
    weight: `${waybillDetail.value.weight} | ${waybillDetail.value.unit}`,
    loadingTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  }
})

// 装货凭证图片
const voucherImages = ref([
  {
    url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    name: '装货凭证1'
  }
])

// 运单备注
const remark = ref('')

// 时间选择相关
const showTimePicker = ref(false)
const currentDate = ref(new Date())
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2025, 11, 31)

// 是否可以确认装货
const canConfirm = computed(() => {
  return voucherImages.value.length > 0
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 上传图片
const uploadImage = () => {
  // 这里可以调用图片上传功能
  console.log('上传图片')
}

// 删除图片
const deleteImage = (index) => {
  voucherImages.value.splice(index, 1)
}

// 确认装货
const confirmLoading = () => {
  console.log('确认装货', {
    transportInfo: transportInfo.value,
    voucherImages: voucherImages.value,
    remark: remark.value
  })
  // 这里可以调用确认装货的API
  router.back()
}

// 时间确认
const onTimeConfirm = (value) => {
  transportInfo.value.loadingTime = value.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
  showTimePicker.value = false
}
</script>

<style scoped>
.loading-detail {
  min-height: 100vh;
  background: #f6f7fb;
  display: flex;
  flex-direction: column;
}

.page-container {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.section {
  margin-bottom: 12px;
}

.nav-icon {
  margin-left: 12px;
  font-size: 18px;
  color: #333;
}

/* 地址信息样式 */
.address-list {
  padding: 0 16px 12px;
  background: white;
}

.address-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.address-item:last-child {
  margin-bottom: 0;
}

.address-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}

.address-dot.blue {
  background: #1677ff;
}

.address-dot.green {
  background: #52c41a;
}

.address-content {
  flex: 1;
}

.address-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.address-detail {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 上传提示 */
.upload-hint {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

/* 上传区域 */
.upload-area {
  padding: 0 16px 12px;
  background: white;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  cursor: pointer;
}

.upload-btn .van-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

/* 备注区域 */
.remark-area {
  padding: 0 16px 12px;
}

.remark-input {
  background: #fafafa;
  border-radius: 8px;
}

.remark-input :deep(.van-field__control) {
  background: transparent;
}

/* 底部按钮 */
.bottom-button {
  margin-top: auto;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.bottom-button .van-button {
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style>
