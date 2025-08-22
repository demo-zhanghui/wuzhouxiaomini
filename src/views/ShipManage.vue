<!--
  船舶管理列表（水路船东角色）
  要求：
  - 船舶名称、认证状态
  - 配载、船舶MMSI
  - 船舶识别码、船舶营业运输证编号
  - 编辑与解绑按钮
-->

<template>
  <div class="ship-page">
    <van-nav-bar title="船舶管理" left-arrow @click-left="goBack">
      <template #right>
        <div class="nav-right">
          <span class="add-btn" @click.stop="handleAddShip">新增</span>
          <van-icon name="ellipsis" @click.stop="handleMore" />
        </div>
      </template>
    </van-nav-bar>

    <div class="list-container">
      <div class="ship-card" v-for="item in ships" :key="item.id">
        <div class="card-main">
          <div class="left-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M3 15h18l-2 6H5l-2-6z" fill="currentColor"/>
              <path d="M12 3l4 2v6h-4V3z" fill="currentColor" opacity=".9"/>
              <path d="M8 11V7l4-2v6H8z" fill="currentColor" opacity=".7"/>
            </svg>
          </div>
          <div class="info">
            <div class="row title-row">
              <span class="name">{{ item.shipName }}</span>
              <van-icon name="passed" class="cert-icon" />
            </div>
            <div class="row meta">
              <span>配载 {{ item.loadCapacity }}</span>
            </div>
            <div class="row meta">
              <span>MMSI</span>
              <span class="value">{{ item.mmsi }}</span>
            </div>
            <div class="row meta">
              <span>船舶识别码</span>
              <span class="value">{{ item.shipIdentification }}</span>
            </div>
            <div class="row meta">
              <span>营业运输证</span>
              <span class="value">{{ item.businessTransportLicense }}</span>
            </div>
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
          <div class="sheet-title">编辑船舶</div>
          <van-icon name="cross" @click="showEdit = false" />
        </div>
        <van-cell-group inset>
          <van-field v-model="form.shipName" label="船舶名称" placeholder="请输入船名" />
          <van-field v-model="form.loadCapacity" label="配载" placeholder="例如 500TEU / 5000吨" />
          <van-field v-model="form.mmsi" label="MMSI" placeholder="9位数字" />
          <van-field v-model="form.shipIdentification" label="船舶识别码" placeholder="识别码" />
          <van-field v-model="form.businessTransportLicense" label="营业运输证" placeholder="证号" />
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
import { shipOwnerData } from '@/data/mockData'

const router = useRouter()
const ships = computed(() => shipOwnerData.ships)

const goBack = () => router.back()

const unbind = (item) => {
  showToast(`解绑 ${item.shipName}（Demo）`)
}

const handleAddShip = () => {
  showToast('新增船舶（Demo）')
}

const handleMore = () => {
  showToast('更多操作（Demo）')
}

const showEdit = ref(false)
const editing = ref(null)
const form = ref({
  shipName: '',
  loadCapacity: '',
  mmsi: '',
  shipIdentification: '',
  businessTransportLicense: ''
})

const openEdit = (item) => {
  editing.value = item
  form.value = {
    shipName: item.shipName || '',
    loadCapacity: item.loadCapacity || '',
    mmsi: item.mmsi || '',
    shipIdentification: item.shipIdentification || '',
    businessTransportLicense: item.businessTransportLicense || ''
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
.ship-page { min-height: 100vh; background: #f7f8fa; }
.list-container { padding: 12px; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.add-btn { color: var(--primary-color, #1989fa); font-size: 14px; }
.ship-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; margin-bottom: 12px; }
.card-main { display: flex; position: relative; padding: 14px 12px 8px 12px; }
.left-icon { width: 36px; height: 36px; border-radius: 10px; background: #f5f7ff; color: #1989fa; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
.info { flex: 1; }
.title-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.name { font-size: 15px; font-weight: 600; color: #323233; }
.cert-icon { color: #07c160; }
.row.meta { font-size: 12px; color: #646566; display: flex; gap: 8px; margin-top: 2px; }
.row.meta .value { color: #969799; }
.card-actions { display: flex; justify-content: center; padding: 8px 12px 12px 12px; border-top: 1px solid #f0f0f0; }
.edit-sheet { padding: 16px 12px 24px; }
.sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.sheet-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
.sheet-actions { padding: 12px; }
</style>


