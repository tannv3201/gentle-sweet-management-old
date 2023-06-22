import React, { useEffect } from "react";

import classNames from "classnames/bind";
import styles from "./StatisticsCard.module.scss";

import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

function StatisticsCard({ title, data, handleNavigate }) {
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
                                <div
                                    className={cx("children-item")}
                                    onClick={handleNavigate}
                                >
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
