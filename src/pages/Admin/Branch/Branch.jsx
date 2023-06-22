import React from "react";
import { useState } from "react";
import BranchList from "./BranchList";
import CreateUpdateBranchModal from "./CreateUpdateBranchModal";

export default function Branch() {
    const [isOpenModelCreateUpdate, setIsOpenModelCreateUpdate] =
        useState(false);

    const handleOpenModal = () => {
        setIsOpenModelCreateUpdate(true);
    };

    const handleCloseModal = () => {
        setIsOpenModelCreateUpdate(false);
    };

    return (
        <>
            <BranchList />
            <CreateUpdateBranchModal
                isOpen={isOpenModelCreateUpdate}
                handleOpen={handleOpenModal}
                handleClose={handleCloseModal}
            />
        </>
    );
}
