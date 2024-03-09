"use client";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

export function Checkout({
  selectedServices,
  setSelectedServices,
  quantityInput,
  setQuantityInput,
}) {
  const handleQuantityChange = (serviceId, quantity) => {
    setQuantityInput((prevQuantityInput) => ({
      ...prevQuantityInput,
      [serviceId]: quantity,
    }));
  };

  const calculateTotalPricePerService = (service) => {
    const quantity = quantityInput[service.key] || 1;
    const totalPrice = service.price * quantity;
    return totalPrice.toFixed(2);
  };

  const calculateTotalPrice = () => {
    return selectedServices
      .reduce((total, service) => {
        const quantity = quantityInput[service.key] || 1;
        const totalPrice = service.price * quantity;
        return total + totalPrice;
      }, 0)
      .toFixed(2);
  };

  const handleRemoveService = (serviceId) => {
    const updatedServices = selectedServices.filter(
      (service) => service.key !== serviceId
    );
    setSelectedServices(updatedServices);
  };

  const handleReset = () => {
    setQuantityInput({});
    setSelectedServices([]);
  };

  return (
    <div className="checkout">
      <div className="scrollable-container">
        <table className="table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.price}</td>
                <td>
                  <input
                    className="quantityInput"
                    type="number"
                    value={quantityInput[service.key] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        service.key,
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </td>
                <td>{calculateTotalPricePerService(service)}</td>
                <td>
                  <button
                    className="table-remove"
                    onClick={() => handleRemoveService(service.key)}
                  >
                    <AiFillCloseCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedServices.length > 0 ? (
        <div className="checkout-bottom">
          <button className="checkout-bottom__btn" onClick={handleReset}>
            Сбросить чек
            <span className="delete-all">
              <MdDeleteForever />
            </span>
          </button>
          <p>
            Общая цена:{" "}
            <span className="total-price">{calculateTotalPrice()} BYN</span>
          </p>
        </div>
      ) : (
        <div className="checkout__null">Чек пуст</div>
      )}
    </div>
  );
}
