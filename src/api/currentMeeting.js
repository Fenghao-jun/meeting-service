import request from '@/utils/request'

// 查询当前会议分页列表
export function getCurrentPageList(params) {
  return request({
    url: `/hb-iot-meeting/meeting/getCurrentPageList`,
    method: 'get',
    params
  })
}

// 根据id查询
export function getCurrentDetails(id) {
  return request({
    url: `/hb-iot-meeting/meeting/${id}`,
    method: 'get'
  })
}

// 查询部门和用户
export function queryDeptAndUser(params) {
  return request({
    url: `/hb-iot-meeting/meeting/api/v1/t-staff/queryDeptAndUser`,
    method: 'get',
    params
  })
}

// 取消会议
export function cancel(id) {
  return request({
    url: `/hb-iot-meeting/meeting/cancel/${id}`,
    method: 'delete'
  })
}
// 取消会议
export function oneClickCancelRepetitionMeeting(datas) {
  return request({
    url: `/hb-iot-meeting/meeting/oneClickCancelRepetitionMeeting?meetingId=${datas.meetingId}&repetitionId=${datas.repetitionId}`,
    method: 'delete'
  })
}

// 修改会议
export function meetingEdit(data) {
  return request({
    url: '/hb-iot-meeting/meeting',
    method: 'put',
    data
  })
}

// 会议服务
export function manageMeetingServices(params) {
  return request({
    url: `/hb-iot-meeting/manageMeetingServices`,
    method: 'get',
    params
  })
}

// 预定腾讯会议
export function scheduleMeeting(data) {
  return request({
    url: '/hb-iot-meeting/meeting/scheduleMeeting',
    method: 'post',
    data
  })
}

// 查询腾讯会议列表
export function queryTxMeetingList(params) {
  return request({
    url: `/hb-iot-meeting/meeting/queryTxMeetingList`,
    method: 'get',
    params
  })
}
