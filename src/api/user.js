import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-element-admin/user/login',
//     method: 'post',
//     data
//   })
// }

export function getInfo() {
  return request({
    url: '/hb-iot-meeting/meeting/sso/current_staff',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/hb-iot-meeting/meeting/sso/logout',
    method: 'post'
  })
}

export function login(data) {
  return request({
    // url: `/hb-iot-meeting/meeting/sso/login?username=${data.username}&password=${data.password}`,
    url: `/hb-iot-meeting/meeting/sso/login`,
    method: 'post',
    data
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}

export function updatePassword(data) {
  return request({
    // url: `/hb-iot-meeting/meeting/sso/login?username=${data.username}&password=${data.password}`,
    url: `/hb-iot-meeting/meeting/api/v1/t-staff/updatePassword`,
    method: 'post',
    data
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}
