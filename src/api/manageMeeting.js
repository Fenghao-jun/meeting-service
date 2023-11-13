
// 查询楼层接口
import request from '@/utils/request'

export function getManageSpaceList() {
  return request({
    url: `/hb-iot-meeting/meeting/api/v1/t-space/manageSpaceList`,
    method: 'get'
  })
}

export function manageMeetingPage(data) {
  return request({
    url: `/hb-iot-meeting/meeting/manageMeetingPage`,
    method: 'post',
    data
  })
}
