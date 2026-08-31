
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";

function AssetControls() {

    const { isAdmin } = useAuth();

    return (
        <>
            {isAdmin && (
                <Button
                    variant="contained"
                    color="primary"
                >
                    Add Asset
                </Button>
            )}
        </>
    );
}

export default AssetControls;