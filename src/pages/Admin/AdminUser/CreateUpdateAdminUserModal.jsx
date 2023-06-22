import React, { useEffect } from "react";
import { useFormik } from "formik";
import GButton from "../../../components/MyButton/MyButton";
import { Autocomplete, Grid, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import GModal from "../../../components/GModal/GModal";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { createAxios } from "../../../createInstance";
import GTextFieldNormal from "../../../components/GTextField/GTextFieldNormal";
import { createAdminUser } from "../../../redux/api/apiAdminUser";
import GDatePicker from "../../../components/GDatePicker/GDatePicker";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
    districtApi,
    provinceApi,
    wardApi,
} from "../../../redux/api/apiProvinceOpenAPI";
import { getAllBranch } from "../../../redux/api/apiBranch";

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

export default function CreateUpdateAdminUserModal({
    handleOpen,
    isOpen,
    selectedUser,
    ...props
}) {
    // Format múi giờ
    dayjs.extend(utc);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const [adminUser, setAdminUser] = useState({
        id: "",
        branch_id: "",
        role_id: "",
        role_name: "",
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleCreateAdminUser = async (adminUser) => {
        await createAdminUser(
            user?.accessToken,
            dispatch,
            adminUser,
            axiosJWT
        ).then(() => {
            handleCloseModal();
        });
    };

    // Validate
    const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const validationSchema = Yup.object().shape({
        role_id: Yup.string().required("Vui lòng không để trống"),
        branch_id: Yup.string().required("Vui lòng không để trống"),
        password: Yup.string()
            .required("Vui lòng không để trống")
            .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
            .max(20, "Mật khẩu tối đa 20 kí tự"),
        name: Yup.string().required("Vui lòng không để trống"),
        email: Yup.string()
            .email("Vui lòng nhập địa chỉ email hợp lệ")
            .required("Vui lòng không để trống"),
        confirmPassword: Yup.string().required("Vui lòng không để trống"),
    });

    const handleCloseModal = () => {
        formik.resetForm();
        formik.setFieldValue("province", null);
        formik.setFieldValue("district", null);
        formik.setFieldValue("ward", null);
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        props.handleClose();
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: adminUser,
        validationSchema: validationSchema,
        onSubmit: (data) => {
            const { id, confirmPassword, role_name, editState, ...restData } =
                data;

            handleCreateAdminUser(restData);
        },
    });

    // State PROVINCE LIST - DISTRICT LIST - WARD LIST
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    // State Selected PROVINCE / DISTRICT /W ARD -> onChange
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const getProvinceList = structuredClone(
        useSelector((state) => state.province.province.provinceList)
    );

    // Get province list from API
    const getBranch = useSelector((state) => state.branch.branch?.branchList);

    useEffect(() => {
        const fetch = async () => {
            setProvinces(getProvinceList);

            if (getBranch?.length === 0) {
                await getAllBranch(dispatch);
            }
        };
        fetch();
    }, []);

    // Fn handle province onChange event
    const handleProvinceChange = async (event, value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setSelectedWard(null);
        formik.setFieldValue("province", value?.code);

        if (value) {
            await districtApi(value?.code).then((districts) => {
                setDistricts(districts);
            });
        } else {
            setDistricts([]);
            formik.setFieldValue("province", null);
            formik.setFieldValue("district", null);
            formik.setFieldValue("ward", null);
        }
    };

    // Fn handle district onChange event
    const handleDistrictChange = async (event, value) => {
        setSelectedDistrict(value);
        setSelectedWard(null);
        formik.setFieldValue("district", value?.code);

        if (value) {
            await wardApi(value?.code).then((wards) => {
                setWards(wards);
            });
        } else {
            setWards([]);
            formik.setFieldValue("district", null);
            formik.setFieldValue("ward", null);
        }
    };

    // Fn handle ward onChange event
    const handleChangeWard = async (value) => {
        if (value) {
            setSelectedWard(value);
            formik.setFieldValue("ward", value?.code);
        } else {
            formik.setFieldValue("ward", null);
        }
    };

    const handleChangeBirthDate = (value) => {
        if (value) {
            formik.setFieldValue("birth_date", value);
        } else {
            formik.setFieldValue("birth_date", null);
        }
        formik.validateField("birth_date");
    };

    const handleChangeRole = (data) => {
        if (data) {
            formik.setFieldValue("role_id", data?.role_id);
            formik.setFieldValue("role_name", data?.role_name);
        } else {
            formik.setFieldValue("role_id", null);
            formik.setFieldValue("role_name", null);
        }
    };
    const [selectedBranch, setSelectedBranch] = useState({});

    const handleChangeBranch = (value) => {
        if (value) {
            formik.setFieldValue("branch_id", value?.id);
            setSelectedBranch(value);
        } else {
            formik.setFieldValue("branch_id", null);
            setSelectedBranch("");
        }
    };

    return (
        <>
            <GModal
                handleClose={handleCloseModal}
                handleOpen={handleOpen}
                isOpen={isOpen}
                title={
                    selectedUser?.editState
                        ? "Cập nhật thông tin"
                        : "Thêm người dùng mới"
                }
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Autocomplete
                                options={roleList}
                                getOptionLabel={(option) =>
                                    `${option?.role_name}` || ""
                                }
                                onChange={(e, value) => {
                                    handleChangeRole(value);
                                }}
                                onBlur={formik.handleBlur}
                                isOptionEqualToValue={(option, value) =>
                                    // value === null ||
                                    // value === "" ||
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
                                options={getBranch}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => option.name || ""}
                                isOptionEqualToValue={(option, value) =>
                                    value?.id === option?.id
                                }
                                onChange={(event, value) => {
                                    handleChangeBranch(value);
                                }}
                                value={selectedBranch || null}
                                renderInput={(params) => (
                                    <GTextFieldNormal
                                        {...params}
                                        fullWidth
                                        label="Chọn cơ sở"
                                        name="branch_id"
                                        InputLabelProps={{ shrink: true }}
                                        formik={formik}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <GTextFieldNormal
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
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <GTextFieldNormal
                                onChange={formik.handleChange}
                                password={true}
                                label="Mật khẩu"
                                fullWidth
                                name="password"
                                value={formik.values?.password || ""}
                                formik={formik}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <GTextFieldNormal
                                onChange={formik.handleChange}
                                label="Nhập lại mật khẩu"
                                password={true}
                                fullWidth
                                name="confirmPassword"
                                value={formik.values?.confirmPassword || ""}
                                formik={formik}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GButton type="submit">Lưu</GButton>
                            <GButton
                                style={{ marginLeft: "12px" }}
                                color="text"
                                onClick={handleCloseModal}
                            >
                                Hủy
                            </GButton>
                        </Grid>
                    </Grid>
                </form>
            </GModal>
        </>
    );
}
