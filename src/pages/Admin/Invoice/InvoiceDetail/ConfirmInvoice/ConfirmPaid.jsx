import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../../createInstance";
import { loginSuccess } from "../../../../../redux/slice/authSlice";
import GModal from "../../../../../components/GModal/GModal";
import GButton from "../../../../../components/MyButton/MyButton";
import { updateInvoice } from "../../../../../redux/api/apiInvoice";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IconButton } from "@mui/material";
import { ContentCopyRounded } from "@mui/icons-material";

function ConfirmPaid({ handleClose, handleOpen, isOpen, currInvoice }) {
    const { invoiceId } = useParams();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(currInvoice?.bank_transfer_content)
            .then(() => {
                toast.success("Đã sao chép");
            })
            .catch((error) => {
                console.error("Lỗi khi sao chép:", error);
            });
    };

    const handleCancelInvoice = async () => {
        await updateInvoice(
            user?.accessToken,
            dispatch,
            invoiceId,
            { paid: 2 },
            axiosJWT
        ).then(() => {
            toast.success("Xác nhận thanh toán thành công");
            handleClose();
        });
    };

    return (
        <>
            <GModal
                handleClose={() => {
                    handleClose();
                }}
                handleOpen={handleOpen}
                isOpen={isOpen}
                title="Xác nhận đã thanh toán"
            >
                <div>
                    <div style={{ padding: "12px 8px", width: "450px" }}>
                        <span style={{ fontWeight: "var(--fw-medium)" }}>
                            {" "}
                            {`Nội dung chuyển khoản đơn hàng #${invoiceId}: `}
                        </span>
                        <div
                            style={{
                                fontWeight: "var(--fw-medium)",
                                fontSize: "1.8rem",
                            }}
                        >
                            {currInvoice?.bank_transfer_content}
                            <IconButton onClick={copyToClipboard}>
                                <ContentCopyRounded />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{ paddingTop: "24px" }}>
                        <GButton
                            color={"success"}
                            onClick={handleCancelInvoice}
                        >
                            Xác nhận
                        </GButton>
                        <GButton
                            color={"text"}
                            style={{ marginLeft: "12px" }}
                            onClick={handleClose}
                        >
                            Hủy
                        </GButton>
                    </div>
                </div>
            </GModal>
        </>
    );
}

export default ConfirmPaid;
