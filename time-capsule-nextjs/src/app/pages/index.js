// pages/index.js
import CreateCapsule from "../../../components/CreateCapsule";
import DisplayCapsule from "../../../components/DisplayCapsule";

const Home = () => {
  return (
    <div>
      <h1>Time Capsule</h1>
      <CreateCapsule />
      <DisplayCapsule />
    </div>
  );
};

export default Home;
