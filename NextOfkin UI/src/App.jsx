import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { useState } from "react";

function App() {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });
  const [userAddress, setUserAddress] = useState(function () {
    return JSON.parse(sessionStorage.getItem("userAddress"));
  });

  function handleSubmit() {
    showConnect({
      appDetails: {
        name: "My App",
        icon: "",
      },
      onFinish: function () {
        let {
          profile: {
            stxAddress: { testnet },
          },
        } = userSession.loadUserData();

        console.log(userSession.loadUserData());

        setUserAddress(testnet);
        sessionStorage.clear();
        sessionStorage.setItem("userAddress", JSON.stringify(testnet));
      },
      userSession,
    });
  }

  return (
    <main>
      <nav className="bg-yellow-800 py-[2rem] p-[4rem] flex items-center justify-between">
        <h1 className="text-white text-[2rem]">NextOfKin UI</h1>
        <button
          className="bg-black px-[2rem] py-[.5rem] text-white text-[1.6rem] rounded-[.5rem]"
          onClick={handleSubmit}
        >
          {!userAddress ? "Connect Wallet" : "Wallet Connected"}
        </button>
      </nav>
    </main>
  );
}

export default App;
