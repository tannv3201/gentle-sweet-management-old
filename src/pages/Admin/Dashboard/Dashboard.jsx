import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { provinceApi } from "../../../redux/api/apiProvinceOpenAPI";

function Dashboard() {
    const getProvinceList = structuredClone(
        useSelector((state) => state.province.province.provinceList)
    );
    const dispatch = useDispatch();
    // Get province list from API
    useEffect(() => {
        if (getProvinceList?.length === 0) {
            provinceApi(dispatch);
        }
    }, []);
    return <h1>Dashboard</h1>;
}

export default Dashboard;
