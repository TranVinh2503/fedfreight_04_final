import classNames from 'classnames/bind';
import styles from './UpdateOrder.module.scss';
import Tippy from '@tippyjs/react/headless';
import UserBox from '~/components/UserBox';
import Button from '~/components/Button';
import 'tippy.js/dist/tippy.css';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '~/Context/AppContext';
const cx = classNames.bind(styles);

function UpdateOrder() {
    const { user } = useContext(AppContext);
    const [product, setProduct] = useState();
    const [contributor, setContributor] = useState();
    const [rows, setRows] = useState([{ name: '', quantity: '' }]);
    const [senderNameVN, setSenderNameVN] = useState('');
    const [senderNameHQ, setSenderNameHQ] = useState('');
    const [phoneVN, setPhoneVN] = useState('');
    const [phoneHQ, setPhoneHQ] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [shipBranch, setShipBranch] = useState('Ha Noi');
    const [note, setNote] = useState('');
    const [productDetail, setProductDetail] = useState();

    useEffect(() => {
        const getOrderInitial = async () => {
            try {
                const res = await axios.get('http://localhost:8000/OrderInitial/' + user.id);
                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getOrderInitial();
    }, [user?.id]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                setContributor(product[0].contributorId);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [contributor, product]);

    const handleAddRow = () => {
        setRows([...rows, { name: '', quantity: '' }]);
    };
    const handleSave = async () => {
        const details = rows.map((row) => ({
            name: row.name,
            quantity: row.quantity,
        }));
        setProductDetail(details);

        const productInfo = {
            senderNameVN: senderNameVN,
            senderNameHQ: senderNameHQ,
            phoneVN: phoneVN,
            phoneHQ: phoneHQ,
            senderAddress: senderAddress,
            receiverAddress: receiverAddress,
            shipBranch: shipBranch,
            note: note,
            productDetail: details,
            orderId: product[0]?.id,
        };
        try {
            const res = await axios.post('http://localhost:8000/saveProductInfo', productInfo);
            alert("Cập nhật thành công")
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('content-heading')}>Cập nhật trạng thái đơn hàng</div>
                    <Tippy
                        placement="bottom"
                        interactive
                        render={(attrs) => (
                            <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                <PopperWrapper>
                                    <h4 className={cx('search-title')}>Kết quả phù hợp</h4>
                                    <UserBox search avatarId="mono" name="Moi Moi Moi" content="moimoimoimoi"></UserBox>
                                </PopperWrapper>
                            </div>
                        )}
                    ></Tippy>

                    <div className={cx('user')}>
                        <UserBox interactiveUser avatarId="mono" content="Tư Vấn Viên" idUser={contributor}></UserBox>
                        <Button contact option to = '/chat'>Liên lạc</Button>
                    </div>

                    <div className={cx('input-field')}>
                        <div className={cx('sender')}>
                            <div className={cx('heading')}>Việt Nam</div>
                            <form className={cx('input-form')}>
                                <label htmlFor="">Người gửi</label>
                                <input
                                    type="text"
                                    placeholder="Họ và Tên"
                                    onChange={(e) => setSenderNameVN(e.target.value)}
                                ></input>
                                <label htmlFor="">Số điện thoại</label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại người gửi"
                                    onChange={(e) => setPhoneVN(e.target.value)}
                                ></input>
                                <label htmlFor="">Địa chỉ gửi hàng</label>
                                <input
                                    type="text"
                                    placeholder="Địa chỉ người gửi"
                                    onChange={(e) => setSenderAddress(e.target.value)}
                                ></input>
                                <label htmlFor="">Chọn chi nhánh gửi hàng</label>
                                <select onChange={(event) => setShipBranch(event.target.value)}>
                                    <option value="Ha Noi">Hà Nội</option>
                                    <option value="Quang Ninh">Quảng Ninh</option>
                                    <option value="Hai Duong">Hải Dương</option>
                                </select>
                            </form>
                        </div>
                        <div className={cx('receiver')}>
                            <div className={cx('heading')}>Hàn Quốc</div>
                            <form className={cx('input-form')}>
                                <label htmlFor="">Người nhận hàng</label>
                                <input
                                    type="text"
                                    placeholder="Họ và Tên"
                                    onChange={(e) => setSenderNameHQ(e.target.value)}
                                ></input>
                                <label htmlFor="">Số điện thoại</label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại người nhận"
                                    onChange={(e) => setPhoneHQ(e.target.value)}
                                ></input>
                                <label htmlFor="">Địa chỉ nhận hàng</label>
                                <input
                                    type="text"
                                    placeholder="Địa chỉ người gửi"
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                ></input>
                            </form>
                        </div>
                        <div className={cx('order')}>
                            <div className={cx('heading')}>Thông tin đơn hàng</div>
                            <div className={cx('order-container')}>
                                <form className={cx('order-info')}>
                                    <table>
                                        <th>
                                            <tr>
                                                <th>Nhập tên mặt hàng</th>
                                                <th>Số lượng</th>
                                            </tr>
                                        </th>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.name}
                                                            onChange={(event) => {
                                                                const newRows = [...rows];
                                                                newRows[index].name = event.target.value;
                                                                setRows(newRows);
                                                            }}
                                                            placeholder="Tên mặt hàng muốn gửi..."
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.quantity}
                                                            onChange={(event) => {
                                                                const newRows = [...rows];
                                                                newRows[index].quantity = event.target.value;
                                                                setRows(newRows);
                                                            }}
                                                            placeholder="..."
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Button type="button" search onClick={handleAddRow}>
                                        +
                                    </Button>
                                </form>
                                <form className={cx('order-note')}>
                                    <div>Mục ghi chú (Không bắt buộc)</div>
                                    <textarea onChange={(e) => setNote(e.target.value)}></textarea>
                                </form>
                            </div>
                        </div>

                        <div className={cx('submit')}>
                            <Button search onClick={handleSave}>
                                Cập nhật
                            </Button>
                            {}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrder;
