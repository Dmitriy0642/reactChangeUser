import React from "react";
import { useParams } from "react-router-dom";
import UserPage from "../components/page/usersPage";
import UsersListPage from "../components/page/userListPage";

const Users = () => {
    const params = useParams();
    const { userId, edit } = params;

    return (
        <>
            {userId ? (
                <UserPage userId={userId} edit={edit} />
            ) : (
                <UsersListPage />
            )}
        </>
    );
};

export default Users;
