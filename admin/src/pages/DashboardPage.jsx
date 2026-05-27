import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api.js';

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getCustomerName = (order) => {
    return order.customer_name || order.customerName || order.name || order.user_name || `Khách #${order.user_id}`;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'rejected':
        return 'Không xác nhận';
      default:
        return status || 'Không xác định';
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.get('/api/admin/orders');
      const data = response?.data?.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await apiClient.put(`/api/admin/orders/${orderId}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    await updateOrderStatus(orderId, 'confirmed');
  };

  const handleRejectOrder = async (orderId) => {
    await updateOrderStatus(orderId, 'rejected');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  return (
    <div className="page-container">
      <div className="card wide-card">
        <h1>Danh sách đơn hàng</h1>

        {isLoading ? (
          <p>Đang tải đơn hàng...</p>
        ) : (
          <>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5">Chưa có đơn hàng nào.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>{order.id}</td>
                        <td>{getCustomerName(order)}</td>
                        <td>{order.total_price?.toLocaleString ? order.total_price.toLocaleString() : order.total_price}</td>
                        <td>{getStatusLabel(order.status)}</td>
                        <td>
                          {order.status === 'pending' ? (
                            <div className="action-group">
                              <button className="confirm-button" onClick={() => handleConfirmOrder(order.id)}>
                                Xác nhận
                              </button>
                              <button className="reject-button" onClick={() => handleRejectOrder(order.id)}>
                                Không xác nhận
                              </button>
                            </div>
                          ) : order.status === 'confirmed' ? (
                            <div className="action-group">
                              <button className="shipping-button" onClick={() => updateOrderStatus(order.id, 'shipping')}>
                                Đang giao hàng
                              </button>
                              <button className="completed-button" onClick={() => updateOrderStatus(order.id, 'completed')}>
                                Hoàn thành đơn hàng
                              </button>
                            </div>
                          ) : order.status === 'shipping' ? (
                            <div className="action-group">
                              <button className="completed-button" onClick={() => updateOrderStatus(order.id, 'completed')}>
                                Hoàn thành
                              </button>
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                      </tr>
                      <tr className="detail-row">
                        <td colSpan="5">
                          <div className="order-detail">
                            <div>
                              <strong>Chi tiết sản phẩm:</strong>
                              {Array.isArray(order.products) && order.products.length > 0 ? (
                                <table className="product-table">
                                  <thead>
                                    <tr>
                                      <th>Sản phẩm</th>
                                      <th>Số lượng</th>
                                      <th>Giá</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.products.map((product, index) => (
                                      <tr key={index}>
                                        <td>{product.name || product.product_name || 'Sản phẩm'}</td>
                                        <td>{product.quantity ?? product.qty ?? 1}</td>
                                        <td>{product.price?.toLocaleString ? product.price.toLocaleString() : product.price}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>Không có dữ liệu sản phẩm.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
