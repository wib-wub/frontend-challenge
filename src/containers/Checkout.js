import React, {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Model from 'react-responsive-modal';
import axios from '../utils/axios';
import {useDispatch} from 'react-redux';

const createOrder = (productIds, userId) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/order', {user_id: userId, product_ids: productIds})
			.then(({data}) => resolve(data.data))
			.catch(error => reject(error));
	});
};

const confirmOrder = (productsCart, userId) => {
	return new Promise((resolve) => {
		const swal = withReactContent(Swal);

		swal
			.fire({
				text: 'ยืนยันการสั่งซื้อ',
				type: 'question',
				showCancelButton: true,
				confirmButtonText: 'ทำการสั่งซื้อ',
				cancelButtonText: 'ยกเลิก',
				reverseButtons: true,
			})
			.then(async result => {
				if (result.value) {
					try {
						const {id} = await createOrder(productsCart, userId);
						swal.fire(
							'สำเร็จ',
							`รหัสการสั่งซ์้อ ${id} การสั่งซื้อเสร็จสมบูรณ์ กรุณาเข้าไปตรวจสอบที่ Orders`,
							'success',
						);
						resolve();
					} catch (error) {
						swal.fire('ล้มเลว', 'กรุณาลองใหม่อีกครั้ง', 'warning');
					}
				}
			});
	});

};

const CheckOutComponent = ({productsCart, userId, className, children}) => {
	const [isOpen, setOpen] = useState(false);
	const dispatch = useDispatch();

	return (
		<div>
			<button className={className} onClick={() => setOpen(!isOpen)}>
				{children}
			</button>
			<Model
				style={{marginTop: '50px'}}
				open={isOpen}
				onClose={() => setOpen(!isOpen)}
				center
			>
				<div style={{margin: '2%'}}>
					<table className="table">
						<thead>
						<tr>
							<th/>
							<th scope="col"> สินค้า</th>
							<th> จำนวน</th>
							<th> ราคา</th>
						</tr>
						</thead>
						<tbody>
						{productsCart.map((product, index) => {
							return (
								<tr key={index}>
									<td>
										<img
											src={product.image_url}
											alt={product.id}
											style={{height: '2em', width: '2em'}}
										/>
									</td>
									<td> {product.name} </td>
									<td> {product.value} </td>
									<td> {product.value * product.price} </td>
								</tr>
							);
						})}
						</tbody>
					</table>
					<button
						className="btn btn-success"
						onClick={async () => {
							setOpen(!isOpen);
							await confirmOrder(productsCart, userId);
							dispatch({type: 'CLEAR_ITEM_CART'});
						}}
					>
						{' '}
						สั่งซื้อ{' '}
					</button>
				</div>
			</Model>
		</div>
	);
};
export default CheckOutComponent;
