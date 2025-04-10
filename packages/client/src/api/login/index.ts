import { http } from "@/utils/http";

type ListResult = {
  code: number;
  message: string;
  list: Array<any>;
};

export function getPhoneCode(data?: object): Promise<any> {
  return http.request({
    url: "/user/phonenumcode",
    // url: "/prod-api/auth/login",
    method: "post",
    data
  });
}

// 验证码登录
export function codeLogin(data?: object): Promise<any> {
    return http.request({
      url: "/user/logincode",
      method: "post",
      data
    });
}
// 密码登录
export function pasLogin(data?: object): Promise<any> {
    return http.request({
        url: "/user/khdlogin",
        method: "post",
        data
    });
}
// 获取用户信息
export function getUserInfo(): Promise<any> {
    return http.request({
        url: "/user/getuserinfor",
        method: "get",
    });
}
