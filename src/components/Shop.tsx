import ShopItem from "../components/ShopItem";
import gachaShopsData from "../data/gacha-shops.json";

const Shop = () => {
  return (
    <div>
      {gachaShopsData.shops.map((shop) => (
        <ShopItem key={shop.address_name} {...shop} />
      ))}
    </div>
  );
};

export default Shop;
