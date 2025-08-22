/**
 * 模拟数据文件
 * 包含演示所需的所有静态数据
 * 数据按角色进行区分，支持动态适配功能
 */

// 司机角色相关数据
export const driverData = {
  // 今日营运数据
  todayStats: {
    orderCount: 3,        // 接单数
    tripCount: 2,         // 承运趟数
    estimatedIncome: 1580 // 预计运费收入
  },

  // 个人成就数据
  achievements: {
    totalTrips: 156,      // 完成运输次数
    totalMileage: 28560   // 总里程(km)
  },

  // 当前运输列表
  currentTransports: [
    {
      id: 'D001',
      plateNumber: '京A12345',        // 车牌号
      origin: '北京市朝阳区',         // 起始地
      destination: '天津市滨海新区',   // 目的地
      cargoInfo: '电子产品 5.2吨',    // 货物信息
      status: 'loading',              // 状态：loading-装货中, transporting-运输中, unloading-卸货中
      estimatedArrival: '2024-01-15 14:30',
      orderAmount: 800
    },
    {
      id: 'D002',
      plateNumber: '京A67890',
      origin: '北京市丰台区',
      destination: '河北省石家庄市',
      cargoInfo: '建材 8.5吨',
      status: 'transporting',
      estimatedArrival: '2024-01-15 18:00',
      orderAmount: 650
    },
    {
      id: 'D003',
      plateNumber: '京A54321',
      origin: '北京市海淀区',
      destination: '山东省济南市',
      cargoInfo: '食品 3.8吨',
      status: 'unloading',
      estimatedArrival: '2024-01-16 09:30',
      orderAmount: 520
    }
  ],

  // 历史运单
  historyOrders: [
    {
      id: 'DH001',
      plateNumber: '京A11111',
      origin: '北京市',
      destination: '上海市',
      cargoInfo: '机械设备 12吨',
      completedTime: '2024-01-10',
      amount: 2800,
      status: 'completed'
    },
    {
      id: 'DH002',
      plateNumber: '京A22222',
      origin: '北京市',
      destination: '广州市',
      cargoInfo: '电子产品 6吨',
      completedTime: '2024-01-08',
      amount: 3200,
      status: 'completed'
    }
  ],

  // 我的车辆
  vehicles: [
    {
      id: 'V001',
      plateNumber: '京A12345',
      vehicleType: '厢式货车',
      loadCapacity: '40 吨',
      vin: 'LVSF665443233625655',
      transportLicense: '875665443233625655',
      status: 'active'
    },
    {
      id: 'V002',
      plateNumber: '京A67890',
      vehicleType: '平板货车',
      loadCapacity: '40 吨',
      vin: 'LVSF665443233625655',
      transportLicense: '875665443233625655',
      status: 'active'
    },
    {
      id: 'V003',
      plateNumber: '冀B76543',
      vehicleType: '自卸货车',
      loadCapacity: '40 吨',
      vin: 'LVSF665443233625655',
      transportLicense: '875665443233625655',
      status: 'active'
    },
    {
      id: 'V004',
      plateNumber: '鲁C88990',
      vehicleType: '牵引车',
      loadCapacity: '40 吨',
      vin: 'LVSF665443233625655',
      transportLicense: '875665443233625655',
      status: 'active'
    }
  ]
}

// 船东角色相关数据
export const shipOwnerData = {
  // 今日营运数据
  todayStats: {
    orderCount: 2,        // 接单数
    voyageCount: 1,       // 承运航次
    estimatedIncome: 8500 // 预计运费收入
  },

  // 个人成就数据
  achievements: {
    totalTrips: 89,       // 完成运输次数
    totalVoyage: 15680    // 总航程(海里)
  },

  // 当前运输列表
  currentTransports: [
    {
      id: 'S001',
      shipName: '鲁海运001',           // 船舶名
      voyageNumber: 'LHY20240115001', // 航次号
      departurePort: '青岛港',         // 起运港
      arrivalPort: '上海港',           // 目的港
      cargoInfo: '集装箱 180TEU',      // 货物信息
      status: 'sailing',               // 状态：loading-装船中, sailing-航行中, unloading-卸船中
      estimatedArrival: '2024-01-16 06:00',
      orderAmount: 12000
    },
    {
      id: 'S002',
      shipName: '鲁海运002',
      voyageNumber: 'LHY20240115002',
      departurePort: '天津港',
      arrivalPort: '大连港',
      cargoInfo: '散货 3200吨',
      status: 'loading',
      estimatedArrival: '2024-01-17 10:30',
      orderAmount: 8800
    }
  ],

  // 历史运单
  historyOrders: [
    {
      id: 'SH001',
      shipName: '鲁海运001',
      voyageNumber: 'LHY20240110001',
      departurePort: '青岛港',
      arrivalPort: '宁波港',
      cargoInfo: '集装箱 220TEU',
      completedTime: '2024-01-12',
      amount: 15600,
      status: 'completed'
    },
    {
      id: 'SH002',
      shipName: '鲁海运002',
      voyageNumber: 'LHY20240108001',
      departurePort: '天津港',
      arrivalPort: '广州港',
      cargoInfo: '散货 2800吨',
      completedTime: '2024-01-11',
      amount: 18900,
      status: 'completed'
    }
  ],

  // 我的船舶
  ships: [
    {
      id: 'SH001',
      shipName: '鲁海运001',
      shipType: '集装箱船',
      loadCapacity: '500TEU',
      mmsi: '412345678',
      shipIdentification: 'CN-SHID-0001',
      businessTransportLicense: 'BZ-2024-0001',
      status: 'active'
    },
    {
      id: 'SH002',
      shipName: '鲁海运002',
      shipType: '散货船',
      loadCapacity: '5000吨',
      mmsi: '412345679',
      shipIdentification: 'CN-SHID-0002',
      businessTransportLicense: 'BZ-2024-0002',
      status: 'active'
    }
  ]
}

// 通用数据（两个角色共享）
export const commonData = {
  // 账户余额信息
  accountBalance: {
    availableBalance: 15680.50,  // 可用余额
    frozenAmount: 2300.00,       // 冻结金额
    totalIncome: 45600.80        // 累计收入
  },

  // 运单中心筛选项
  orderFilters: [
    { key: 'received', label: '已接单', count: 3 },
    { key: 'loaded', label: '已装货', count: 2 },
    { key: 'unloaded', label: '已卸货', count: 1 },
    { key: 'reviewed', label: '已复核', count: 8 },
    { key: 'settled', label: '已核算', count: 12 }
  ],

  // 功能列表（通用部分）
  commonFeatures: [
    { key: 'income_record', label: '收入记录', icon: 'bill-o' },
    { key: 'exception_report', label: '异常报备', icon: 'warning-o' },
    { key: 'service_center', label: '服务中心', icon: 'service-o' },
    { key: 'help_feedback', label: '帮助反馈', icon: 'question-o' }
  ],

  // 司机专属功能
  driverOnlyFeatures: [
    { key: 'entry_appointment', label: '入场预约记录', icon: 'calendar-o' },
    { key: 'weighing_record', label: '过磅记录', icon: 'balance-o' }
  ]
}

// 工作台任务状态数据
export const workbenchStates = {
  // 状态一：待提货/待装船
  pickup: {
    title: '待提货',
    content: '请前往提货地点确认货物信息',
    buttons: [
      { text: '开始导航', type: 'primary', action: 'navigate' },
      { text: '确认到达', type: 'default', action: 'confirm_arrival' }
    ],
    contextInfo: {
      address: '北京市朝阳区建国路88号',
      distance: '12.5km',
      eta: '预计25分钟到达'
    }
  },

  // 状态二：装货中/装船中
  loading: {
    title: '装货中',
    content: '正在装载货物，请确认货物信息无误',
    buttons: [
      { text: '扫码装货', type: 'primary', action: 'scan_loading' },
      { text: '上传磅单', type: 'default', action: 'upload_weight' }
    ],
    contextInfo: {
      cargoWeight: '5.2吨',
      loadingProgress: '60%',
      estimatedTime: '预计30分钟完成'
    }
  },

  // 状态三：运输中
  transporting: {
    title: '运输中',
    content: '货物运输中，请保持安全驾驶',
    buttons: [
      { text: '上报异常', type: 'warning', action: 'report_exception' },
      { text: '联系调度', type: 'default', action: 'contact_dispatch' }
    ],
    contextInfo: {
      destination: '天津市滨海新区港口路66号',
      remainingDistance: '156km',
      eta: '预计3小时30分钟到达'
    }
  },

  // 状态四：待卸货/待卸船
  unloading: {
    title: '待卸货',
    content: '已到达目的地，准备卸货',
    buttons: [
      { text: '扫码签收', type: 'primary', action: 'scan_receipt' },
      { text: '上传回单', type: 'default', action: 'upload_receipt' }
    ],
    contextInfo: {
      arrivalTime: '14:25',
      unloadingDock: '3号卸货台',
      contactPerson: '王经理 185****6677'
    }
  },

  // 状态五：已完成
  completed: {
    title: '运输完成',
    content: '本次运输任务已完成，感谢您的辛苦工作！',
    buttons: [
      { text: '查看费用明细', type: 'primary', action: 'view_billing' },
      { text: '评价订单', type: 'default', action: 'rate_order' }
    ],
    contextInfo: {
      completionTime: '2024-01-15 14:45',
      totalAmount: '800元',
      settlementStatus: '待结算'
    }
  }
}

/**
 * 根据角色获取对应的数据
 * @param {string} role - 用户角色 ('driver' | 'shipOwner')
 * @returns {object} 角色对应的数据对象
 */
export function getDataByRole(role) {
  return role === 'driver' ? driverData : shipOwnerData
}

/**
 * 获取角色对应的里程/航程标签
 * @param {string} role - 用户角色
 * @returns {object} 包含标签和数值的对象
 */
export function getMileageLabel(role) {
  const data = getDataByRole(role)
  return {
    label: role === 'driver' ? '总里程' : '总航程',
    value: role === 'driver' ? `${data.achievements.totalMileage} km` : `${data.achievements.totalVoyage} 海里`
  }
}

/**
 * 获取角色对应的承运标签
 * @param {string} role - 用户角色
 * @returns {string} 承运标签
 */
export function getTransportLabel(role) {
  return role === 'driver' ? '承运趟数' : '承运航次'
}

/**
 * 获取角色对应的车辆/船舶标签
 * @param {string} role - 用户角色
 * @returns {object} 包含标签和图标的对象
 */
export function getVehicleLabel(role) {
  return {
    label: role === 'driver' ? '我的车辆' : '我的船舶',
    icon: role === 'driver' ? 'logistics' : 'ship'
  }
}
