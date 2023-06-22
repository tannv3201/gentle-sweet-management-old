import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { provinceApi } from "../../../redux/api/apiProvinceOpenAPI";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import StatisticsCard from "../../../components/StatisticsCard/StatisticsCard";
import { Grid } from "@mui/material";
import { getAllInvoice } from "../../../redux/api/apiInvoice";
import { createAxios } from "../../../createInstance";
import { logoutSuccess } from "../../../redux/slice/authSlice";
import {
    AssignmentTurnedInRounded,
    CancelPresentationRounded,
    HourglassTopRounded,
    TaskRounded,
} from "@mui/icons-material";
import { getAllBooking } from "../../../redux/api/apiBooking";
import { getAllBranch } from "../../../redux/api/apiBranch";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const data = [
    {
        id: 1,
        invoice_quantity: 20,
        invoice_status_name: "Chờ xác nhận",
        icon: <TaskRounded htmlColor="#f57c00" />,
    },
    {
        id: 2,
        invoice_quantity: 40,
        invoice_status_name: "Đang xử lý",
        icon: <HourglassTopRounded htmlColor="#0288d1" />,
    },
    {
        id: 3,
        invoice_quantity: 34,
        invoice_status_name: "Hoàn thành",
        icon: <AssignmentTurnedInRounded htmlColor="#2e7d32" />,
    },
    {
        id: 3,
        invoice_quantity: 34,
        invoice_status_name: "Đã hủy",
        icon: <CancelPresentationRounded htmlColor="#d32f2f" />,
    },
];

function Dashboard() {
    const getProvinceList = structuredClone(
        useSelector((state) => state.province.province.provinceList)
    );
    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, logoutSuccess);

    const [invoiceList, setInvoiceList] = useState([]);
    const [bookingList, setBookingList] = useState([]);

    // Get province list from API
    useEffect(() => {
        const fetch = async () => {
            await getAllBranch(dispatch);

            if (getProvinceList?.length === 0) {
                await provinceApi(dispatch);
            }
            const getInvoiceList = await getAllInvoice(
                user?.accessToken,
                dispatch,
                axiosJWT
            );

            const pendingInvoiceList = getInvoiceList?.filter(
                (i) => i?.status === 1
            );

            // Processing invoice
            const processingInvoiceList = getInvoiceList?.filter(
                (i) =>
                    i?.status === 2 ||
                    i?.status === 3 ||
                    i?.status === 4 ||
                    i?.status === 7
            );

            // Completed invoice
            const completedInvoiceList = getInvoiceList?.filter(
                (i) => i?.status === 5
            );

            // Cancel invoice
            const cancelInvoiceList = getInvoiceList?.filter(
                (i) => i?.status === 6
            );

            setInvoiceList([
                {
                    invoice_quantity: pendingInvoiceList?.length,
                    invoice_status_name: "Chờ xác nhận",
                    icon: <TaskRounded htmlColor="#f57c00" />,
                },
                {
                    invoice_quantity: processingInvoiceList?.length,
                    invoice_status_name: "Đang xử lý",
                    icon: <HourglassTopRounded htmlColor="#0288d1" />,
                },
                {
                    invoice_quantity: completedInvoiceList?.length,
                    invoice_status_name: "Hoàn thành",
                    icon: <AssignmentTurnedInRounded htmlColor="#2e7d32" />,
                },
                {
                    invoice_quantity: cancelInvoiceList?.length,
                    invoice_status_name: "Đã hủy",
                    icon: <CancelPresentationRounded htmlColor="#d32f2f" />,
                },
            ]);

            const getBookingList = await getAllBooking(
                user?.accessToken,
                dispatch,
                axiosJWT
            );
            const pendingBookingList = getBookingList?.filter(
                (i) => i?.status === 1
            );

            // Processing invoice
            const processingBookingList = getBookingList?.filter(
                (i) =>
                    i?.status === 2 ||
                    i?.status === 3 ||
                    i?.status === 4 ||
                    i?.status === 7
            );

            // Completed invoice
            const completedBookingList = getBookingList?.filter(
                (i) => i?.status === 5
            );

            // Cancel invoice
            const cancelBookingList = getBookingList?.filter(
                (i) => i?.status === 6
            );

            setBookingList([
                {
                    invoice_quantity: pendingBookingList?.length,
                    invoice_status_name: "Chờ xác nhận",
                    icon: <TaskRounded htmlColor="#f57c00" />,
                },
                {
                    invoice_quantity: processingBookingList?.length,
                    invoice_status_name: "Đang xử lý",
                    icon: <HourglassTopRounded htmlColor="#0288d1" />,
                },
                {
                    invoice_quantity: completedBookingList?.length,
                    invoice_status_name: "Hoàn thành",
                    icon: <AssignmentTurnedInRounded htmlColor="#2e7d32" />,
                },
                {
                    invoice_quantity: cancelBookingList?.length,
                    invoice_status_name: "Đã hủy",
                    icon: <CancelPresentationRounded htmlColor="#d32f2f" />,
                },
            ]);
        };

        fetch();
    }, []);

    const navigate = useNavigate();
    const handleNavigateToBooking = () => {
        navigate("/booking");
    };

    const handleNavigateToInvoice = () => {
        navigate("/invoice");
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StatisticsCard
                                    title={"Đơn hàng"}
                                    data={invoiceList}
                                    handleNavigate={handleNavigateToInvoice}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <StatisticsCard
                                    title={"Lịch hẹn"}
                                    data={bookingList}
                                    handleNavigate={handleNavigateToBooking}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;
