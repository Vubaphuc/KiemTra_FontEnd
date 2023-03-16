import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const rs = await axios.get("http://localhost:8080/api/v1/cartItems");
      setProducts(rs.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const shouldDelete = window.confirm("Bạn có muốn xóa sản phẩm này không?");
    if (shouldDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/api/v1/cartItems/${productId}`
        );
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleIncrementProduct = async (productId) => {
    try {
      const rs = await axios.put(
        `http://localhost:8080/api/v1/cartItems/${productId}/increment`
      );
      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            count: product.count + 1,
          };
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrementProduct = async (productId) => {
    try {
      const rs = await axios.put(
        `http://localhost:8080/api/v1/cartItems/${productId}/decrement`
      );
      const updatedProducts = products.map((product) => {
        if (product.id === productId && product.count > 1) {
          return {
            ...product,
            count: product.count - 1,
          };
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const totalMoney = products.reduce(
    (acc, product) => acc + product.course.price * product.count,
    0
  );
  const VAT = totalMoney * 0.1;
  const money = totalMoney - VAT;

  return (
    <div className="shopping-cart-container mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              <h2>Shopping Cart</h2>
            </div>
          </div>
        </div>
        <div className="row shopping-cart">
          <div className="col-md-8">
            <div className="product-list">
              {products.length === 0 ? (
                <p className="fst-italic message">
                  Không có sản phẩm trong giỏ hàng
                </p>
              ) : (
                products.map((product) => (
                  <div
                    className="product-item d-flex border mb-4"
                    key={product.id}
                  >
                    <div className="image">
                      <img
                        src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&
                      ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGNsb3RoZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                        alt="sản phẩm 1"
                      />
                    </div>
                    <div className="info d-flex flex-column justify-content-between px-4 py-3 flex-grow-1">
                      <div>
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="text-dark fs-5 fw-normal">
                            {product.course.name}
                          </h2>
                          <h2 className="text-danger fs-5 fw-normal">
                            {product.course.price} VND
                          </h2>
                        </div>
                        <div className="text-black-50">
                          <div className="d-inline-block me-3">
                            <button
                              className="border py-2 px-3 d-inline-block fw-bold bg-light"
                              onClick={() => handleDecrementProduct(product.id)}
                            >
                              -
                            </button>
                            <span className="py-2 px-3 d-inline-block fw-bold">
                              {product.count}
                            </span>
                            <button
                              className="border py-2 px-3 d-inline-block fw-bold bg-light"
                              onClick={() => handleIncrementProduct(product.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          className="text-primary border-0 bg-transparent fw-light"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <span>
                            <i className="fa-solid fa-trash-can"></i>
                          </span>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="bill">
              <div className="border mb-2 p-3 fs-5 fw-normal d-flex justify-content-between align-items-center">
                <span className="text-black-50">Tạm tính:</span>
                <span className="text-primary" id="sub-total-money">
                  {totalMoney} VND
                </span>
              </div>
              <div className="border mb-2 p-3 fs-5 fw-normal d-flex justify-content-between align-items-center">
                <span className="text-black-50">VAT (10%):</span>
                <span className="text-primary" id="vat-money">
                  {VAT} VND
                </span>
              </div>
              <div className="border mb-2 p-3 fs-5 fw-normal d-flex justify-content-between align-items-center">
                <span className="text-black-50">Thành tiền:</span>
                <span className="text-primary" id="total-money">
                  {money} VND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
