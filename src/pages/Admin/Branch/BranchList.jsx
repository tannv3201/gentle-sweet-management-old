import React from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllProductCategory } from "../../../redux/api/apiProductCategory";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../redux/slice/authSlice";
import { createAxios } from "../../../createInstance";
import { useState } from "react";
import GTable from "../../../components/GTable/GTable";
import { IconButton } from "@mui/material";
import GButton from "../../../components/MyButton/MyButton";

import { LightTooltip } from "../../../components/GTooltip/GTooltip";
import CreateUpdateBranchModal from "./CreateUpdateBranchModal";
import { API_IMAGE_URL } from "../../../LocalConstants";
import styles from "./Branch.module.scss";
import classNames from "classnames/bind";
import { getAllBranch } from "../../../redux/api/apiBranch";
import {
    districtApi,
    getDistrictById,
    getProvinceById,
    getWardById,
    wardApi,
} from "../../../redux/api/apiProvinceOpenAPI";
const cx = classNames.bind(styles);

export default function Branch({ data }) {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [cloneData, setCloneData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedBranch, setSelectedBranch] = useState({});

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const branchList = useSelector((state) => state.branch.branch?.branchList);

    useEffect(() => {
        if (!user) {
            navigate("/dang-nhap");
        }
        if (user?.accessToken && branchList?.length === 0) {
            getAllBranch(dispatch);
        }
    }, []);

    useEffect(() => {
        setCloneData(structuredClone(branchList));
    }, [branchList]);

    const getProvinceList = structuredClone(
        useSelector((state) => state.province.province.provinceList)
    );
    useEffect(() => {
        const fetch = async () => {
            if (branchList?.length > 0) {
                const newList = [];
                for (const item of branchList) {
                    let provinceName;
                    let districtName;
                    let wardName;
                    const provinceSelected = getProvinceById(
                        item?.province,
                        getProvinceList
                    );
                    provinceName = provinceSelected?.name;
                    // District
                    await districtApi(parseInt(item?.province)).then(
                        (districtList) => {
                            const districtSelected = getDistrictById(
                                item?.district,
                                districtList
                            );
                            districtName = districtSelected?.name;
                        }
                    );

                    await wardApi(parseInt(item?.district)).then((wardList) => {
                        const wardSelected = getWardById(item?.ward, wardList);
                        wardName = wardSelected?.name;
                    });

                    newList.push({
                        ...item,
                        provinceName: provinceName,
                        districtName: districtName,
                        wardName: wardName,
                    });
                }

                setCloneData(structuredClone(newList));
            }
        };

        fetch();
    }, [branchList]);
    // Create update modal
    const [isOpenCreateUpdateModel, setIsOpenCreateUpdateModel] =
        useState(false);

    const handleOpenCreateUpdateModal = (rowData) => {
        setSelectedBranch({
            id: rowData?.id,
            name: rowData?.name,
            email: rowData?.email,
            phone_number: rowData?.phone_number,
            detail_address: rowData?.detail_address,
            province: rowData?.province,
            district: rowData?.district,
            ward: rowData?.ward,
        });
        setIsOpenCreateUpdateModel(true);
    };

    const handleCloseCreateUpdateModal = () => {
        setIsOpenCreateUpdateModel(false);
    };

    return (
        <>
            <GButton onClick={handleOpenCreateUpdateModal}>
                Thêm danh chi nhánh
            </GButton>
            <br />
            <br />
            <GTable
                title={"DANH MỤC CHI NHÁNH"}
                columns={[
                    { title: "Tên chi nhánh", field: "name" },
                    {
                        title: "Địa chỉ",
                        render: (rowData) => {
                            return (
                                <>
                                    {`${rowData?.detail_address}, ${rowData?.wardName}, ${rowData?.districtName}, ${rowData?.provinceName}`}
                                </>
                            );
                        },
                    },
                    { title: "Số điện thoại", field: "phone_number" },
                    { title: "Email", field: "email" },
                    {
                        title: "Thao tác",
                        field: "actions",
                        sorting: false,
                        export: false,
                        render: (rowData) => (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <LightTooltip
                                    placement="bottom"
                                    title="Chỉnh sửa"
                                >
                                    <IconButton
                                        onClick={() =>
                                            handleOpenCreateUpdateModal(rowData)
                                        }
                                    >
                                        <EditRoundedIcon color="primary" />
                                    </IconButton>
                                </LightTooltip>
                            </div>
                        ),
                    },
                ]}
                data={cloneData || []}
                exportFileName={"DanhSachNguoiDung"}
            />

            <CreateUpdateBranchModal
                isOpen={isOpenCreateUpdateModel}
                handleOpen={handleOpenCreateUpdateModal}
                handleClose={handleCloseCreateUpdateModal}
                selectedBranch={selectedBranch}
            />
        </>
    );
}
