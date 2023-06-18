import React, { useEffect } from "react";

import classNames from "classnames/bind";
import styles from "./StatisticsCard.module.scss";
import {
    AssignmentTurnedInRounded,
    CancelPresentationRounded,
    DescriptionRounded,
    HourglassTopRounded,
    TaskRounded,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
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

function StatisticsCard({ title, data }) {
    return (
        <>
            <div className={cx("statistics-card-wrapper")}>
                <div className={cx("header")}>
                    <span className={cx("header-title")}>{title}</span>
                </div>
                <div className={cx("body")}>
                    <Grid container spacing={1.5}>
                        {data?.map((invoice, idx) => (
                            <Grid key={idx} item xs={3}>
                                <div className={cx("children-item")}>
                                    <div className={cx("children-item-header")}>
                                        {invoice?.icon}
                                        <span className={cx("item-title")}>
                                            {invoice?.invoice_status_name}
                                        </span>
                                    </div>
                                    <div className={cx("children-item-body")}>
                                        <div className={cx("quantity")}>
                                            {invoice?.invoice_quantity}
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default StatisticsCard;
