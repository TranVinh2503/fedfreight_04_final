import classNames from 'classnames/bind';
import styles from './UserBox.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function UserBox({ chatbox = false, search = false, interactiveUser = false, avatarId, idUser, content }) {
    let id = JSON.stringify(avatarId).replaceAll('"', '');
    const [name, setName] = useState('');
    const [avatarUrl,setAvatarUrl] = useState()
    useEffect(() => {
        const getConversations = async () => {
            try {
                await fetch('http://localhost:8000/user/' + idUser)
                    .then((res) => res.json())
                    .then((data) => {
                        setName(data.userName);
                        setAvatarUrl(data.avatarUrl)
                    });
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [idUser]);

    const classes = cx('wrapper', {
        chatbox,
        search,
        interactiveUser,
    });
    return (
        <div className={classes}>
            <img src={`http://localhost:8000/avatarUser/${avatarUrl}`} alt="" className={cx('customer-avatar')}></img>
            <div className={cx('customer-details')}>
                <div className={cx('customer-name')}>{name}</div>
                <div className={cx('customer-text')}>{content}</div>
            </div>
        </div>
    );
}

export default UserBox;
