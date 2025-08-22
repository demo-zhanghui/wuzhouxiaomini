<!--
  车辆管理列表（司机角色）
  根据提供的截图实现卡片式车辆列表，包含：
  - 车牌、认证状态
  - 载重、车辆识别码（VIN）、道路运输证号
  - 右上角二维码装饰
  - 底部操作行：解绑
-->

<template>
  <div class="vehicle-page">
    <van-nav-bar title="车辆管理" left-arrow @click-left="goBack">
      <template #right>
        <div class="nav-right">
          <span class="add-btn" @click.stop="handleAddVehicle">新增</span>
          <van-icon name="ellipsis" @click.stop="handleMore" />
        </div>
      </template>
    </van-nav-bar>

    <div class="list-container">
      <div
        class="vehicle-card"
        v-for="item in vehicles"
        :key="item.id"
      >
        <div class="card-main">
          <div class="left-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M3 7h10v7H3z" fill="currentColor"/>
              <path d="M13 9h4l3 3v2h-7V9z" fill="currentColor" opacity=".9"/>
              <circle cx="7" cy="17" r="2" fill="currentColor"/>
              <circle cx="17" cy="17" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div class="info">
            <div class="row title-row">
              <span class="plate">{{ item.plateNumber }}</span>
              <van-icon name="passed" class="cert-icon" />
            </div>
            <div class="row meta">
              <span>配载 {{ item.loadCapacity }}</span>
            </div>
            <div class="row meta">
              <span>车辆识别码</span>
              <span class="value">{{ item.vin }}</span>
            </div>
            <div class="row meta">
              <span>道路运输证</span>
              <span class="value">{{ item.transportLicense }}</span>
            </div>
          </div>

          <div class="qr-corner">
            <van-icon name="qr" size="18" />
          </div>
        </div>

        <div class="card-actions">
          <van-space>
            <van-button size="small" type="primary" plain icon="edit" @click="openEdit(item)">编辑</van-button>
            <van-button size="small" type="default" icon="link" @click="unbind(item)">解绑</van-button>
          </van-space>
        </div>
      </div>
    </div>

    <van-popup v-model:show="showEdit" round position="bottom">
      <div class="edit-sheet">
        <div class="sheet-header">
          <div class="sheet-title">编辑车辆</div>
          <van-icon name="cross" @click="showEdit = false" />
        </div>
        <van-cell-group inset>
          <van-field v-model="form.plateNumber" label="车牌号" placeholder="请输入车牌号" />
          <van-field v-model="form.loadCapacity" label="配载" placeholder="例如 40 吨" />
          <van-field v-model="form.vin" label="车辆识别码" placeholder="VIN" />
          <van-field v-model="form.transportLicense" label="道路运输证" placeholder="证号" />
        </van-cell-group>
        <div class="sheet-actions">
          <van-button round block type="primary" @click="saveEdit">保存</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { driverData } from '@/data/mockData'

const router = useRouter()
const vehicles = computed(() => driverData.vehicles)

const goBack = () => router.back()

const unbind = (item) => {
  showToast(`解绑 ${item.plateNumber}（Demo）`)
}

const handleAddVehicle = () => {
  showToast('新增车辆（Demo）')
}

const handleMore = () => {
  showToast('更多操作（Demo）')
}

// 编辑弹窗逻辑（Demo级，直接改内存数据）
const showEdit = ref(false)
const editing = ref(null)
const form = ref({
  plateNumber: '',
  loadCapacity: '',
  vin: '',
  transportLicense: ''
})

const openEdit = (item) => {
  editing.value = item
  form.value = {
    plateNumber: item.plateNumber,
    loadCapacity: item.loadCapacity,
    vin: item.vin,
    transportLicense: item.transportLicense
  }
  showEdit.value = true
}

const saveEdit = () => {
  if (!editing.value) return
  Object.assign(editing.value, form.value)
  showEdit.value = false
  showToast('已保存（Demo，仅内存）')
}
</script>

<style scoped>
.vehicle-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.list-container {
  padding: 12px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-btn {
  color: var(--primary-color, #1989fa);
  font-size: 14px;
}

.vehicle-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 12px;
}

.card-main {
  display: flex;
  position: relative;
  padding: 14px 12px 8px 12px;
}

.left-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f5f7ff;
  color: #4b7bec;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.info { flex: 1; }

.title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.plate {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
}

.cert-icon { color: #07c160; }

.row.meta {
  font-size: 12px;
  color: #646566;
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.row.meta .value {
  color: #969799;
}

.qr-corner {
  position: absolute;
  right: 0;
  top: 0;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(64,158,255,0.08), rgba(64,158,255,0));
  clip-path: polygon(40% 0, 100% 0, 100% 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b7bec;
}

.card-actions {
  display: flex;
  justify-content: center;
  padding: 8px 12px 12px 12px;
  border-top: 1px solid #f0f0f0;
}
</style>

<style scoped>
.edit-sheet { padding: 16px 12px 24px; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.sheet-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.sheet-actions { padding: 12px; }
</style>


