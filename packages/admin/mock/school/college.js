/*
import Mock from 'mockjs';

const Random = Mock.Random;

// 生成模拟的数据
const colleges = Array.from({ length: 5 }, () => ({
    id: Random.id(),
    code: Random.word(3, 6).toUpperCase() + Random.integer(100, 999),
    name: Random.ctitle(3, 6) + '学院',
    logo: Random.image('100x100', Random.color(), '#FFF', '学院Logo'),
    dean: Random.name(),
}));

// 模拟获取学院列表的接口
Mock.mock('/school/colleges/list', 'get', {
    code: 200,
    message: '成功',
    data: colleges,
});

// 根据 ID 获取学院信息
Mock.mock(/\/school\/colleges\/\d+/, 'get', (options) => {
    const collegeId = options.url.match(/\/school\/colleges\/(\d+)/)[1];
    const college = colleges.find(c => c.id === collegeId);
    return {
        code: 200,
        message: '成功',
        data: college || {},
    };
});
*/

// mock/school.js
import { MockMethod } from 'vite-plugin-mock';

export default [
    {
        url: '/api/school/colleges/list',
        method: 'get',
        response: () => {
            return {
                code: 0,
                data: {
                    name: '张三',
                    age: 30,
                },
            };
        },
    },
]