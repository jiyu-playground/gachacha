import Shop from "../components/Shop";
import gachaShopsData from "../data/gacha-shops.json";

const ShopList = () => {
  return (
    <div>
      {gachaShopsData.shops.map((shop) => (
        <Shop key={shop.address_name} {...shop} />
      ))}
    </div>
  );
};

export default ShopList;
