import toast from "react-hot-toast";

import {
    createBranchFailed,
    createBranchStart,
    createBranchSuccess,
    getBranchByIdFailed,
    getBranchByIdStart,
    getBranchByIdSuccess,
    getAllBranchFailed,
    getAllBranchStart,
    getAllBranchSuccess,
    updateBranchFailed,
    updateBranchStart,
    updateBranchSuccess,
} from "../slice/branchSlice";
import axios from "axios";

export const getBranchById = async (dispatch, id, accessToken, axiosJWT) => {
    dispatch(getBranchByIdStart());
    try {
        const res = await axiosJWT.get("/v1/branch/" + id, {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        dispatch(getBranchByIdSuccess(res?.data));
        if (res?.data?.status === 200) {
            toast.success(res?.data?.msg);
        }
        return res?.data;
    } catch (error) {
        dispatch(getBranchByIdFailed(error.response?.data));
    }
};

export const getAllBranch = async (dispatch) => {
    dispatch(getAllBranchStart());
    try {
        const res = await axios.get("/v1/branch");
        dispatch(getAllBranchSuccess(res?.data));
        return res?.data?.length;
    } catch (error) {
        dispatch(getAllBranchFailed());
    }
};

export const createBranch = async (
    accessToken,
    dispatch,
    branchData,
    axiosJWT
) => {
    dispatch(createBranchStart());
    try {
        const res = await axiosJWT.post("/v1/branch", branchData, {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        dispatch(createBranchSuccess(res?.data));
        if (res?.data?.status === 201) {
            toast.success(res?.data?.msg);
            await getAllBranch(accessToken, dispatch, axiosJWT);
        }
    } catch (error) {
        dispatch(createBranchFailed(error.response?.data));
    }
};

export const updateBranch = async (
    accessToken,
    dispatch,
    id,
    branchData,
    axiosJWT
) => {
    dispatch(updateBranchStart());
    try {
        const res = await axiosJWT.put("/v1/branch/" + id, branchData, {
            headers: {
                token: `Bearer ${accessToken}`,
            },
        });
        dispatch(updateBranchSuccess(res?.data));
        if (res?.data?.status === 200) {
            toast.success(res?.data?.msg);
            await getAllBranch(accessToken, dispatch, axiosJWT);
        }
    } catch (error) {
        dispatch(updateBranchFailed(error.response?.data));
    }
};
