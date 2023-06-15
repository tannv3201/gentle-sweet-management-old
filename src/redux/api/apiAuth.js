import axios from "axios";
import toast from "react-hot-toast";

import {
    loginFailed,
    loginStart,
    loginSuccess,
    logoutFailded,
    logoutStart,
    logoutSuccess,
    signupFailded,
    signupStart,
    signupSuccess,
} from "../slice/authSlice";
import { resetApp } from "../store";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        if (
            res.data?.role_name === "SUPER_ADMIN" ||
            res.data?.role_name === "ADMIN" ||
            res.data?.role_name === "STAFF"
        ) {
            navigate("/");
            toast.success(res.data.msg);
        } else {
            toast.error("Không có quyền truy cập");
        }
    } catch (error) {
        dispatch(loginFailed());
    }
};

export const logout = async (
    dispatch,
    user,
    navigate,
    accessToken,
    axiosJWT
) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post("/v1/auth/logout", user?.id, {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        dispatch(logoutSuccess());

        navigate("/dang-nhap");
        toast.success("Đăng xuất thành công");
    } catch (error) {
        dispatch(logoutFailded());
    }
};

export const signup = async (customerData, dispatch, navigate) => {
    dispatch(signupStart());
    try {
        const res = await axios.post("/v1/auth/register", customerData);
        dispatch(signupSuccess());
        navigate("/dang-nhap");
        if (res?.data?.insertId) {
            toast.success("Đăng ký thành công");
        }
    } catch (error) {
        dispatch(signupFailded());
        toast.success("Có lỗi xảy ra");
    }
};
