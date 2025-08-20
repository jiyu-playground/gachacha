import "../styles/Shop.css";

type ShopItme = {
  place_name: string;
  address_name: string;
  phone: string;
};

const Shop = ({ place_name, address_name, phone }: ShopItme) => {
  return (
    <div className="post-card shop-card">
      <div>🎯 {place_name}</div>
      <div>📍 </div>
      <div>🏠 {address_name}</div>
      <div>📞 {phone === "" ? "전화번호가 없습니다." : phone}</div>
    </div>
  );
};

export default Shop;
