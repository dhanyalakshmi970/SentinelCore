import { useAuth } from "../context/AuthContext";

import {
    Button
} from "@mui/material";


function AssetControls() {

    const {
        isAdmin,
        roles
    } = useAuth();


    console.log(
        "AssetControls roles:",
        roles
    );

    console.log(
        "AssetControls isAdmin:",
        isAdmin
    );


    // ==========================================
    // Only Admin can see Add Asset
    // ==========================================

    if (!isAdmin) {

        return null;

    }


    return (

        <Button
            variant="contained"
            color="primary"
        >
            Add Asset
        </Button>

    );

}


export default AssetControls;