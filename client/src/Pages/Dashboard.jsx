import React from "react";
import TitleCard from "../Components/TitleCard";
import piggyBank from "./assets/piggyBank.png";
import achievement from "./assets/achievement.png";
import savings from "./assets/savings.png";
import InfoCard from "../Components/InfoCard";
import ProductCard from "../Components/ProductCard";

function Dashboard() {
  return (
    <div className="container mx-auto py-4 px-4 lg:px-0">
      <TitleCard />
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-1 md:gap-2 lg:gap-3 xl:gap-4 mt-4">
        <InfoCard
          image={piggyBank}
          heading={"Active Saving Plans"}
          text={"2"}
        />
        <InfoCard image={achievement} heading={"Plans Achieved"} text={"5"} />
        <InfoCard image={savings} heading={"Amount Saved"} text={"$120,000"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        <ProductCard
          title={"Shoes"}
          description={"Nike Limited edition shoes"}
          total={100}
          amount={40}
          imgUrl={
            "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          }
        />
        <ProductCard
          title={"Watch"}
          description={"Rolex X Armani Limited Edition Watch"}
          total={12000}
          amount={2500}
          imgUrl={
            "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?cs=srgb&dl=pexels-pixabay-277390.jpg&fm=jpg"
          }
        />
        <ProductCard
          title={"Macbook Pro"}
          description={"Apple Brand M1 Model Macbook Pro"}
          total={15500}
          amount={1500}
          imgUrl={
            "https://imageio.forbes.com/specials-images/imageserve/6213c2a05ed1f7de596d35b4/Apple-Brand-M1-Model-Macbook-pro-with-colorful-light-background-/960x0.jpg?height=474&width=711&fit=bounds"
          }
        />
        <ProductCard
          title={"Sofa"}
          description={"Red Leather Sofa"}
          total={5000}
          amount={2000}
          imgUrl={
            "https://img.freepik.com/premium-photo/red-leather-sofa-dark-red-background_994418-5971.jpg"
          }
        />
        <ProductCard
          title={"Bike"}
          description={"Harley Davidson Bike 2024 Model"}
          total={100000}
          amount={50000}
          imgUrl={
            "https://imgd.aeplcdn.com/370x208/n/cw/ec/145595/sportster-s-right-side-view.jpeg?isig=0&q=80"
          }
        />
        <ProductCard
          title={"Airpods"}
          description={"Apple Airpods Pro"}
          total={22500}
          amount={5000}
          imgUrl={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-cQrD-DIYxehpsUi6g_b2xR8DdguujoZvaFxQJVKyQ&s"
          }
        />
      </div>
    </div>
  );
}

export default Dashboard;
