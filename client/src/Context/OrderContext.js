import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderContextProvider = ({ children }) => {
    const [order,setOrder] = useState()
    console.log(order);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
