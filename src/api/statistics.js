import request from '@/utils/request'

// 查询会议室及会议
export function queryMonthDate(params) {
  return request({
    url: `/hb-iot-meeting/meeting/queryMonthDate`,
    method: 'get',
    params
  })
}

// 查询会议室及会议
export function queryDataStatistics(params) {
  return request({
    url: `/hb-iot-meeting/meeting/dataStatistics`,
    method: 'get',
    params
  })
}

