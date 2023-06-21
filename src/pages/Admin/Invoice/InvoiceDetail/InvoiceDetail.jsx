import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";
import styles from "./InvoiceDetail.module.scss";
import classNames from "classnames/bind";
import dayjs from "dayjs";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GButton from "../../../../components/MyButton/MyButton";
import { ArrowBackIosNew, ModeEditOutlineRounded } from "@mui/icons-material";

import { useParams } from "react-router-dom";
import utc from "dayjs/plugin/utc";

import { createAxios } from "../../../../createInstance";
import { loginSuccess } from "../../../../redux/slice/authSlice";
import { getInvoiceById } from "../../../../redux/api/apiInvoice";
import { getAdminUserById } from "../../../../redux/api/apiAdminUser";
import InvoiceDetailList from "./InvoiceDetailList";
import { getInvoiceDetailByInvoiceId } from "../../../../redux/api/apiInvoiceDetail";
import ConfirmPopup from "./ConfirmInvoice/ConfirmPopup";
import CancelPopup from "./ConfirmInvoice/CancelPopup";
import { getDeliveryByInvoiceId } from "../../../../redux/api/apiDelivery";
import InvoiceCustomerInfo from "./InvoiceCustomerInfo/InvoiceCustomerInfo";
import InvoiceDeliveryInfo from "./InvoiceDeliveryInfo/InvoiceDeliveryInfo";
import ConfirmPaid from "./ConfirmInvoice/ConfirmPaid";
import ConfirmRefund from "./ConfirmInvoice/ConfirmRefund";

const cx = classNames.bind(styles);
export default function InvoiceDetail() {
    const { invoiceId } = useParams();
    dayjs.extend(utc);
    const [isEditting, setIsEditting] = useState(false);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [currInvoiceVerifier, setCurrInvoiceVerifier] = useState({});
    const [currInvoice, setCurrInvoice] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const customerUserList = useSelector(
        (state) => state.customerUser.customerUser?.customerUserList
    );

    const getInvoice = useSelector((state) => state.invoice.invoice?.invoice);

    const getInvoiceDetail = useSelector(
        (state) => state.invoiceDetail.invoiceDetail?.invoiceDetailByInvoice
    );
    useEffect(() => {
        setCurrInvoice(
            structuredClone({
                ...getInvoice,
                statusName:
                    getInvoice?.status === 1
                        ? "Chờ tiếp nhận"
                        : getInvoice?.status === 2
                        ? "Đã tiếp nhận"
                        : getInvoice?.status === 3
                        ? "Chờ lấy hàng"
                        : getInvoice?.status === 4
                        ? "Đang vận chuyển"
                        : getInvoice?.status === 5
                        ? "Đã giao"
                        : getInvoice?.status === 6
                        ? "Đã hủy"
                        : getInvoice?.status === 7
                        ? "Yêu cầu hủy đơn"
                        : "",
                paymentMethodName:
                    getInvoice?.payment_method === 1
                        ? "Thanh toán khi nhận hàng"
                        : getInvoice?.payment_method === 2
                        ? "Chuyển khoản ngân hàng"
                        : getInvoice?.payment_method === 3
                        ? "Ví điện tử"
                        : "",
                customerName:
                    getInvoice?.last_name + " " + getInvoice?.first_name,
            })
        );
    }, [getInvoice]);

    useEffect(() => {
        const fetchData = async () => {
            await getInvoiceDetailByInvoiceId(
                dispatch,
                invoiceId,
                user?.accessToken,
                axiosJWT
            );
            const invoice = await getInvoiceById(
                dispatch,
                invoiceId,
                user?.accessToken,
                axiosJWT
            );

            await getDeliveryByInvoiceId(
                dispatch,
                invoiceId,
                user?.accessToken,
                axiosJWT
            );
        };

        fetchData();
    }, [invoiceId]);

    const handleBack = () => {
        navigate("/invoice");
    };

    // Confirm invoice
    const [isOpenConfirmInvoice, setIsOpenConfirmInvoice] = useState(false);

    const handleOpenConfirmInvoice = () => {
        setIsOpenConfirmInvoice(true);
    };

    const handleCloseConfirmInvoice = () => {
        setIsOpenConfirmInvoice(false);
    };

    // Confirm paid
    const [isOpenConfirmPaid, setIsOpenConfirmPaid] = useState(false);

    const handleOpenConfirmPaid = () => {
        setIsOpenConfirmPaid(true);
    };

    const handleCloseConfirmPaid = () => {
        setIsOpenConfirmPaid(false);
    };

    // Confirm refund
    const [isOpenConfirmRefund, setIsOpenConfirmRefund] = useState(false);

    const handleOpenConfirmRefund = () => {
        setIsOpenConfirmRefund(true);
    };

    const handleCloseConfirmRefund = () => {
        setIsOpenConfirmRefund(false);
    };

    // Cancel invoice
    const [isOpenCancelInvoice, setIsOpenCancelInvoice] = useState(false);

    const handleOpenCancelInvoice = () => {
        setIsOpenCancelInvoice(true);
    };

    const handleCloseCancelInvoice = () => {
        setIsOpenCancelInvoice(false);
    };
    console.log(currInvoice);

    return (
        <>
            <GButton onClick={handleBack} startIcon={<ArrowBackIosNew />}>
                Trở lại
            </GButton>
            <div className={cx("wrapper")}>
                <div className={cx("invoice-info-header")}>
                    <Grid container>
                        <Grid item xs={6}>
                            <div className={cx("invoice-title")}>
                                <span className={cx("title")}>
                                    ĐƠN HÀNG #{invoiceId}
                                </span>
                            </div>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            display={"flex"}
                            justifyContent={"flex-end"}
                            alignItems={"center"}
                        >
                            <div className={cx("button-list")}>
                                {currInvoice?.status === 1 &&
                                    currInvoice?.payment_method !== 1 &&
                                    currInvoice?.paid === 1 &&
                                    getInvoiceDetail?.length > 0 && (
                                        <GButton
                                            onClick={handleOpenConfirmPaid}
                                        >
                                            Xác nhận chuyển khoản
                                        </GButton>
                                    )}
                                {currInvoice?.paid === 3 && (
                                    <GButton onClick={handleOpenConfirmRefund}>
                                        Xác nhận hoàn tiền
                                    </GButton>
                                )}
                                {currInvoice?.status === 1 &&
                                    getInvoiceDetail?.length > 0 &&
                                    (currInvoice?.paid === 2 ||
                                        currInvoice?.payment_method === 1) && (
                                        <>
                                            <GButton
                                                onClick={
                                                    handleOpenConfirmInvoice
                                                }
                                                color={"success"}
                                            >
                                                Xác nhận
                                            </GButton>
                                        </>
                                    )}
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <InvoiceCustomerInfo currInvoice={currInvoice} />
                <InvoiceDeliveryInfo
                    currInvoice={currInvoice}
                    currInvoiceVerifier={currInvoiceVerifier}
                />
                <InvoiceDetailList isEditting={isEditting} />
                <ConfirmPopup
                    isOpen={isOpenConfirmInvoice}
                    handleOpen={handleOpenConfirmInvoice}
                    handleClose={handleCloseConfirmInvoice}
                    selectedInvoice={{
                        invoice_id: invoiceId,
                        customer_name: currInvoice?.customerName,
                    }}
                />

                <CancelPopup
                    isOpen={isOpenCancelInvoice}
                    handleOpen={handleOpenCancelInvoice}
                    handleClose={handleCloseCancelInvoice}
                    selectedInvoice={{
                        invoice_id: invoiceId,
                        customer_name: currInvoice?.customerName,
                    }}
                />

                <ConfirmPaid
                    isOpen={isOpenConfirmPaid}
                    handleClose={handleCloseConfirmPaid}
                    handleOpen={handleOpenConfirmPaid}
                    currInvoice={currInvoice}
                />

                <ConfirmRefund
                    isOpen={isOpenConfirmRefund}
                    handleClose={handleCloseConfirmRefund}
                    handleOpen={handleOpenConfirmRefund}
                    currInvoice={currInvoice}
                />
            </div>
        </>
    );
}
