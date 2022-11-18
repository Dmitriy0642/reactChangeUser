import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Qualities from "../../ui/qualities";
import { useHistory } from "react-router-dom";
import ChangeForm from "../userForm/changeForm";

const UserPage = ({ userId, edit }) => {
    const history = useHistory();
    const [user, setUser] = useState();

    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
    }, []);

    const handleClick = () => {
        history.push(`/users/${userId}/edit`);
    };
    if (user) {
        if (!edit) {
            return (
                <div>
                    <h1> {user.name}</h1>
                    <h2>Профессия: {user.profession.name}</h2>
                    <Qualities qualities={user.qualities} />
                    <p>completedMeetings: {user.completedMeetings}</p>
                    <h2>Rate: {user.rate}</h2>
                    <button onClick={handleClick}> Изменить</button>
                </div>
            );
        } else {
            return <ChangeForm userId={userId} />;
        }
    } else {
        return <h1>Loading...</h1>;
    }
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired,
    edit: PropTypes.string
};

export default UserPage;
