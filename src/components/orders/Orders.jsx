import { useContext, useEffect, useState } from "react";
import ContentTop from "../ContentTop/ContentTop";
import { AppContext } from "../../App";
import "./order.css";
import { Link } from "react-router-dom";
const Orders = () => {
  const { setLoader, route } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setLoader(true);
    fetch(`${route}/order`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders))
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  }, []);
  console.log(orders);
  return (
    <>
      <ContentTop headTitle="All Orders" />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Paid</th>
              <th>total price</th>
              <th>request type </th>
              <th>order type </th>
              <th>request details </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.isPaid ? "yes" : "no"}</td>
                <td>{order.totalOrderPrice}</td>
                <td>{order.requestType}</td>
                <td>{order.type}</td>
                <td>
                  <Link
                    to={`/request-progress/${order.requestType}/${order.requestId}`}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
