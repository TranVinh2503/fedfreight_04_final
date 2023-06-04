import classNames from 'classnames/bind';
import styles from './OrderList.module.scss';
import icons from '~/assets/icons/icons';
import UserBox from '~/components/UserBox';
import Button from '~/components/Button';
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '~/Context/OrderContext';

const cx = classNames.bind(styles);

function OrderList() {
    const { setOrder } = useContext(OrderContext);

    const [orders, setOrders] = useState();

    useEffect(() => {
        fetch('http://localhost:8000/getOrder')
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleShowOrderDetails = (e) => {
        setOrder(e);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('content-heading')}>Danh sách đơn hàng</div>

                    <table className={cx('list-table')}>
                        <tr>
                            <th className={cx('column4')}>
                                <p>Tên người dùng</p>
                            </th>
                            <th className={cx('column4')}>
                                <p>Thời gian</p>
                            </th>
                            <th className={cx('column2')}>
                                <p>Kiểm tra chi tiết</p>
                            </th>
                        </tr>
                        {orders?.map((order, index) => {
                            return (
                                <tr key={index}>
                                    <td>{order.customerName}</td>
                                    <td>{order.time}</td>
                                    <td>
                                        <span>
                                            <Button
                                                detail
                                                option
                                                to="/orderDetail"
                                                onClick={() => handleShowOrderDetails(order.id)}
                                            >
                                                Chi tiết
                                            </Button>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderList;
