/*
 * @Author: duanyadong
 * @Date: 2017-05-22
 */
import axios from 'axios'
var qs = require('qs');

/**  axios基础配置 */
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**  项目所有的请求写在这里并导出 */
export default {

    /**
     *  登录
     *
     * @param {any} params
     * @returns
     */
    fetchPost(url, params) {
        return new Promise((resolve, reject) => {

                params = params? qs.stringify(params): ''

            axios.post(url, params)
                .then(response => {
                resolve(response.data);
        }, err => {
                reject(err);
            })
        .catch((error) => {
                reject(error)
            })
        })
    },
    fetchGet(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            })
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

}