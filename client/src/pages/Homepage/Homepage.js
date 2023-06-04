import classNames from 'classnames/bind';
import styles from './Homepage.module.scss';
import icons from '~/assets/icons';
import images from '~/assets/images';
import UserBox from '~/components/UserBox';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Homepage() {
    // const navigate = useNavigate(); // <--- initialize useHistory
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                {/* First Content */}
                <div className={cx('first-content')}>
                    <div className={cx('first-content-heading')}>FedFreight</div>
                    <div className={cx('first-content-heading')}>Sẵn sàng sát cánh bên bạn!</div>

                    <div className={cx('first-content-slider')}>
                        <div className={cx('first-content-slides')}>
                            <input
                                type="radio"
                                name="slider-radio-btn"
                                id="radio1"
                                className={cx('radio1')}
                                defaultChecked={true}
                            ></input>
                            <input type="radio" name="slider-radio-btn" id="radio2" className={cx('radio2')}></input>

                            <div className={cx('first-slider')}>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#EAE6C0' }}>
                                    <div className={cx('slider-box-heading')}>ĐA DẠNG GỬI CÁC MẶT HÀNG</div>
                                    <div className={cx('slider-box-text')}>
                                        Không giới hạn gửi các mặt hàng, nhận xử lý hiệu quả các mặt hàng khó đi khi quý
                                        khách gửi hàng từ Việt Nam sang Hàn Quốc một cách nhanh chóng.
                                    </div>
                                    
                                </div>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#C1EAC0' }}>
                                    <div className={cx('slider-box-heading')}>HỖ TRỢ NHẬN HÀNG TẠI NHÀ</div>
                                    <div className={cx('slider-box-text')}>
                                        Cung cấp dịch vụ hỗ trợ lấy hàng tại khu vực nội thành với số lượng đơn hàng
                                        lớn. Hỗ trợ lấy hàng tại các bến xe dành cho các khách hàng ở ngoại thành và
                                        tỉnh lẻ
                                    </div>
                                    
                                </div>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#B5D2ED' }}>
                                    <div className={cx('slider-box-heading')}>THỜI GIAN VẬN CHUYỂN NHANH CHÓNG</div>
                                    <div className={cx('slider-box-text')}>
                                        Với thời gian vận chuyển 7 ngày/tuần, chúng tôi cam kết với khách hàng thời gian
                                        bay và giao hàng đến tận tay nhanh chóng từ 2-4 ngày
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={cx('second-slider')}>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#DFC0EA' }}>
                                    <div className={cx('slider-box-heading')}>QUY TRÌNH VẬN CHUYỂN NGHIÊM NGẶT</div>
                                    <div className={cx('slider-box-text')}>
                                        Giúp khách hàng giảm thiểu tối đa tình trạng hàng hoá bị hư hỏng trong quá trình
                                        vận chuyển sang Hàn Quốc với hệ thống kiểm soát đơn hàng và quy trình giao hàng
                                        nghiêm ngặt
                                    </div>
                                    
                                </div>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#F4BFBF' }}>
                                    <div className={cx('slider-box-heading')}>HỆ THỐNG CHECKING ĐƠN HÀNG</div>
                                    <div className={cx('slider-box-text')}>
                                        Mọi đơn hàng của khách hàng sẽ được cập nhập trên hệ thống checking của chúng
                                        tôi. Để giúp quý khách hàng theo dõi đơn hàng của mình liên tục 24/24
                                    </div>
                                    
                                </div>
                                <div className={cx('slider-box')} style={{ backgroundColor: '#B3BFEB' }}>
                                    <div className={cx('slider-box-heading')}>BẢO HIỂM HÀNG HOÁ TUYỆT ĐỐI</div>
                                    <div className={cx('slider-box-text')}>
                                        Chúng tôi luôn đặt sự an toàn của các kiện hàng lên hàng đầu khi vận chuyển hàng
                                        sang Hàn Quốc. Các kiện hàng được đóng gói, bao bọc cận thận với gói Bảo Hiểm
                                        Hàng Hoá
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('slider-radio-navigation')}>
                        <label htmlFor="radio1" className={cx('radio-manual-btn')}></label>
                        <label htmlFor="radio2" className={cx('radio-manual-btn')}></label>
                    </div>
                </div>
                {/* End First Content */}

                <div className={cx('second-content')}>
                    <div className={cx('second-content-row')}>
                        <div className={cx('second-content-heading')}> Danh mục các hàng hóa được phép vận chuyển</div>
                    </div>

                    <div className={cx('second-content-row')}>
                        <div className={cx('second-content-detail')}>
                            <div className={cx('detail-info-column')}>
                                <div className={cx('detail-info-row')}>
                                    <img src={images.medicine} alt="" className={cx('second-content-img')}></img>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng thuốc tây, dược phẩm, TPCN CSSK+
                                    </div>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <img src={images.candy} alt="" className={cx('second-content-img')}></img>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng thực phẩm chay, hàng đồ khô, bánh kẹo
                                    </div>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <img src={images.wood} alt="" className={cx('second-content-img')}></img>
                                    <div className={cx('second-content-text')}>
                                        Các mặt hàng đồ thủ công mỹ nghệ, gỗ, nội thất
                                    </div>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <img src={images.paper} alt="" className={cx('second-content-img')}></img>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng giấy tờ, hồ sơ, chứng từ, sách vở
                                    </div>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <img src={images.cosmetic} alt="" className={cx('second-content-img')}></img>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng mỹ phẩm, phụ kiện, chăm sóc sắc đẹp
                                    </div>
                                </div>
                            </div>
                            <div className={cx('slice')}></div>
                            <div className={cx('detail-info-column')}>
                                <div className={cx('detail-info-row')}>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng thời trang, quần áo, phụ kiện
                                    </div>
                                    <img src={images.clothes} alt="" className={cx('second-content-img')}></img>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <div className={cx('second-content-text')}>
                                        Mặt hàng điện tử, máy mọc, đồ công nghiệp
                                    </div>
                                    <img src={images.gadget} alt="" className={cx('second-content-img')}></img>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <div className={cx('second-content-text')}>
                                        Các mặt hàng có giá trị hàng hoá cao
                                    </div>
                                    <img src={images.expensive} alt="" className={cx('second-content-img')}></img>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <div className={cx('second-content-text')}>
                                        Các mặt hàng cồng kềnh, hàng dễ hỏng, dễ vỡ
                                    </div>
                                    <img src={images.big} alt="" className={cx('second-content-img')}></img>
                                </div>
                                <div className={cx('detail-info-row')}>
                                    <div className={cx('second-content-text')}>
                                        Hàng thuỷ hải sản khô, hàng đông lạnh
                                    </div>
                                    <img src={images.frozen} alt="" className={cx('second-content-img')}></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('third-content')}>
                    <div className={cx('third-content-column')}>
                        <div className={cx('third-content-heading')}>Trải Nghiệm Của Khách Hàng</div>
                        <div className={cx('third-content-feedback')}>
                            <div className={cx('feedback')}>
                                <img
                                    src={images.example1}
                                    alt=""
                                    className={cx('customer-avatar')}
                                ></img>
                                <div className={cx('customer-details')}>
                                    <div className={cx('customer-name')}>Trần Mỹ Diệu</div>
                                    <div className={cx('customer-text')}>Mình đã nhận được hàng chỉ sau 3 ngày, hàng đông lạnh vẫn còn đông đá, không gì có thể chê nổi!</div>
                                </div>
                            </div>
                            <div className={cx('feedback')}>
                                <img
                                    src={images.example2}
                                    alt=""
                                    className={cx('customer-avatar')}
                                ></img>
                                <div className={cx('customer-details')}>
                                    <div className={cx('customer-name')}>Lê Văn Khiêm</div>
                                    <div className={cx('customer-text')}>Chị họ mình rán con cá chỉ vàng giòn rụm, hàng chuyển sang Việt Nam có 4 ngày mà vẫn còn giòn, mỗi tội nhiều xương!</div>
                                </div>
                            </div>
    
                            <div className={cx('feedback')}>
                                <img
                                    src={images.example3}
                                    alt=""
                                    className={cx('customer-avatar')}
                                ></img>
                                <div className={cx('customer-details')}>
                                    <div className={cx('customer-name')}>Nguyễn Việt Hoàng</div>
                                    <div className={cx('customer-text')}>Rổ gạch ống mà Trần My gửi tôi vẫn còn nguyên, không nhớ đã trả tiền cho shipper chưa nhưng mà anh rất đẹp trai!</div>
                                </div>
                            </div>
                            <div className={cx('feedback')}>
                                <img
                                    src={images.example4}
                                    alt=""
                                    className={cx('customer-avatar')}
                                ></img>
                                <div className={cx('customer-details')}>
                                    <div className={cx('customer-name')}>Ngô Cẩm Lan</div>
                                    <div className={cx('customer-text')}>Bữa có concert bảo anh Tùng bên Hàn gửi về mấy quả dưa chuột ăn giải khát, mình đang diễn khát khô cổ mà shipper giao lên tận sân khấu!</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className={cx('third-content-column')}>
                        <img src={images.contributor} alt="" className={cx('third-content-image')}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
