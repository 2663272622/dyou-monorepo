import request from '@/utils/request'

// 查看用户答题试卷
export function ViewUserAnswerPaper(data) {
    return request({
        url: '/manage/record/answerQuestions',
        method: 'post',
        data: data
    })
}

// 提交阅卷
export function submitMarking(data) {
    return request({
        url: '/manage/record/scoringSubQuestion',
        method: 'put',
        data: data
    })
}