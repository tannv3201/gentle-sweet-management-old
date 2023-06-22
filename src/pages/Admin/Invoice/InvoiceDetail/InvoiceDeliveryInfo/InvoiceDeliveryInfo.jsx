import React, { useEffect, useState } from "react";
import styles from "./InvoiceDeliveryInfo.module.scss";
import classNames from "classnames/bind";
import { Grid, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { GFormatDate } from "../../../../../components/GDatePicker/GDatePicker";
import {
    CheckCircleRounded,
    HourglassTopRounded,
    LocalShippingRounded,
    PriorityHighRounded,
    VisibilityRounded,
    WarningRounded,
} from "@mui/icons-material";
import InvoiceStatusMenu from "../InvoiceStatusMenu/InvoiceStatusMenu";
import DeliveryCodePopup from "../DeliveryCode/DeliveryCode";
import GButton from "../../../../../components/MyButton/MyButton";
import ConfirmCancelInvoiceRequestPopup from "../InvoiceStatusMenu/ConfirmCancelInvoiceRequestPopup";
import { getAdminUserById } from "../../../../../redux/api/apiAdminUser";
import { useDispatch } from "react-redux";
import { createAxios } from "../../../../../createInstance";
import { loginSuccess } from "../../../../../redux/slice/authSlice";
import { useParams } from "react-router-dom";
import { LightTooltip } from "../../../../../components/GTooltip/GTooltip";

const cx = classNames.bind(styles);

function InfoItem({ label, content }) {
    return (
        <>
            <div className={cx("info-item")}>
                <span className={cx("info-item-label")}>{label}</span>:{" "}
                <span className={cx("info-item-content")}>{content}</span>
            </div>
        </>
    );
}

function InvoiceDeliveryInfo({
    currInvoice,
    currCustomerUser,
    currInvoiceVerifier,
}) {
    const { invoiceId } = useParams();
    const [deliveryClone, setDeliveryClone] = useState({});
    const deliveryByInvoiceId = useSelector(
        (state) => state.delivery.delivery?.deliveryByInvoiceId
    );
    const [adminUser, setAdminUser] = useState({});
    const user = useSelector((state) => state.auth.login?.currentUser);
    const getAdminUser = useSelector(
        (state) => state.adminUser.adminUser?.adminUser
    );

    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const fetch = async () => {
            if (currInvoice?.admin_user_id) {
                getAdminUserById(
                    dispatch,
                    currInvoice?.admin_user_id,
                    user?.accessToken,
                    axiosJWT
                );
            }
        };
        fetch();
    }, [invoiceId, currInvoice?.admin_user_id]);

    useEffect(() => {
        if (getAdminUser) setAdminUser(structuredClone(getAdminUser));
    }, [getAdminUser]);
    useEffect(() => {
        if (deliveryByInvoiceId) {
            setDeliveryClone({
                ...deliveryByInvoiceId,
                statusName:
                    deliveryByInvoiceId?.status === 1
                        ? "Chờ xác nhận"
                        : deliveryByInvoiceId?.status === 2
                        ? "Đang chuẩn bị hàng"
                        : deliveryByInvoiceId?.status === 3
                        ? "Đang giao hàng"
                        : deliveryByInvoiceId?.status === 4
                        ? "Đã giao thành công"
                        : "",
                paymentMethodName:
                    deliveryByInvoiceId?.payment_method === 1
                        ? "Thanh toán khi nhận hàng"
                        : deliveryByInvoiceId?.payment_method === 2
                        ? "Chuyển khoản ngân hàng"
                        : deliveryByInvoiceId?.payment_method === 3
                        ? "Ví điện tử"
                        : "",
            });
        }
    }, [deliveryByInvoiceId]);

    const [isOpenDeliveryCodePopup, setIsOpenDeliveryCodePopup] =
        useState(false);
    const handleOpenDeliveryCodePopup = () => {
        setIsOpenDeliveryCodePopup(true);
    };
    const handleCloseDeliveryCodePopup = () => {
        setIsOpenDeliveryCodePopup(false);
    };

    const [
        isOpenConfirmCancelInvoiceRequestPopup,
        setIsOpenConfirmCancelInvoiceRequestPopup,
    ] = useState(false);
    const handleOpenConfirmCancelInvoiceRequestModal = () => {
        setIsOpenConfirmCancelInvoiceRequestPopup(true);
    };

    const handleCloseConfirmCancelInvoiceRequestModal = () => {
        setIsOpenConfirmCancelInvoiceRequestPopup(false);
    };

    return (
        <div className={cx("invoice-delivery-info-wrapper")}>
            <div className={cx("delivery-info-header")}>
                <h3>Thông tin đơn hàng</h3>
                <div className={cx("btn-group")}>
                    {currInvoice?.status === 3 && (
                        <GButton
                            color={"info"}
                            startIcon={<LocalShippingRounded />}
                            onClick={handleOpenDeliveryCodePopup}
                        >
                            Vận chuyển
                        </GButton>
                    )}
                    {currInvoice?.status > 1 && currInvoice?.status < 5 && (
                        <InvoiceStatusMenu />
                    )}
                    {currInvoice?.status === 7 && (
                        <div className={cx("cancel-request")}>
                            <WarningRounded htmlColor="#f57c00" /> Yêu cầu hủy
                            đơn hàng:
                            <div className={cx("cancel-request-action")}>
                                <GButton
                                    onClick={
                                        handleOpenConfirmCancelInvoiceRequestModal
                                    }
                                    color={"info"}
                                    startIcon={<VisibilityRounded />}
                                >
                                    Xem
                                </GButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx("delivery-info-body")}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Nhân viên xác nhận"}
                            content={
                                currInvoice?.admin_user_id
                                    ? getAdminUser?.name
                                    : "--"
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Thời gian tạo"}
                            content={GFormatDate(
                                currInvoice?.created_at,
                                "DD-MM-YYYY | HH:mm"
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <div className={cx("info-item")}>
                            <span className={cx("info-item-label")}>
                                Trạng thái đơn hàng
                            </span>
                            :{" "}
                            <span
                                className={
                                    currInvoice?.status === 1
                                        ? cx("info-item-content", "pending")
                                        : currInvoice?.status === 2
                                        ? cx("info-item-content", "received")
                                        : currInvoice?.status === 3
                                        ? cx(
                                              "info-item-content",
                                              "product-waiting"
                                          )
                                        : currInvoice?.status === 4
                                        ? cx("info-item-content", "delivering")
                                        : currInvoice?.status === 5
                                        ? cx("info-item-content", "delivered")
                                        : currInvoice?.status === 6
                                        ? cx("info-item-content", "cancel")
                                        : currInvoice?.status === 7
                                        ? cx(
                                              "info-item-content",
                                              "cancel-pending"
                                          )
                                        : ""
                                }
                            >
                                {currInvoice?.statusName}
                            </span>
                        </div>
                    </Grid>
                    {/* <Grid item xs={6}>
                        <div className={cx("info-item")}>
                            <span className={cx("info-item-label")}>
                                Trạng thái giao hàng
                            </span>
                            :{" "}
                            <span
                                className={
                                    currInvoice?.status !== 5 &&
                                    currInvoice?.status !== 6 &&
                                    deliveryClone?.status === 1
                                        ? cx("info-item-content", "pending")
                                        : deliveryClone?.status === 2
                                        ? cx("info-item-content", "prepare")
                                        : deliveryClone?.status === 3
                                        ? cx("info-item-content", "delivering")
                                        : deliveryClone?.status === 4
                                        ? cx("info-item-content", "completed")
                                        : ""
                                }
                            >
                                {currInvoice?.status !== 5 &&
                                currInvoice?.status !== 6
                                    ? deliveryClone?.statusName
                                    : "--"}
                            </span>
                        </div>
                    </Grid> */}
                    <Grid item xs={6}>
                        <div className={cx("delivery-code")}>
                            <InfoItem
                                label={"Mã vận đơn"}
                                content={
                                    deliveryClone?.delivery_code
                                        ? deliveryClone?.delivery_code
                                        : "--"
                                }
                            />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Đơn vị giao hàng"}
                            content={
                                deliveryClone?.delivery_unit
                                    ? deliveryClone?.delivery_unit
                                    : "--"
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <div className={cx("payment-method-wrapper")}>
                            <InfoItem
                                label={"Phương thức thanh toán"}
                                content={currInvoice?.paymentMethodName}
                            />
                            {currInvoice?.payment_method > 1 && (
                                <div>
                                    <LightTooltip
                                        title={
                                            currInvoice?.paid === 1
                                                ? "Chờ thanh toán"
                                                : currInvoice?.paid === 2
                                                ? "Đã thanh toán"
                                                : currInvoice?.paid === 3
                                                ? "Chờ hoàn tiền"
                                                : currInvoice?.paid === 4
                                                ? "Đã hoàn tiền"
                                                : ""
                                        }
                                        placement="right"
                                    >
                                        {currInvoice?.paid === 1 ? (
                                            <IconButton>
                                                <HourglassTopRounded htmlColor="#f57c00" />
                                            </IconButton>
                                        ) : (
                                            <IconButton>
                                                <CheckCircleRounded htmlColor="#2e7d32" />
                                            </IconButton>
                                        )}
                                    </LightTooltip>
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Nội dung chuyển khoản"}
                            content={currInvoice?.bank_transfer_content}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Ghi chú"}
                            content={
                                currInvoice?.note ? currInvoice?.note : "--"
                            }
                        />
                    </Grid>
                </Grid>
            </div>
            <DeliveryCodePopup
                isOpen={isOpenDeliveryCodePopup}
                handleOpen={handleOpenDeliveryCodePopup}
                handleClose={handleCloseDeliveryCodePopup}
            />
            <ConfirmCancelInvoiceRequestPopup
                isOpen={isOpenConfirmCancelInvoiceRequestPopup}
                handleOpen={handleOpenConfirmCancelInvoiceRequestModal}
                handleClose={handleCloseConfirmCancelInvoiceRequestModal}
                currInvoice={currInvoice}
            />
        </div>
    );
}

export default InvoiceDeliveryInfo;
