import React, { useEffect, useState } from "react";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import TextField from "../../common/form/textField";
import MultiSelectedField from "../../common/form/multiSelectField";
import { validator } from "../../../utils/validator";
import api from "../../../api";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const ChangeForm = ({ userId }) => {
    const [data, setData] = useState();

    const [errors, setErrors] = useState({});
    const [profession, setProfession] = useState();
    const [qualities, setQualities] = useState({});

    const history = useHistory();

    useEffect(() => {
        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfession(professionsList);
        });
        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                value: data[optionName]._id,
                label: data[optionName].name,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        });
    }, []);
    useEffect(() => {
        api.users.getById(userId).then((data) => {
            const qualitiesList = data.qualities.map((qualitie) => ({
                value: qualitie._id,
                label: qualitie.name,
                color: qualitie.color
            }));
            setData({
                email: data.email,
                name: data.name,
                profession: data.profession._id,
                sex: data.sex,
                qualities: qualitiesList
            });
        });
    }, []);
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const getProfessionById = (id) => {
        console.log(id);
        for (const prof of profession) {
            if (prof.value === id) {
                return { _id: prof.value, name: prof.label };
            }
        }
    };

    const getQualities = (elements) => {
        const qualitiesArray = [];
        for (const elem of elements) {
            for (const quality in qualities) {
                if (elem.value === qualities[quality].value) {
                    qualitiesArray.push({
                        _id: qualities[quality].value,
                        name: qualities[quality].label,
                        color: qualities[quality].color
                    });
                }
            }
        }
        return qualitiesArray;
    };

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(data);
        const { profession, qualities } = data;
        console.log(profession, getProfessionById(profession));
        api.users.update(userId, {
            ...data,
            profession: getProfessionById(profession),
            qualities: getQualities(qualities)
        });
        history.push(`/users`);
    };

    const validatorConfig = {
        name: {
            isRequired: {
                message: "Имя пользователя не введено"
            },
            isSurname: {
                message: "Введите фамилию"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email Введен не коректно"
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберете профессию"
            }
        }
    };
    if (data && profession) {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 .offset-md-3 shadow p-4">
                        <form onSubmit={handleSubmit}>
                            <TextField
                                name="name"
                                value={data.name}
                                label="Имя Фамилия"
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                label="email"
                                error={errors.email}
                            />
                            <SelectField
                                defaultOption="Choose..."
                                name="profession"
                                onChange={handleChange}
                                options={profession}
                                value={data.profession}
                                error={errors.profession}
                                label="Выберите вашу профессию"
                            />
                            <RadioField
                                options={[
                                    { name: "Мужской", value: "male" },
                                    { name: "Женский", value: "female" },
                                    { name: "Другой", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                            />
                            <MultiSelectedField
                                options={qualities}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                                defaultValue={data.qualities}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary w-100
                            mx-auto"
                                disabled={!isValid}
                            >
                                Обновить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

ChangeForm.propTypes = {
    userId: PropTypes.string
};

export default ChangeForm;
