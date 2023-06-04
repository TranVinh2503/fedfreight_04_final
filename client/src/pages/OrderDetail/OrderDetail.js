import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import UserBox from '~/components/UserBox';
import Button from '~/components/Button';
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '~/Context/OrderContext';
import axios from 'axios';

const cx = classNames.bind(styles);

function OrderDetail() {
    const { order } = useContext(OrderContext);
    const [orderDetail, setOrderDetail] = useState([]);
    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                const res = await axios.get('http://localhost:8000/getOrderDetail/' + order);
                console.log(res.data);
                setOrderDetail(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getOrderDetail();
    }, [order]);
    console.log(order);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('content-heading')}>Thông tin đơn hàng</div>
                    <div className={cx('input-field')}>
                        {orderDetail.length > 0 && (
                            <>
                                <div className={cx('sender')}>
                                    <div className={cx('heading')}>Việt Nam</div>
                                    <div className={cx('detail')}>
                                        Người gửi: <strong>{orderDetail[0]?.senderNameVN}</strong>
                                    </div>
                                    <div className={cx('detail')}>
                                        Số điện thoại: <strong>{orderDetail[0]?.phoneVN}</strong>
                                    </div>
                                    <div className={cx('detail')}>
                                        Địa chỉ gửi hàng: <strong>{orderDetail[0]?.senderAddress}</strong>
                                    </div>
                                    <div className={cx('detail')}>
                                        Chi nhánh gửi hàng: <strong>{orderDetail[0]?.shipBranch}</strong>
                                    </div>
                                </div>
                                <div className={cx('receiver')}>
                                    <div className={cx('heading')}>Hàn Quốc</div>
                                    <div className={cx('detail')}>
                                        Người gửi: <strong>{orderDetail[0]?.receiverNameHQ}</strong>
                                    </div>
                                    <div className={cx('detail')}>
                                        Số điện thoại: <strong>{orderDetail[0]?.phoneHQ}</strong>
                                    </div>
                                    <div className={cx('detail')}>
                                        Địa chỉ gửi hàng: <strong>{orderDetail[0]?.receiverAddress}</strong>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={cx('order')}>
                            <div className={cx('order-container')}>
                                <div className={cx('order-note')}>
                                    <div className={cx('sub-heading')}>Mục ghi chú (Không bắt buộc)</div>
                                    <textarea value={orderDetail[0]?.note} readOnly></textarea>
                                </div>
                                {orderDetail.length > 0 &&
                                    JSON.parse(orderDetail[0]?.product).map((value, index) => {
                                        return (
                                            <div className={cx('order-info')} key={index}>
                                                <table>
                                                    <tr>
                                                        <th className={cx('column9')}>
                                                            <span className={cx('sub-heading')}>Nhập tên mặt hàng</span>
                                                        </th>
                                                        <th className={cx('column1')} style={{ textAlign: 'center' }}>
                                                            Số lượng
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input type="text" readOnly value={value.name}></input>
                                                        </td>
                                                        <td>
                                                            <input type="text" readOnly value={value.quantity}></input>
                                                        </td>
                                                    </tr>
                                                </table>
                                                {/* <Button contact>Xác nhận</Button> */}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
