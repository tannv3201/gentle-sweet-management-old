import React, { useEffect, useState } from "react";
import styles from "./BookingServiceInfo.module.scss";
import classNames from "classnames/bind";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { GFormatDate } from "../../../../../components/GDatePicker/GDatePicker";
import { PriorityHighRounded, VisibilityRounded } from "@mui/icons-material";
import GButton from "../../../../../components/MyButton/MyButton";
import BookingStatusMenu from "../BookingStatusMenu/BookingStatusMenu";
import ConfirmCancelBookingRequestPopup from "../BookingStatusMenu/ConfirmCancelBookingRequestPopup";
import { useDispatch } from "react-redux";
import { createAxios } from "../../../../../createInstance";
import { loginSuccess } from "../../../../../redux/slice/authSlice";
import { useParams } from "react-router-dom";
import { getAdminUserById } from "../../../../../redux/api/apiAdminUser";

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

function BookingServiceInfo({
    currBooking,
    currCustomerUser,
    currBookingCreator,
}) {
    const { bookingId } = useParams();

    const [bookingDetailClone, setBookingDetailClone] = useState({});
    const getBookingDetail = useSelector(
        (state) => state.bookingDetail.bookingDetail?.bookingDetailByBooking
    );
    useEffect(() => {
        if (getBookingDetail) {
            setBookingDetailClone(structuredClone(getBookingDetail));
        }
    }, [getBookingDetail]);
    const [
        isOpenConfirmCancelBookingRequestPopup,
        setIsOpenConfirmCancelInvoiceRequestPopup,
    ] = useState(false);
    const handleOpenConfirmCancelBookingRequestModal = () => {
        setIsOpenConfirmCancelInvoiceRequestPopup(true);
    };

    const handleCloseConfirmCancelBookingRequestModal = () => {
        setIsOpenConfirmCancelInvoiceRequestPopup(false);
    };

    const getAdminUser = useSelector(
        (state) => state.adminUser.adminUser?.adminUser
    );
    const user = useSelector((state) => state.auth.login?.currentUser);

    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const fetch = async () => {
            if (currBooking?.admin_user_id) {
                getAdminUserById(
                    dispatch,
                    currBooking?.admin_user_id,
                    user?.accessToken,
                    axiosJWT
                );
            }
        };
        fetch();
    }, [bookingId, currBooking?.admin_user_id]);

    return (
        <div className={cx("invoice-delivery-info-wrapper")}>
            <div className={cx("delivery-info-header")}>
                <h3>Thông tin lịch hẹn</h3>
                <div className={cx("btn-group")}>
                    {currBooking?.status > 1 && currBooking?.status < 5 && (
                        <BookingStatusMenu />
                    )}
                    {currBooking?.status === 7 && (
                        <div className={cx("cancel-request")}>
                            <PriorityHighRounded color="error" /> Yêu cầu hủy
                            lịch hẹn:
                            <div className={cx("cancel-request-action")}>
                                <GButton
                                    onClick={
                                        handleOpenConfirmCancelBookingRequestModal
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
                                currBooking?.admin_user_id
                                    ? `${getAdminUser?.last_name} 
                                      ${getAdminUser?.first_name}`
                                    : "--"
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InfoItem
                            label={"Thời gian tạo"}
                            content={GFormatDate(
                                currBooking?.created_at,
                                "DD-MM-YYYY | HH:mm"
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <div className={cx("info-item")}>
                            <span className={cx("info-item-label")}>
                                Trạng thái lịch hẹn
                            </span>
                            :{" "}
                            <span
                                className={
                                    currBooking?.status === 1
                                        ? cx("info-item-content", "pending")
                                        : currBooking?.status === 2
                                        ? cx("info-item-content", "received")
                                        : currBooking?.status === 3
                                        ? cx(
                                              "info-item-content",
                                              "product-waiting"
                                          )
                                        : currBooking?.status === 4
                                        ? cx("info-item-content", "delivering")
                                        : currBooking?.status === 5
                                        ? cx("info-item-content", "delivered")
                                        : currBooking?.status === 6
                                        ? cx("info-item-content", "cancel")
                                        : currBooking?.status === 7
                                        ? cx(
                                              "info-item-content",
                                              "cancel-pending"
                                          )
                                        : ""
                                }
                            >
                                {currBooking?.statusName}
                            </span>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={cx("info-item")}>
                            <span className={cx("info-item-label")}>
                                Ghi chú
                            </span>
                            :{" "}
                            <span className={cx("info-item-content")}>
                                {bookingDetailClone[0]?.note}
                            </span>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <ConfirmCancelBookingRequestPopup
                isOpen={isOpenConfirmCancelBookingRequestPopup}
                handleOpen={handleOpenConfirmCancelBookingRequestModal}
                handleClose={handleCloseConfirmCancelBookingRequestModal}
                currBooking={currBooking}
            />
        </div>
    );
}

export default BookingServiceInfo;
