import request from '@/utils/request'

// 查询测评列表进入测评详情
export function listRecord(query) {
    return request({
        url: '/manage/record/getSubmitRecordList',
        method: 'get',
        params: query
    })
}


// 从学生进入测评详情
export function listAssessmentRecord(query) {
    return request({
        url: '/manage/record/getAssessmentRecordList',
        method: 'get',
        params: query
    })
}
