<template>
  <div class="waybill-detail">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="运单详情" left-arrow @click-left="goBack" />

    <!-- 地图占位（非真实地图） -->
    <div class="map-placeholder">
      <div class="map">
        <div class="map-water" />
        <div class="map-road" />
        <div class="map-marker map-marker--start">卸</div>
        <div class="map-marker map-marker--end">装</div>
      </div>
    </div>

    <!-- 主体卡片 -->
    <div class="content">
      <!-- 顶部编号与物流信息tab -->
      <div class="order-summary">
        <div class="order-number">{{ detail.number }}</div>
        <van-button size="small" round type="primary" plain @click="activeTab = 'logistics'">物流信息</van-button>
      </div>

      <!-- 接单信息 -->
      <van-cell-group inset>
        <van-cell title="接单" :label="`${detail.city}｜${detail.teamName} 已接单`">
          <template #value>
            <span>{{ detail.acceptTime }}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <div class="price-box">
              <div class="price-line">
                <van-icon name="cash-o" /> 运输单价 {{ detail.unitPrice }} 吨
              </div>
              <div class="sub">{{ detail.goodsName }}｜{{ detail.spec }}</div>
            </div>
          </template>
          <template #value>
            <div class="price-right">{{ detail.calorific }}</div>
          </template>
        </van-cell>
      </van-cell-group>



      <!-- 司机/船舶主体信息 -->
      <van-cell-group inset>
        <van-cell :title="detail.driver.name" :label="`${detail.driver.id}｜共完成 ${detail.driver.count} 单`">
          <template #icon>
            <van-image round width="32" height="32" :src="detail.driver.avatar" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 线路信息 -->
      <van-cell-group inset>
        <van-cell :title="detail.origin.title" :label="detail.origin.addr">
          <template #icon>
            <van-icon name="location-o" />
          </template>
          <template #right-icon>
            <van-button size="mini" round icon="phone-o" />
          </template>
        </van-cell>
        <van-cell :title="detail.destination.title" :label="detail.destination.addr">
          <template #icon>
            <van-icon name="location" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 调度信息 -->
      <van-cell-group inset>
        <van-cell title="调度信息">
          <template #label>
            <div class="dispatch-info">
              <div class="dispatch-row">
                <span class="dispatch-label">调度企业</span>
                <span class="dispatch-value">{{ detail.dispatch.company }}</span>
              </div>
              <div class="dispatch-row">
                <span class="dispatch-label">调度人员</span>
                <span class="dispatch-value">{{ detail.dispatch.personnel }}</span>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 凭证信息 -->
      <van-cell-group inset>
        <van-cell title="凭证信息">
          <template #label>
            <div class="voucher">
              <div class="voucher-row">
                <van-tag round type="primary" plain>装</van-tag>
                装货净重 {{ detail.load.weight }} 吨
                <span class="time">{{ detail.load.time }}</span>
                <van-icon name="passed" class="pass" /> 装货凭证
                <button 
                  @click="goToLoading"
                  class="action-btn van-button van-button--mini van-button--primary van-button--plain"
                  style="pointer-events: auto; border: 1px solid #1989fa; color: #1989fa; background: transparent; border-radius: 12px; position: relative; z-index: 999;"
                >
                  装货
                </button>
              </div>
              <div class="voucher-row">
                <van-tag round type="success" plain>卸</van-tag>
                卸货净重 {{ detail.unload.weight }} 吨
                <span class="time">{{ detail.unload.time }}</span>
                <van-icon name="passed" class="pass" /> 卸货凭证
                <button 
                  @click="goToUnloading"
                  class="action-btn van-button van-button--mini van-button--success van-button--plain"
                  style="pointer-events: auto; border: 1px solid #07c160; color: #07c160; background: transparent; border-radius: 12px; position: relative; z-index: 999;"
                >
                  卸货
                </button>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 费用详情 -->
      <van-cell-group inset>
        <van-cell title="费用详情">
          <template #label>
            <div class="fees">
              <div class="fee-row">
                <span>货主实付运费</span>
                <span>{{ detail.fees.shipperPay }}</span>
              </div>
              <div class="fee-row">
                <span>司机实收运费</span>
                <span>{{ detail.fees.driverReceive }}</span>
              </div>
              <div class="formula">货主实付=[(12.000*1.12-0.00+0-0)-0]/(1-0.056)=14.24</div>
              <div class="fee-row">
                <span>平台收取</span>
                <span>{{ detail.fees.platform }}</span>
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell title="货物单价" :value="detail.priceUnit" />
        <van-cell title="计费重量" :value="detail.billingWeight" />
        <van-cell title="扣费项目" />
        <div class="fee-list">
          <div class="fee-item" v-for="item in detail.deductions" :key="item.name">
            <span>{{ item.name }}</span>
            <span class="neg">-{{ item.amount }}</span>
          </div>
        </div>
        <van-cell title="补贴项目" />
        <div class="fee-list">
          <div class="fee-item" v-for="item in detail.subsidies" :key="item.name">
            <span>{{ item.name }}</span>
            <span>+{{ item.amount }}</span>
          </div>
        </div>
      </van-cell-group>
    </div>


  </div>
  
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeTab = ref('logistics')

// 是否水路：通过 query.mode=water 判断
const isWater = computed(() => route.query.mode === 'water')

// 模拟详情数据（可根据 id 请求接口，这里用静态）
const detail = ref({
  id: route.params.id,
  number: 'WV2022081916421110011',
  city: '福州市',
  teamName: '第一车队',
  acceptTime: '2022.10.03 13:42:30',
  unitPrice: 240,
  goodsName: '煤炭',
  spec: '精煤6000卡',
  calorific: '热值6000卡',
  shipper: {
    company: '信息科技有限公司',
    contactLine: '发货人 张三 17811112222',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  driver: {
    name: '李师傅',
    id: '闽AJW888',
    count: 156,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  origin: { title: '富邦总部大楼', addr: '湖北省武汉市市台江区江滨中大道399-6 刘经理 18566669999' },
  destination: { title: '福州港码头', addr: '湖北省武汉市马尾区港口路88号 王经理 18677778888' },
  dispatch: { 
    company: '物流运输有限公司',
    personnel: '测试'
  },
  load: { weight: 240, time: '2022.10.03 13:42:30' },
  unload: { weight: 240, time: '2022.10.03 13:42:30' },
  fees: { shipperPay: '14.24元', driverReceive: '520元', platform: '520元' },
  priceUnit: '10元/吨',
  billingWeight: '520吨',
  deductions: [ { name: '装车费', amount: '300' }, { name: '卸车费', amount: '200' } ],
  subsidies: [ { name: '油卡', amount: '300' }, { name: 'ETC', amount: '300' } ],
  // 车牌/船名
  plate: '闽A12345',
  vesselName: '福州一号'
})

const goBack = () => router.back()

// 跳转到装货详情页
const goToLoading = () => {
  console.log('=== 装货按钮点击调试信息 ===')
  console.log('当前路由:', router.currentRoute.value)
  console.log('当前路由参数:', route.params.id)
  console.log('目标路径:', `/main/loading/${route.params.id}`)
  
  // 检查路由是否存在
  const targetRoute = router.resolve(`/main/loading/${route.params.id}`)
  console.log('目标路由对象:', targetRoute)
  
  // 尝试跳转
  try {
    router.push(`/main/loading/${route.params.id}`)
    console.log('路由跳转命令已执行')
  } catch (error) {
    console.error('路由跳转失败:', error)
  }
}

// 跳转到卸货详情页
const goToUnloading = () => {
  console.log('卸货按钮被点击')
  alert('卸货按钮被点击了！')
  router.push(`/main/unloading/${route.params.id}`)
}
</script>

<style scoped>
.waybill-detail {
  min-height: 100vh;
  background: #f6f7fb;
  position: relative;
}

.map-placeholder {
  background: #fff;
}

.map {
  position: relative;
  height: 220px;
  background: #edf2ff;
  overflow: hidden;
}

.map-water {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: linear-gradient(135deg, #e6f7ff 40%, #f5f7ff 60%);
}

.map-road {
  position: absolute;
  top: 20px; left: 60px; right: 40px; bottom: 20px;
  background: transparent;
  border-left: 6px solid #2f54eb;
  border-top: 6px solid #2f54eb;
  border-radius: 24px;
  transform: rotate(10deg);
  opacity: .7;
}

.map-marker {
  position: absolute;
  width: 28px; height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  background: #1677ff;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  font-weight: 600;
}

.map-marker--start { bottom: 24px; left: 40px; background: #52c41a; }
.map-marker--end { top: 24px; right: 56px; background: #fa541c; }

.content { padding: 12px 12px 60px; }

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
}

.order-number { color: #666; font-size: 12px; }

.price-box .price-line { font-weight: 600; color: #333; display: flex; align-items: center; gap: 6px; }
.price-box .sub { color: #999; font-size: 12px; margin-top: 4px; }
.price-right { color: #666; }

.voucher { display: flex; flex-direction: column; gap: 8px; }
.voucher-row { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  color: #333; 
  position: relative;
}
.voucher-row .time { margin-left: 8px; color: #999; font-size: 12px; }
.voucher-row .pass { color: #52c41a; }

.fees { display: flex; flex-direction: column; gap: 8px; }
.fee-row { display: flex; justify-content: space-between; color: #333; }
.formula { color: #999; font-size: 12px; margin: 6px 0; }

.fee-list { padding: 0 16px 8px; }
.fee-item { display: flex; justify-content: space-between; padding: 6px 0; color: #333; }
.fee-item .neg { color: #333; opacity: .7; }

.dispatch-info { display: flex; flex-direction: column; gap: 8px; }
.dispatch-row { display: flex; justify-content: space-between; align-items: center; }
.dispatch-label { color: #999; font-size: 14px; }
.dispatch-value { color: #333; font-size: 14px; }

.action-btn {
  margin-left: auto;
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
  position: relative;
  z-index: 10;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}


</style>


