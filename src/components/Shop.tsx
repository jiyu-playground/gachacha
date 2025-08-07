import ShopItem from "../components/ShopItem";
import gachaShopsData from "../data/gacha-shops.json";

const Shop = () => {
  return (
    <div>
      {gachaShopsData.shops.map((shop) => (
        <ShopItem {...shop} />
      ))}
    </div>
  );
};

export default Shop;
