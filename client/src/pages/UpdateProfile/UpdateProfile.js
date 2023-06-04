import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images/images';
import { useContext, useEffect } from 'react';
import { AppContext } from '~/Context/AppContext';
import { useState } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);
function UpdateProfile() {
    const { user } = useContext(AppContext);
    const [userName, setUserName] = useState(user?.user);

    const [selectedFile, setSelectedFile] = useState();
    const [previewUrl, setPreviewUrl] = useState(null);

    const [fullName, setFullName] = useState(user?.fullName);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [birthday, setBirthday] = useState(user?.birthday);
    const [role, setRole] = useState();
    console.log(birthday);

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
    const [birthdayErrorMessage, setBirthdayErrorMessage] = useState('');
    const [updateErrorMessage, setUpdateErrorMessage] = useState('');
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');

    useEffect(() => {
        console.log(user);
        const handleFunction = async () => {
            if (user?.avatarUrl) {
                try {
                    const url = `http://localhost:8000/avatarUser/${user?.avatarUrl}`;
                    const blobResponse = await fetch(url);
                    const blob = await blobResponse.blob();
                    setPreviewUrl(URL.createObjectURL(blob));
                } catch (error) {
                    console.log(error);
                }
            }
        };
        handleFunction();
    }, [user?.avatarUrl, user]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        console.log(file);

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // if (user?.userName && fullName && phone?.toString() && birthday) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('userName', user?.userName);
        formData.append('userId', user?.id);
        formData.append('role', user?.userType);
        formData.append('fullName', fullName);
        formData.append('phone', phone?.toString());
        formData.append('birthday', birthday);

        if (firstName === '') {
            setFirstNameErrorMessage('Vui lòng nhập tên');
        } else {
            setFirstNameErrorMessage(' ');
        }
        if (lastName === '') {
            setLastNameErrorMessage('Vui lòng nhập họ');
        } else {
            setLastNameErrorMessage(' ');
        }
        if (phone.toString() === '') {
            setPhoneErrorMessage('Vui lòng nhập số điện thoại');
        } else {
            setPhoneErrorMessage(' ');
        }
        if (birthday === undefined) {
            setBirthdayErrorMessage('Vui lòng chọn ngày sinh');
        } else {
            setBirthdayErrorMessage(' ');
        }

        try {
            const response = await axios.post('http://localhost:8000/updateInfo', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!response.data.url) {
                const url = `http://localhost:8000/avatarUser/${user?.avatarUrl}`;
                const blobResponse = await fetch(url);
                const blob = await blobResponse.blob();
                setPreviewUrl(URL.createObjectURL(blob));
            } else {
                setPreviewUrl(response.data.url || selectedFile);
            }

            setUpdateErrorMessage('');
            setUpdateSuccessMessage('Cập nhật thông tin thành công');
        } catch (error) {
            console.error(error);
            setUpdateSuccessMessage('');
            setUpdateErrorMessage('Cập nhật thông tin không thành công');
        }
        // } else {
        //     alert('Vui lòng nhập đầu đủ thông tin');
        // }
    };
    const handleFullNameChange = (firstName, lastName) => {
        const fullNameTmp = `${lastName} ${firstName}`;
        if (firstName && lastName) {
            setFullName(fullNameTmp);
        }
    };
    useEffect(() => {
        if (fullName) {
            const tmp = fullName;
            const nameArray = tmp.split(' ');
            console.log(nameArray);

            const firstName = nameArray[nameArray.length - 1];
            const lastName = nameArray[0];

            setFirstName(firstName);
            setLastName(lastName);

            setFullName(`${lastName} ${firstName}`);
        }
    }, [firstName, lastName, fullName, user]);

    const isContributor = () => {
        if (user?.role === 'contributor') {
            return true;
        } else {
            return false;
        }
    };

    const isPhoneNumber = (value) => {
        const regexVietnamPhone = /^(\+84|0)[1-9]\d{8,9}$/;
        const regexKoreanPhone = /^(\+82|0)[1-9]\d{8,9}$/;
        return regexVietnamPhone.test(value) || regexKoreanPhone.test(value);
    };
    function handleFirstName(e) {
        const value = e.target.value;

        if (value === '') {
            setFirstNameErrorMessage('Vui lòng nhập tên');
        } else {
            setFirstNameErrorMessage('');
        }
    }

    function handleLastName(e) {
        const value = e.target.value;

        if (value === '') {
            setLastNameErrorMessage('Vui lòng nhập họ');
        } else {
            setLastNameErrorMessage('');
        }
    }

    function handlePhoneNumber(e) {
        const value = e.target.value;
        setPhone(value);

        if (value === '') {
            setPhoneErrorMessage('Vui lòng nhập số điện thoại');
        } else if (!isPhoneNumber(value)) {
            setPhoneErrorMessage('Số điện thoại không hợp lệ');
        } else {
            setPhoneErrorMessage('');
        }
    }

    useEffect(() => {
        if (user?.userType === 'customer') {
            setRole('Khách hàng');
        } else {
            setRole('Người trung gian');
        }
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('column1')}>
                        {fullName === null || firstName === null || lastName === null ? (
                            <div className={cx('name')}>Chưa có họ và tên </div>
                        ) : (
                            <div className={cx('name')}>{fullName}</div>
                        )}

                        <div className={cx('nick-name')}>{userName}</div>
                        {isContributor ? (
                            <div className={cx('role')}>{role}</div>
                        ) : (
                            <div className={cx('role')}>Khách hàng</div>
                        )}
                        <form>
                            {previewUrl && <img className={cx('avatar')} src={previewUrl} alt="Avatar Preview" />}
                            <input type="file" id="avatar" onChange={handleFileSelect} />
                            <label htmlFor="avatar">Thay đổi ảnh</label>
                        </form>
                    </div>
                    <div className={cx('column2')}>
                        <div className={cx('heading')}>Thông tin cá nhân</div>
                        <form className={cx('input-form')}>
                            <div>
                                <label className={cx('title')}>Họ</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        handleLastName(e);
                                        handleFullNameChange(firstName, e.target.value);
                                    }}
                                ></input>
                                {lastNameErrorMessage && <span className={cx('error')}>{lastNameErrorMessage}</span>}
                            </div>
                            <div>
                                <label className={cx('title')}>Tên</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        handleFirstName(e);
                                        handleFullNameChange(e.target.value, lastName);
                                    }}
                                ></input>
                                {firstNameErrorMessage && <span className={cx('error')}>{firstNameErrorMessage}</span>}
                            </div>
                            <div>
                                <label className={cx('title')}>Tên hiển thị</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={user?.userName}
                                    readOnly
                                ></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Số điện thoại</label>
                                <input
                                    defaultValue={user?.phone}
                                    type="text"
                                    className={cx('input')}
                                    value={phone}
                                    onChange={handlePhoneNumber}
                                ></input>
                                {phoneErrorMessage && <span className={cx('error')}>{phoneErrorMessage}</span>}
                            </div>
                            <div>
                                <label className={cx('title')}>Ngày sinh</label>
                                <input
                                    type="date"
                                    className={cx('input')}
                                    defaultValue={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                ></input>
                                {birthdayErrorMessage && <span className={cx('error')}>{birthdayErrorMessage}</span>}
                            </div>
                            <div>
                                <label className={cx('title')}>Email</label>
                                <input type="text" className={cx('input')} defaultValue={user?.mail} readOnly></input>
                            </div>
                        </form>
                        <Button onClick={handleSubmit} update>
                            Cập nhật
                        </Button>
                        {updateErrorMessage && <h2 className={cx('error')}>{updateErrorMessage}</h2>}
                        {updateSuccessMessage && <h2 className={cx('success')}>{updateSuccessMessage}</h2>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
