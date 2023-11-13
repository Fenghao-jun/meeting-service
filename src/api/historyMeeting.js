import request from '@/utils/request'

// 查询历史会议分页列表
export function getHistoryPageList(params) {
  return request({
    url: `/hb-iot-meeting/meeting/getHistoryPageList`,
    method: 'get',
    params
  })
}
