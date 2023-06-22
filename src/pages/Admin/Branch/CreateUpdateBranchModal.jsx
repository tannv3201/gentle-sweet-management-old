import React, { useEffect } from "react";
import { useFormik } from "formik";
import GButton from "../../../components/MyButton/MyButton";
import { Autocomplete, Grid } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";
import GModal from "../../../components/GModal/GModal";

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { createAxios } from "../../../createInstance";
import GTextFieldNormal from "../../../components/GTextField/GTextFieldNormal";
import {
    districtApi,
    getDistrictById,
    getProvinceById,
    getWardById,
    wardApi,
} from "../../../redux/api/apiProvinceOpenAPI";
import { createBranch, updateBranch } from "../../../redux/api/apiBranch";

export default function CreateUpdateBranchModal({
    handleOpen,
    isOpen,
    selectedBranch,
    ...props
}) {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const [branch, setProductCategory] = useState({
        name: "",
        phone_number: "",
        detail_address: "",
        province: "",
        district: "",
        ward: "",
    });

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const handleCreateBranch = (branch) => {
        createBranch(user?.accessToken, dispatch, branch, axiosJWT).then(() => {
            handleCloseModal();
        });
    };

    const handleUpdateBranch = (branch) => {
        updateBranch(
            user?.accessToken,
            dispatch,
            selectedBranch?.id,
            branch,
            axiosJWT
        ).then(() => {
            handleCloseModal();
        });
    };

    // Validate
    const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng không để trống"),
        phone_number: Yup.string()
            .matches(/^\d+$/, "Số điện thoại chỉ bao gồm các ký tự số")
            .matches(phoneRegExp, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        email: Yup.string()
            .email("Vui lòng nhập địa chỉ email hợp lệ")
            .required("Vui lòng không để trống"),
        province: Yup.string().required("Vui lòng không để trống"),
        district: Yup.string().required("Vui lòng không để trống"),
        ward: Yup.string().required("Vui lòng không để trống"),
        detail_address: Yup.string().required("Vui lòng không để trống"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: branch,
        validationSchema: validationSchema,
        onSubmit: (data) => {
            if (data?.id) {
                handleUpdateBranch(data);
            } else {
                handleCreateBranch({
                    ...data,
                    admin_user_id: user?.id,
                });
            }
        },
    });

    useEffect(() => {
        if (selectedBranch) setProductCategory(selectedBranch);
    }, [selectedBranch]);

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
    useEffect(() => {
        setProvinces(getProvinceList);
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

    useEffect(() => {
        const fetch = async () => {
            if (selectedBranch?.id) {
                const provinceSelected = getProvinceById(
                    selectedBranch?.province,
                    getProvinceList
                );
                setSelectedProvince(provinceSelected);
                formik.setFieldValue("province", provinceSelected?.code);
                // District
                await districtApi(parseInt(selectedBranch?.province)).then(
                    (districtList) => {
                        const districtSelected = getDistrictById(
                            selectedBranch?.district,
                            districtList
                        );
                        setSelectedDistrict(districtSelected);
                        setDistricts(districtList);
                        formik.setFieldValue(
                            "district",
                            districtSelected?.code
                        );
                    }
                );

                await wardApi(parseInt(selectedBranch?.district)).then(
                    (wardList) => {
                        const wardSelected = getWardById(
                            selectedBranch?.ward,
                            wardList
                        );
                        setSelectedWard(wardSelected);
                        setWards(wardList);
                        formik.setFieldValue("ward", wardSelected?.code);
                    }
                );
            }
        };

        fetch();
    }, [selectedBranch]);

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

    return (
        <>
            <GModal
                handleClose={handleCloseModal}
                handleOpen={handleOpen}
                isOpen={isOpen}
                title={
                    selectedBranch?.id
                        ? "Cập nhật chi nhánh"
                        : "Thêm chi nhánh mới"
                }
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <GTextFieldNormal
                                onChange={formik.handleChange}
                                label="Tên chi nhánh"
                                fullWidth
                                name="name"
                                value={formik.values?.name || ""}
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <GTextFieldNormal
                                onChange={formik.handleChange}
                                label="Số điện thoại"
                                fullWidth
                                name="phone_number"
                                value={formik.values?.phone_number || ""}
                                formik={formik}
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
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                options={provinces}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                    value?.code === option?.code
                                }
                                onChange={handleProvinceChange}
                                value={selectedProvince || null}
                                renderInput={(params) => (
                                    <GTextFieldNormal
                                        {...params}
                                        label="Tỉnh/Thành phố"
                                        variant="outlined"
                                        name="province"
                                        formik={formik}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                options={districts}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                    value?.code === option?.code
                                }
                                onChange={handleDistrictChange}
                                value={selectedDistrict || null}
                                renderInput={(params) => (
                                    <GTextFieldNormal
                                        {...params}
                                        label="Quận/Huyện"
                                        variant="outlined"
                                        name="district"
                                        formik={formik}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                options={wards}
                                onBlur={formik.handleBlur}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                    value?.code === option?.code
                                }
                                onChange={(event, value) => {
                                    handleChangeWard(value);
                                }}
                                value={selectedWard || null}
                                renderInput={(params) => (
                                    <GTextFieldNormal
                                        {...params}
                                        label="Xã/Phường"
                                        variant="outlined"
                                        name="ward"
                                        formik={formik}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <GTextFieldNormal
                                onChange={formik.handleChange}
                                label="Tên đường, số nhà"
                                fullWidth
                                name="detail_address"
                                value={formik.values?.detail_address || ""}
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <GButton color={"success"} type="submit">
                                Lưu
                            </GButton>
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
