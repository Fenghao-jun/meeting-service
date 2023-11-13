import request from '@/utils/request'

// 查询会议室及会议
export function queryConferenceMeetings(params) {
  return request({
    url: `/hb-iot-meeting/meeting/queryConferenceMeetings`,
    method: 'get',
    params
  })
}

// 预约
export function scheduled(data) {
  return request({
    url: `/hb-iot-meeting/meeting/scheduled`,
    method: 'post',
    data
  })
}

// 重复预定
export function repetitionScheduled(data) {
  return request({
    url: `/hb-iot-meeting/meeting/repetitionScheduled`,
    method: 'post',
    data
  })
}

// 门口屏查询会议信息
export function getDoorMeeting(spaceId) {
  return request({
    url: `/hb-iot-meeting/meeting/door_meeting_info/space/${spaceId}`,
    method: 'get'
  })
}

// 门口屏查询会议信息
export function machineList() {
  return request({
    url: `/hb-iot-main/v1/machine/list`,
    method: 'post',
    data: {}
  })
}

// 查询楼宇接口
export function getBuildList(data) {
  return request({
    url: `/hb-iot-meeting/v1/building/list`,
    method: 'post',
    data: data
  })
}

// 查询楼层接口
export function getFloorList(id) {
  return request({
    url: `/hb-iot-meeting/v1/building/findFloorListByBuildingId/${id}`,
    method: 'get'
  })
}

export function manageMeetingServicesList(datas) {
  return request({
    url: '/hb-iot-meeting/manageMeetingServices/list',
    method: 'post',
    data: datas
  })
}

