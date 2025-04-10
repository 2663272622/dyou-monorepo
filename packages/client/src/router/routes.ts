import Layout from "@/layout/index.vue";
import type {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/index.vue"),
        meta: {
            title: "登录",
            noCache: true
        }
    },
    {
        path: "/",
        name: "root",
        component: Layout,
        redirect: {name: "home"},
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "我的书架"
                }
            },
            {
                path: "books",
                name: "books",
                component: () => import("@/views/books/index.vue"),
                meta: {
                    title: "教材"
                }
            },
            {
                path: "my",
                name: "my",
                component: () => import("@/views/my/index.vue"),
                meta: {
                    title: "我的",
                    noCache: true
                }
            },
        ]
    },
    {
        path: "/assess",
        name: "assess",
        component: () => import("@/views/my/assess/index.vue"),
        meta: {
            title: "评估",
        }
    },
    {
        path: "/answer",
        name: "answer",
        component: () => import("@/views/my/assess/answer/index.vue"),
        meta: {
            title: "答题",
        },
    },
];

export default routes;
