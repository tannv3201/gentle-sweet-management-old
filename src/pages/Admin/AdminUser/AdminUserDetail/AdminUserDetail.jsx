import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../createInstance";
import { loginSuccess } from "../../../../redux/slice/authSlice";
import {
    getAdminUserById,
    updateAdminUser,
} from "../../../../redux/api/apiAdminUser";
import { Autocomplete, Grid, InputAdornment } from "@mui/material";
import styles from "./AdminUserDetail.module.scss";
import classNames from "classnames/bind";
import dayjs from "dayjs";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_IMAGE_URL } from "../../../../LocalConstants";

import GButton from "../../../../components/MyButton/MyButton";
import { ArrowBackIosNew, ModeEditOutlineRounded } from "@mui/icons-material";
import GTextFieldNormal from "../../../../components/GTextField/GTextFieldNormal";
import { useFormik } from "formik";
import * as Yup from "yup";
import GDatePicker from "../../../../components/GDatePicker/GDatePicker";
import { useParams } from "react-router-dom";
import utc from "dayjs/plugin/utc";
import PasswordMenu from "./PasswordMenu/PasswordMenu";
import {
    districtApi,
    getDistrictById,
    getProvinceById,
    getWardById,
    wardApi,
} from "../../../../redux/api/apiProvinceOpenAPI";

const cx = classNames.bind(styles);
export default function AdminUserDetail() {
    const { adminUserId } = useParams();
    dayjs.extend(utc);
    const [isEditting, setIsEditting] = useState(false);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const getAdminUser = useSelector(
        (state) => state.adminUser.adminUser?.adminUser
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [cloneData, setCloneData] = useState([]);

    useEffect(() => {
        if (getAdminUser) {
            setCloneData(structuredClone(getAdminUser));
        }
    }, [getAdminUser]);

    const roleList = [
        {
            role_name: "ADMIN",
            role_id: 2,
        },
        {
            role_name: "STAFF",
            role_id: 3,
        },
    ];

    const [adminUser, setAdminUser] = useState({
        id: "",
        role_id: "",
        role_name: "",
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleUpdateAdminUser = (adminUser) => {
        updateAdminUser(
            user?.accessToken,
            dispatch,
            cloneData?.id,
            adminUser,
            axiosJWT
        ).then(() => setIsEditting(false));
    };

    // Validate
    const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const validationSchema = Yup.object().shape({
        role_id: Yup.string().required("Vui lòng không để trống"),
        name: Yup.string().required("Vui lòng không để trống"),
        email: Yup.string()
            .email("Vui lòng nhập địa chỉ email hợp lệ")
            .required("Vui lòng không để trống"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: adminUser,
        validationSchema: validationSchema,
        onSubmit: (data) => {
            const {
                confirmPassword,
                password,
                role_name,
                editState,
                branch,
                id,
                ...restData
            } = data;
            const dataFinal = {
                ...restData,
                branch_id: branch?.id,
            };
            handleUpdateAdminUser(dataFinal);
        },
    });

    const handleChangeRole = (data) => {
        if (data) {
            formik.setFieldValue("role_id", data?.role_id);
            formik.setFieldValue("role_name", data?.role_name);
        } else {
            formik.setFieldValue("role_id", null);
            formik.setFieldValue("role_name", null);
        }
    };
    const handleChangeBranch = (data) => {
        if (data) {
            formik.setFieldValue("branch", { id: data?.id, name: data?.name });
        } else {
            formik.setFieldValue("branch", null);
        }
    };
    const branchList = useSelector((state) => state.branch.branch?.branchList);

    useEffect(() => {
        if (cloneData) {
            const branch = branchList?.find(
                (b) => b.id === cloneData?.branch_id
            );
            setAdminUser({
                id: cloneData?.id,
                role_id: cloneData?.role_id || null,
                role_name:
                    cloneData?.role_id === 2
                        ? "ADMIN"
                        : cloneData?.role_id === 3
                        ? "STAFF"
                        : "",
                name: cloneData?.name,
                branch_id: cloneData?.branch_id,
                branch: branch,
                email: cloneData.email,
                password: "",
                confirmPassword: "",
            });
        }
    }, [cloneData]);

    useEffect(() => {
        if (adminUserId) {
            getAdminUserById(
                dispatch,
                adminUserId,
                user?.accessToken,
                axiosJWT
            );
        }
    }, [adminUserId]);

    const handleBack = () => {
        navigate("/admin-user");
    };

    return (
        <>
            <GButton onClick={handleBack} startIcon={<ArrowBackIosNew />}>
                Trở lại
            </GButton>
            <div className={cx("wrapper")}>
                <div className={cx("wrapper-header")}>
                    <Grid container>
                        <Grid item xs={6}>
                            <div className={cx("user-avatar")}>
                                <img
                                    src={`${API_IMAGE_URL}/women.jpg`}
                                    alt=""
                                />
                            </div>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            display={"flex"}
                            justifyContent={"flex-end"}
                            alignItems={"center"}
                        >
                            {!isEditting ? (
                                <div className={cx("button-list")}>
                                    <GButton
                                        onClick={() => setIsEditting(true)}
                                        startIcon={<ModeEditOutlineRounded />}
                                        color={"success"}
                                    >
                                        Chỉnh sửa
                                    </GButton>
                                    <PasswordMenu selectedUser={cloneData} />
                                </div>
                            ) : (
                                <span className={cx("label-editting")}>
                                    CẬP NHẬT THÔNG TIN
                                </span>
                            )}
                        </Grid>
                    </Grid>
                </div>
                <div className={cx("wrapper-body")}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disabled={!isEditting}
                                    options={roleList}
                                    getOptionLabel={(option) =>
                                        `${option?.role_name}` || ""
                                    }
                                    onChange={(e, value) => {
                                        handleChangeRole(value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    isOptionEqualToValue={(option, value) =>
                                        value === null ||
                                        value === "" ||
                                        option?.role_id === value?.role_id
                                    }
                                    value={
                                        (formik.values.role_id && {
                                            role_id: formik.values?.role_id,
                                            role_name: formik.values?.role_name,
                                        }) ||
                                        null
                                    }
                                    renderInput={(params) => (
                                        <GTextFieldNormal
                                            {...params}
                                            name="role_id"
                                            fullWidth
                                            label="Quyền hạn"
                                            formik={formik}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    disabled={!isEditting}
                                    options={branchList}
                                    getOptionLabel={(option) =>
                                        `${option?.name}` || ""
                                    }
                                    onChange={(e, value) => {
                                        handleChangeBranch(value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    isOptionEqualToValue={(option, value) =>
                                        value === null ||
                                        value === "" ||
                                        option?.id === value?.id
                                    }
                                    value={formik.values?.branch || null}
                                    renderInput={(params) => (
                                        <GTextFieldNormal
                                            {...params}
                                            name="branch_id"
                                            fullWidth
                                            label="Cơ sở"
                                            formik={formik}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <GTextFieldNormal
                                    disabled={!isEditting}
                                    onChange={formik.handleChange}
                                    label="Tên tài khoản"
                                    fullWidth
                                    name="name"
                                    value={formik.values?.name || ""}
                                    formik={formik}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <GTextFieldNormal
                                    disabled={!isEditting}
                                    onChange={formik.handleChange}
                                    label="Email"
                                    fullWidth
                                    name="email"
                                    value={formik.values?.email || ""}
                                    formik={formik}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                @
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            {isEditting && (
                                <Grid
                                    item
                                    xs={12}
                                    display={"flex"}
                                    justifyContent={"flex-end"}
                                >
                                    <div>
                                        <GButton type="submit">Lưu</GButton>
                                        <GButton
                                            style={{ marginLeft: "12px" }}
                                            color="text"
                                            onClick={() => setIsEditting(false)}
                                        >
                                            Hủy
                                        </GButton>
                                    </div>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </div>
            </div>
        </>
    );
}
